import 'reflect-metadata';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'node-xlsx';
import { injectable, inject } from 'inversify';
import { Cache } from '../../services/cache';
import { JsonController, Put, Ctx, Get, Body } from 'routing-controllers';

const DEBUG = process.env.NODE_ENV === 'development';

@JsonController('/duizhang')
@injectable( )
export class DuiZhangCtrl {

  private readonly OperatorChargeDepartment = 'OperatorMapDepartment'
  private readonly operatores = ['陈燕','龚文静','黄清晖','胡云凤','熊萍萍','徐子莹','刘燕英','吴凯茵'];

  private cache: Cache;

  constructor(
    @inject( Cache ) Cache$: Cache) {
      this.cache = Cache$;
      // 初始化 对账操作人员 - 科室 的映射关系
      const list = Cache$.getDuiZhang( this.OperatorChargeDepartment);
      !list && Cache$.setDuiZhang( this.OperatorChargeDepartment, [ ]);
  }

  @Get('/operator-charge-department-list')
  async list( ) {
    try {
      return {
        statusCode: 200,
        msg: '拉取操作人员和科室关系数据成功',
        data: this.cache.getDuiZhang( this.OperatorChargeDepartment )
      }
    } catch ( e ){
      return {
        statusCode: 500,
        msg: '服务器错误，请联系男朋友',
        data: [ ]
      }
    }
  }

  @Put('/operator-charge-department-list')
  async set(
      @Body( ) body ) {
        try {

          const list = body.list;
          const filePosition = path.join( __dirname, '../../upload/files' );
          const a = this.cache.setDuiZhang( this.OperatorChargeDepartment, list );

          return {
            statusCode: 200,
            msg: '设置成功'
          };
        } catch ( e ) {
          console.log( e );
          return {
            statusCode: 500,
            msg: '设置失败，请联系男朋友'
          };
        }
  }

