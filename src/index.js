"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.less");
var React = require("react");
var request = require("superagent");
var ReactDom = require("react-dom");
var antd_1 = require("antd");
var Dragger = antd_1.Upload.Dragger;
var TabPane = antd_1.Tabs.TabPane;
var TextArea = antd_1.Input.TextArea;
var Duizhang = /** @class */ (function (_super) {
    __extends(Duizhang, _super);
    function Duizhang(props) {
        var _this = _super.call(this, props) || this;
        _this.statusChange = function (info) {
            var status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                antd_1.message.success(info.file.name + " file uploaded successfully.");
            }
            else if (status === 'error') {
                antd_1.message.error(info.file.name + " file upload failed.");
            }
        };
        _this.deleteAllFiles = function () {
            request.get('/files/delete-all')
                .then(function (req) {
                req.body.statusCode === 200 && _this.myNotification('success', 'Success', req.body.msg);
                req.body.statusCode !== 200 && _this.myNotification('error', 'Failed', req.body.msg);
            })
                .catch(function () { return _this.myNotification('error', 'Failed', '重置失败，请联系男朋友'); });
        };
        _this.analysAllFiles = function () {
            request.get('/duizhang/analys-all')
                .then(function (req) {
                req.body.statusCode === 200 && _this.myNotification('success', 'Success', req.body.msg);
                req.body.statusCode !== 200 && _this.myNotification('error', 'Failed', req.body.msg);
            })
                .catch(function () { return _this.myNotification('error', 'Failed', '重置失败，请联系男朋友'); });
        };
        _this.myNotification = function (type, msg, des) {
            antd_1.notification[type]({
                message: msg,
                description: des
            });
        };
        _this.onChange = function (value) {
            try {
                var result_1 = [];
                var itemList = value.split('\n');
                itemList.map(function (item) {
                    var operatorName = item.split('-')[0];
                    var department = item.split('-')[1];
                    var hasExisted = result_1.find(function (x) { return x.name === operatorName; });
                    if (operatorName.trim() === '' || department.trim() === '') {
                        return;
                    }
                    if (!hasExisted) {
                        result_1.push({
                            name: operatorName,
                            departments: [department]
                        });
                    }
                    else {
                        hasExisted.departments.push(department);
                    }
                });
                _this.operatorMapDepartment = result_1;
            }
            catch (e) {
                antd_1.message.error('格式错误，请检查');
            }
        };
        _this.submitOperatorMapDepartment = function () {
            request.put('/duizhang/operator-charge-department-list')
                .send({
                list: _this.operatorMapDepartment
            })
                .then(function (req) {
                var _a = req.body, statusCode = _a.statusCode, msg = _a.msg;
                statusCode === 200 && _this.myNotification('success', 'Success', msg);
                statusCode !== 200 && _this.myNotification('error', 'Success', msg);
            })
                .catch(function (e) { return _this.myNotification('error', 'Failed', '网络连接失败，请查看网络情况'); });
        };
        _this.state = {
            showModal1: false,
            relationship: ''
        };
        return _this;
    }
    Duizhang.prototype.render = function () {
        var _this = this;
        var showModal1 = this.state.showModal1;
        return (React.createElement("div", { className: "app-page" },
            React.createElement(Dragger, { name: 'file', multiple: true, action: '/files/upload', onChange: function (info) { return _this.statusChange(info); } },
                React.createElement("p", { className: "ant-upload-drag-icon" },
                    React.createElement(antd_1.Icon, { type: "inbox" })),
                React.createElement("p", null, "\u70B9\u51FB\u56FE\u6807\u4E0A\u4F20"),
                React.createElement("p", null, "\u6216\u8005\u4E00\u6B21\u6027\u62D6\u62FD\u6240\u6709\u6587\u4EF6\u5230\u8BE5\u533A\u57DF")),
            React.createElement("div", { className: "btn-block" },
                React.createElement(antd_1.Button, { onClick: function () { return _this.setState({ showModal1: true }); } }, "\u8BBE\u7F6E"),
                React.createElement(antd_1.Button, { onClick: this.deleteAllFiles }, "\u91CD\u7F6E"),
                React.createElement(antd_1.Button, { onClick: this.analysAllFiles, type: "primary" }, "\u8BA1\u7B97")),
            React.createElement(antd_1.Modal, { title: "设置操作人员与科室", visible: this.state.showModal1, onOk: this.submitOperatorMapDepartment, onCancel: function () { return _this.setState({ showModal1: false }); } },
                React.createElement("p", null, "Some contents..."),
                React.createElement(TextArea, { defaultValue: "asd\nasdd", placeholder: "请输入操作人员与科室的对应关系", autosize: { minRows: 5, maxRows: 20 }, onChange: function (e) { return _this.onChange(e.target.value); } }))));
    };
    return Duizhang;
}(React.PureComponent));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        return _super.call(this, props) || this;
    }
    App.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(antd_1.Tabs, { defaultActiveKey: "1" },
                React.createElement(TabPane, { tab: "对账", key: "1" },
                    React.createElement(Duizhang, null)),
                React.createElement(TabPane, { tab: "考勤", key: "2" },
                    React.createElement("p", null, "asdasd"))));
    };
    return App;
}(React.PureComponent));
;
ReactDom.render(React.createElement(App, null), document.querySelector('#app'));
