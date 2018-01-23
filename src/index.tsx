import './index.less';
import * as React from 'react';
import * as request from 'superagent';
import * as ReactDom from 'react-dom';
import { Upload, message, Icon, Button, notification, Tabs } from 'antd';

const Dragger = Upload.Dragger;
const TabPane = Tabs.TabPane;

class Duizhang extends React.PureComponent<{ }, { }> {

  constructor( props ) {
     super( props );
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
    request.get('/files/analys-all')
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

  render( ) {
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
          <Button>设置</Button>
          <Button onClick={ this.deleteAllFiles }>重置</Button>
          <Button onClick={ this.analysAllFiles } type="primary">计算</Button>
        </div>
      </div>
    )
  }
}

class App extends React.PureComponent<{ }, { }> {
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

ReactDom.render(
  <App />,
  document.querySelector('#app')
);