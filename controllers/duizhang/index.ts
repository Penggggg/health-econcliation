import 'reflect-metadata';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'node-xlsx';
import { injectable, inject } from 'inversify';
import { Cache } from '../../services/cache';
import { JsonController, Post, Ctx, Get } from 'routing-controllers';

const DEBUG = process.env.NODE_ENV === 'development';

@JsonController('/duizhang')
@injectable( )
export class DuiZhangCtrl {

  private readonly OperatorChargeDepartment = 'OperatorMapDepartment'
  private readonly operatores = ['陈燕','龚文静','黄清晖','胡云凤','熊萍萍','徐子莹','刘燕英'];

  private cache: Cache;

  constructor(
    @inject( Cache ) Cache$: Cache) {
      this.cache = Cache$;
      // 初始化 对账操作人员 - 科室 的映射关系
      this.cache.setDuiZhang( this.OperatorChargeDepartment, [ ]);
  }

  @Get('/operator-charge-department-list')
  async list( ) {
    return this.cache.getDuiZhang( this.OperatorChargeDepartment );
  }

  @Get('/analys-all')
  async analysAll( ) {
    try {

      // 1. 读取files底下所有文件名
      const filePosition = path.join( __dirname, '../../upload/files' );
      const files = fs.readdirSync( filePosition );

      // 1-1. 若文件为奇数，且不存在.DS_Store，则返回错误
      if (( files.length % 2 === 1 && !files.find( x => x === '.DS_Store' )) || ( files.length % 2 === 0 && files.find( x => x === '.DS_Store' ) )) {
        return {
          statusCode: 400,
          msg: '文件数量错误，请重置后重新上传',
        }
      }

      // 2. 根据操作人员寻找两张表单（日报、账单）, name为当前操作人员名字
      const result = this.operatores.map( name => {

        const hasExisted = files.find( x => x.indexOf( name ) !== -1 );
        // 若当天存在 当前操作人员的两份表格
        if ( hasExisted ) {

          const twoFiles = files.filter( x => x.indexOf( name ) !== -1 );
          const billFormName = twoFiles.find( x => x.indexOf('账单') !== -1 );
          const reportFormName = twoFiles.find( x => x.indexOf('日报') !== -1 );
          const reportForm = xlsx.parse(`${filePosition}/${reportFormName}`);
          const billForm = xlsx.parse(`${filePosition}/${billFormName}`);

          // 【日报】（表头在第一行） - 表头、操作人员、微信、支付宝 下标
          const reportHeaderIndex = 0;
          const reportWxIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '微信');
          const reportXfbIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '支付宝');
          const reportOperatorIndex = reportForm[ 0 ].data[ reportHeaderIndex ].findIndex( x => x === '操作人员');

          const operatorRows = reportForm[ 0 ].data.filter( x => x[ reportOperatorIndex ] === name );

          // 【账单】支付宝、微信的 表下表
          const billZfbIndex = billForm.findIndex( x => x.name === '支付宝');
          const billWxIndex = billForm.findIndex( x => x.name === '微信');;
          // 【账单】（支付宝的表头第三行、微信的表头在五行）
          const billZfbHeaderIndex = 2;
          const billWxHeaderIndex = 4;
          // 拿到微信、支付宝的 收入、备注 下标
          const billZfbIncomeIndex = billForm[ billZfbIndex ].data[ billZfbHeaderIndex ].findIndex( x => x === '收入（+元）');
          const billZfbRemarkIndex = billForm[ billZfbIndex ].data[ billZfbHeaderIndex ].findIndex( x => x === '备注' );
          const billWxIncomeIndex = billForm[ billWxIndex ].data[ billWxHeaderIndex ].findIndex( x => x === '交易金额(元)');
          const billWxRemarkIndex = billForm[ billWxIndex ].data[ billWxHeaderIndex ].findIndex( x => x === '备注');

          // 2-1. 核对支付宝的 - 返回true/false

          // 2-2. 核对微信的 - 返回true/false

        }
      });

      return {
        msg: '分析成功',
        statusCode: 200
      };
    } catch ( e ) {
      console.log( e );
      return {
        msg: '重置失败，请联系男朋友',
        statusCode: 500
      };
    }
  }

}