import './index.less';
import * as React from 'react';
import * as request from 'superagent';
import * as ReactDom from 'react-dom';
import { Upload, message, Icon, Button, notification, Tabs, Modal, Input, List, Avatar, Card } from 'antd';

const Dragger = Upload.Dragger;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class Duizhang extends React.PureComponent<{ }, DuiZhangState > {

  private operatorMapDepartment: operatorMapDepartmenItem[ ];

  constructor( props ) {
     super( props );
     this.state = {
      result: [ ],
      relationship: '',
      showModal1: false,
    }
  }

  componentDidMount( ) {
    this.getOperatorMapDepartment( );
  }

  // 文件上传状态
  statusChange = info => {
    const status = info.file.status;
    if ( status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if ( status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

 // 清空所有文件
  deleteAllFiles = ( ) => {
    request.get('/files/delete-all')
           .then( req => {
             req.body.statusCode === 200 && this.myNotification( 'success', 'Success', req.body.msg );
             req.body.statusCode !== 200 && this.myNotification( 'error', 'Failed', req.body.msg );
           })
           .catch(( ) => this.myNotification( 'error', 'Failed', '重置失败，请联系男朋友' ));
  }

  // 分析所有文件
  analysAllFiles = ( ) => {
    request.get('/duizhang/analys-all')
           .then( req => {
              const { statusCode, msg, data } = req.body;
              statusCode === 200 && this.myNotification( 'success', 'Success', msg );
              statusCode !== 200 && this.myNotification( 'error', 'Failed', msg );
              this.setState({
                result: data
              });
           })
           .catch(( ) => this.myNotification( 'error', 'Failed', '重置失败，请联系男朋友' ));
  }

  // 复用函数
  myNotification = ( type, msg, des ) => {
    notification[ type ]({
      message: msg,
      description: des
    });
  }

  // 操作人员 - 科室映射
  onChange = value => {

    this.setState({
      relationship: value
    });

    try {
      let result: operatorMapDepartmenItem[ ] = [ ];
      const itemList = value.split('\n');
      
      itemList.map( item => {
        const operatorName = item.split('-')[ 0 ];
        const department = item.split('-')[ 1 ];
        const hasExisted = result.find( x => x.name === operatorName );

        if ( operatorName.trim( ) === '' || department.trim( ) === '' ) {
          return;
        }

        if ( !hasExisted ) {
          result.push({
            name: operatorName,
            departments: [ department ]
          });
        } else {
          hasExisted.departments.push( department );
        }
      });

      this.operatorMapDepartment = result;

    } catch ( e ) {
      message.error('格式错误，请检查');
    }
  }

  // 提交 操作人员 - 科室映射
  submitOperatorMapDepartment = ( ) => {
    request.put('/duizhang/operator-charge-department-list')
           .send({
             list: this.operatorMapDepartment
           })
           .then( req => {

             const { statusCode, msg } = req.body;
             statusCode === 200 && this.myNotification('success', 'Success', msg );
             statusCode !== 200 && this.myNotification('error', 'Failed', msg );

             this.setState({
               showModal1: false
             })

           })
           .catch(( ) => this.myNotification('error', 'Failed', '网络连接失败，请查看网络情况'))
  }

  // 拉取 操作人员 - 科室映射
  getOperatorMapDepartment = ( ) => {
      request.get('/duizhang/operator-charge-department-list')
          .then( req => {

            let result = '';
            const { statusCode, msg, data } = req.body;
            statusCode === 200 && this.myNotification('success', 'Success', msg );
            statusCode !== 200 && this.myNotification('error', 'Success', msg );

            data.map(( item: operatorMapDepartmenItem ) => {
              const { name, departments } = item
              departments.map( x => {
                result += `${name}-${x}\n`;
              })
            });

            this.setState({
              relationship: result
            })

          })
          .catch(( ) => this.myNotification('error', 'Failed', '网络连接失败，请查看网络情况'))
  }

  render( ) {
    const { relationship, result } = this.state;
    return (
      <div className="app-page">

        <Dragger
          name ='file'
          multiple = { true }
          action = '/files/upload'
          onChange = { info => this.statusChange( info )}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p>点击图标上传</p>
          <p>或者一次性拖拽所有文件到该区域</p>
        </Dragger>

        <div className="btn-block">
          <Button onClick={( ) => this.setState({ showModal1: true })}>设置</Button>
          <Button onClick={ this.deleteAllFiles }>重置</Button>
          <Button onClick={ this.analysAllFiles } type="primary">计算</Button>
        </div>

        <div className="result-block">
        {
           result.length !== 0 &&
           <Card title={`审核结果`} style={{ width: '100%' }}>
              <List
                itemLayout='horizontal'
                dataSource={ result }
                renderItem={ item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={ <a style={{ fontSize: 18 }}>{ item.name } <span style={{ fontSize: 16 }}>{ item.summary }</span></a>}
                      description={
                        item.list.map(( li, key ) => (
                          <p key={ key }>
                            {
                              li.status ?
                                <Icon type="check-circle" style={{ color: '#52c41a' }} /> :
                                <Icon type="close-circle" style={{ color: '#f5222d' }} />
                            }
                            { li.type === 'wx' ? '【微信】' : '【支付宝】' }
                            { li.text }
                          </p>
                        ))
                      }
                    />
                  </List.Item>
                )}
              > 
              </List>
            </Card>
        }
        </div>

        {
          ( result.length !== 0 && !result.find( x => x.allPass === false )) &&
            <a>点击下载</a>
        }
        

        <Modal
          title="设置操作人员与科室"
          visible={ this.state.showModal1 }
          onOk={ this.submitOperatorMapDepartment }
          onCancel={( ) => this.setState({ showModal1: false })}
        >
          <p>格式为：操作人员-科室</p>

          <TextArea
            value={ relationship }
            placeholder="请输入操作人员与科室的对应关系"
            autosize={{ minRows: 5, maxRows: 20 }}
            onChange={ e => this.onChange( e.target.value )}
          />
      </Modal>
      </div>
    )
  }
}

class App extends React.PureComponent<{ }, { } > {

  constructor( props ) {
    super( props );
  }

  render( ) {
    return <div>
      <Tabs defaultActiveKey="1" >
         <TabPane tab="对账" key="1">
          <Duizhang />
         </TabPane>
         <TabPane tab="考勤" key="2">
          <p>asdasd</p>
         </TabPane>
      </Tabs>
    </div>
  }
}

interface DuiZhangState {
  // 操作人员 - 科室映射
  showModal1: boolean
  // 操作人员 - 科室映射
  relationship: string
  // 结果列表
  result: {
    name: string
    allPass: boolean,
    summary: string
    errMsg: string
    list: {
      text: string
      billFormTotal: number
      reportFormTotal: number
      type: 'zfb' | 'wx'
      status: 'success' | 'fail'
    }[ ]
  }[ ]
};

type operatorMapDepartmenItem = {
  name: string
  departments: string[]
}

ReactDom.render(
  <App />,
  document.querySelector('#app')
);