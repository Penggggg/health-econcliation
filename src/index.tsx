import './index.less';
import * as React from 'react';
import * as request from 'superagent';
import * as ReactDom from 'react-dom';
import { Upload, message, Icon, Button, notification, Tabs, Modal, Input, message } from 'antd';

const Dragger = Upload.Dragger;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class Duizhang extends React.PureComponent<{ }, DuiZhangState > {

  private operatorMapDepartment: operatorMapDepartmenItem[ ];

  constructor( props ) {
     super( props );
     this.state = {
      showModal1: false,
      relationship: ''
    }
  }

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

  deleteAllFiles = ( ) => {
    request.get('/files/delete-all')
           .then( req => {
             req.body.statusCode === 200 && this.myNotification( 'success', 'Success', req.body.msg );
             req.body.statusCode !== 200 && this.myNotification( 'error', 'Failed', req.body.msg );
           })
           .catch(( ) => this.myNotification( 'error', 'Failed', '重置失败，请联系男朋友' ));
  }

  analysAllFiles = ( ) => {
    request.get('/duizhang/analys-all')
           .then( req => {
             req.body.statusCode === 200 && this.myNotification( 'success', 'Success', req.body.msg );
             req.body.statusCode !== 200 && this.myNotification( 'error', 'Failed', req.body.msg );
           })
           .catch(( ) => this.myNotification( 'error', 'Failed', '重置失败，请联系男朋友' ));
  }

  myNotification = ( type, msg, des ) => {
    notification[ type ]({
      message: msg,
      description: des
    });
  }

  onChange = value => {

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

  submitOperatorMapDepartment = ( ) => {
    request.put('/duizhang/operator-charge-department-list')
           .send({
             list: this.operatorMapDepartment
           })
           .then( req => {
             const { statusCode, msg } = req.body;
             statusCode === 200 && this.myNotification('success', 'Success', msg );
             statusCode !== 200 && this.myNotification('error', 'Success', msg );
           })
           .catch( e => this.myNotification('error', 'Failed', '网络连接失败，请查看网络情况'))
  }

  render( ) {
    const { showModal1 } = this.state;
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
        <Modal
          title="设置操作人员与科室"
          visible={ this.state.showModal1 }
          onOk={ this.submitOperatorMapDepartment }
          onCancel={( ) => this.setState({ showModal1: false })}
        >
          <p>Some contents...</p>
          <TextArea
            defaultValue={`asd\nasdd`}
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
};

type operatorMapDepartmenItem = {
  name: string
  departments: string[]
}

ReactDom.render(
  <App />,
  document.querySelector('#app')
);