  @Get('/analys-all')
  async analysAll( ) {
    try {

      // 1. 读取files底下所有文件名，不包含 '~&' 这类正在打开的excel文件
      const filePosition = path.join( __dirname, '../../upload/files' );
      const files = fs.readdirSync( filePosition ).filter( name => name.indexOf('~') !== 0 );

      // 1-1. 若文件为奇数，且不存在.DS_Store，则返回错误
      if (( files.length % 2 === 1 && !files.find( x => x === '.DS_Store' )) || ( files.length % 2 === 0 && files.find( x => x === '.DS_Store' ) )) {
        return {
          statusCode: 400,
          msg: '文件数量错误，请关闭所有请重置后重新上传',
        }
      }

      // 2. 【日报】一个汇总表
      let summaryFormItems: any[ ] = [ ];
      let theBillZfbIncomeIndex = 0;
      let theBillWxIncomeIndex = 0;


      // 3. 根据操作人员操作两张表单（日报、账单）, name为当前操作人员名字
      const result = this.operatores.map( name => {

        const onlyOneFile = files.filter( x => x.indexOf( name ) === 0 ).length === 1;
        const hasExisted = files.filter( x => x.indexOf( name ) === 0 ).length === 2;

        // 只有一份文件，无法分析
        if ( onlyOneFile ) {
          return {
            name,
            list: [ ],
            errMsg: `只上传了【${files.filter( x => x.indexOf( name ) === 0 )[0]}】，无法分析`,
            allPass: false,
            summary: `不通过`,
          };
        }

        
        // 若当天存在 当前操作人员的 两份表格
        if ( hasExisted ) {

          const twoFiles = files.filter( x => x.indexOf( name ) !== -1 );
          const billFormName = twoFiles.find( x => x.indexOf('账单') !== -1 );
          const reportFormName = twoFiles.find( x => x.indexOf('日报') !== -1 );
          const reportForm = xlsx.parse(`${filePosition}/${reportFormName}`);
          const billForm = xlsx.parse(`${filePosition}/${billFormName}`);

          // 【日报】（表头在第一行） - 表头、操作人员、微信、支付宝 下标
          const reportHeaderIndex = 0;
          const reportWxIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '微信');
          const reportZfbIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '支付宝');
          const reportOperatorIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '操作人员');

          theBillWxIncomeIndex = reportWxIndex;
          theBillZfbIncomeIndex = reportZfbIndex;

          // 【账单】支付宝、微信的 表 的下标
          const billZfbIndex = billForm.findIndex( x => x.name === '支付宝');
          const billWxIndex = billForm.findIndex( x => x.name === '微信');;
          // 【账单】（支付宝的表头第三行、微信的表头在五行）
          const billZfbHeaderIndex = 2;
          const billWxHeaderIndex = 4;
          // 【账单】拿到微信、支付宝的 收入、备注 下标
          const billZfbIncomeIndex = billForm[ billZfbIndex ].data[ billZfbHeaderIndex ].findIndex( x => x === '收入（+元）');
          const billZfbRemarkIndex = billForm[ billZfbIndex ].data[ billZfbHeaderIndex ].findIndex( x => x === '备注' );
          const billWxIncomeIndex = billForm[ billWxIndex ].data[ billWxHeaderIndex ].findIndex( x => x === '交易金额(元)');
          const billWxRemarkIndex = billForm[ billWxIndex ].data[ billWxHeaderIndex ].findIndex( x => x === '备注');

          // 【日报】当前操作人员的所有条目
          const operatorRows = reportForm[ 0 ].data.filter( x => x[ reportOperatorIndex ] === name );

          // 【科室】当前操作人员所负责的所有科室
          const operatorMapDepartmenItem: operatorMapDepartmenItem[] = this.cache.getDuiZhang( this.OperatorChargeDepartment );
          const targetItem = operatorMapDepartmenItem.filter( x => x.name === name );
          
          // 【错误】未对当前操作人员，设置 操作人员与科室的映射关系
          if ( targetItem.length === 0 ) {
            return {
              name,
              list: [ ],
              allPass: false,
              summary: '不通过',
              errMsg: `未设置【${name}对应的科室】，请检查设置`
            }
          }

          const departments = targetItem[ 0 ].departments;

          // 【账单-支付宝】当前操作人员负责全部科室的所有条目
          const zfbRows = billForm[ billZfbIndex ].data.filter( x => departments.find( dname => dname ===  x[ billZfbRemarkIndex ]))

          // 【账单-微信】当前操作人员负责全部科室的所有条目
          const wxRows = billForm[ billWxIndex ].data.filter( x => departments.find( dname => dname ===  x[ billWxRemarkIndex ]))

          // 【日报／支付宝】汇总
          const reportFormZfbTotal = operatorRows.reduce(( pre, next ) => ( next[ reportZfbIndex ] ? Number( next[ reportZfbIndex ]) * 100 : 0 ) + pre, 0 ) / 100;

          // 【日报／微信】汇总
         const reportFormWxTotal = operatorRows.reduce(( pre, next ) => ( next[ reportWxIndex ] ? Number( next[ reportWxIndex ]) * 100 : 0 ) + pre, 0 ) / 100;

          // 【账单／支付宝】汇总
          const billFormZfbTotal = zfbRows.reduce(( pre, next ) => ( next[ billZfbIncomeIndex ] ? Number( next[ billZfbIncomeIndex ]) * 100 : 0 ) + pre, 0 ) / 100;

          // 【账单／微信】汇总
          const billFormWxTotal = wxRows.reduce(( pre, next ) => ( next[ billWxIncomeIndex ] ? Number( next[ billWxIncomeIndex ]) * 100 : 0 ) + pre, 0 ) / 100;

          //【日报／汇总】表头
          const reportFormHeader = reportForm[ 0 ].data[ 0 ];
          if ( summaryFormItems.length === 0 ) {
            summaryFormItems.push( reportFormHeader );
          }

          //【日报／汇总】汇总所有提交者所负责的条目
          summaryFormItems = [ ...summaryFormItems, ...operatorRows ];

          // 验证结果
          let zfbResult = '';
          let wxResult = '';

          //【校验-支付宝】
          if ( reportFormZfbTotal === 0 ) {

            // 日报金额为0，账单金额为0
            if ( zfbRows.length === 0 ) {
              zfbResult = `审核通过，【日报金额】${reportFormZfbTotal}元与【账单金额】${billFormZfbTotal}元相等。她当天负责的科室为【${departments.join('、')}】。`;
            // 日报金额为0，账单金额不为0
            } else {
              zfbResult = `审核失败，【日报金额】${reportFormZfbTotal}元与【账单金额】${billFormZfbTotal}元不相等，请重新核对。她当天负责的科室为【${departments.join('、')}】。`
            }

          } else {

            // 日报金额不为0，账单金额为0( 未填写备注 )
            if ( zfbRows.length === 0 ) {
              zfbResult = `审核失败，【日报金额】${reportFormZfbTotal}元，但【账单／支付宝】表格的中，没有科室为【${departments.join('、')}】的备注，请补上备注后重现提交。`;
            // 日报金额不为0，账单金额为0
            } else {
              zfbResult = `审核${ reportFormZfbTotal === billFormZfbTotal ? '通过' : '失败' }，【日报金额】${reportFormZfbTotal}元与【账单金额】${billFormZfbTotal}元${ reportFormZfbTotal === billFormZfbTotal ? '相等' : '不相等' }。她当天负责的科室为【${departments.join('、')}】。`;
            }

          }

          //【校验-微信】
          if ( reportFormWxTotal === 0 ) {

            // 日报金额为0，账单金额为0
            if ( wxRows.length === 0 ) {
              wxResult = `审核通过，【日报金额】${reportFormWxTotal}元与【账单金额】${billFormWxTotal}元相等。她当天负责的科室为【${departments.join('、')}】。`;
            // 日报金额为0，账单金额不为0
            } else {
              wxResult = `审核失败，【日报金额】${reportFormWxTotal}元与【账单金额】${billFormWxTotal}元不相等，请重新核对。她当天负责的科室为【${departments.join('、')}】。`
            }

          } else {

            // 日报金额不为0，账单金额为0( 未填写备注 )
            if ( wxRows.length === 0 ) {
              wxResult = `审核失败，【日报金额】${reportFormWxTotal}元，但【账单／微信】表格的中，没有科室为【${departments.join('、')}】的备注，请补上备注后重现提交。`;
            // 日报金额为0，账单金额不为0
            } else {
              wxResult = `审核${ reportFormWxTotal === billFormWxTotal ? '通过' : '失败' }，【日报金额】${reportFormWxTotal}元与【账单金额】${billFormWxTotal}元${ reportFormWxTotal === billFormWxTotal ? '相等' : '不相等' }。她当天负责的科室为【${departments.join('、')}】。`;
            }

          }

          // 验证结果
          return {
            name,
            errMsg: '',
            summary: `${(reportFormZfbTotal === billFormZfbTotal && reportFormWxTotal === billFormWxTotal) ? '通过' : '不通过'}`,
            allPass: reportFormZfbTotal === billFormZfbTotal && reportFormWxTotal === billFormWxTotal,
            list: [
              {
                type: 'zfb',
                billFormTotal: billFormZfbTotal,
                reportFormTotal: reportFormZfbTotal,
                status: reportFormZfbTotal === billFormZfbTotal,
                text: zfbResult
              },
              {
                type: 'wx',
                billFormTotal: billFormWxTotal,
                reportFormTotal: reportFormWxTotal,
                status: billFormWxTotal === reportFormWxTotal,
                text: wxResult
              }
            ]
          }
        }

        return undefined;

      });

      const resultFinal = result.filter( x => x!== undefined );

      // 2-1. 【日报】生成汇总
      if ( resultFinal.length > 0 ) {

        //【日报／汇总】支付宝合计
        let summaryZfb = ( summaryFormItems.slice(1).reduce(( pre, next ) => ( next[ theBillZfbIncomeIndex ] ? Number( next[ theBillZfbIncomeIndex ]) * 100 : 0 ) + pre, 0 )) / 100;

        //【日报／汇总】微信合计
        let summaryWx = ( summaryFormItems.slice(1).reduce(( pre, next ) => ( next[ theBillWxIncomeIndex ] ? Number( next[ theBillWxIncomeIndex ]) * 100 : 0 ) + pre, 0 )) / 100;

        let summaryTotal: any[] = [ ];
        summaryTotal[ theBillZfbIncomeIndex ] = `合计: ${summaryZfb}元`;
        summaryTotal[ theBillWxIncomeIndex ] = `合计: ${summaryWx}元`;

        //【日报／汇总】合计
        summaryFormItems[ summaryFormItems.length ] = summaryTotal;

        const summaryForm = [
          {
            name: 'sheet1',
            data: summaryFormItems
          }
        ]

        const summaryFormBuffer = xlsx.build( summaryForm );
        const savePath = path.join( __dirname, '../../static/download' );
        if ( !fs.existsSync( savePath )) {
          fs.mkdirSync( savePath );
        }

        fs.writeFileSync( `${savePath}/summary.xlsx`, summaryFormBuffer );

      }
      

      return {
        msg: '分析成功',
        statusCode: 200,
        data: {
          result: resultFinal,
          dowmloadUrl: `/static/download/summary.xlsx`
        }
      };

    } catch ( e ) {
      console.log( e );
      return {
        msg: '分析失败，请点击”重置“或检查表格格式后重试。或请联系男朋友。',
        statusCode: 500,
        data: {
          result: [ ],
          dowmloadUrl: ''
        }
      };
    }
  }

}

type operatorMapDepartmenItem = {
  name: string
  departments: string[]
}