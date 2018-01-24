"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var fs = require("fs");
var path = require("path");
var xlsx = require("node-xlsx");
var inversify_1 = require("inversify");
var cache_1 = require("../../services/cache");
var routing_controllers_1 = require("routing-controllers");
var DEBUG = process.env.NODE_ENV === 'development';
var DuiZhangCtrl = /** @class */ (function () {
    function DuiZhangCtrl(Cache$) {
        this.OperatorChargeDepartment = 'OperatorMapDepartment';
        this.operatores = ['陈燕', '龚文静', '黄清晖', '胡云凤', '熊萍萍', '徐子莹', '刘燕英', '吴凯茵'];
        this.cache = Cache$;
        // 初始化 对账操作人员 - 科室 的映射关系
        var list = Cache$.getDuiZhang(this.OperatorChargeDepartment);
        !list && Cache$.setDuiZhang(this.OperatorChargeDepartment, []);
    }
    DuiZhangCtrl.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, {
                            statusCode: 200,
                            msg: '拉取操作人员和科室关系数据成功',
                            data: this.cache.getDuiZhang(this.OperatorChargeDepartment)
                        }];
                }
                catch (e) {
                    return [2 /*return*/, {
                            statusCode: 500,
                            msg: '服务器错误，请联系男朋友',
                            data: []
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    DuiZhangCtrl.prototype.set = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var list, filePosition, a;
            return __generator(this, function (_a) {
                try {
                    list = body.list;
                    filePosition = path.join(__dirname, '../../upload/files');
                    a = this.cache.setDuiZhang(this.OperatorChargeDepartment, list);
                    return [2 /*return*/, {
                            statusCode: 200,
                            msg: '设置成功'
                        }];
                }
                catch (e) {
                    console.log(e);
                    return [2 /*return*/, {
                            statusCode: 500,
                            msg: '设置失败，请联系男朋友'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    DuiZhangCtrl.prototype.analysAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var filePosition_1, files_1, summaryFormItems_1, theBillZfbIncomeIndex_1, theBillWxIncomeIndex_1, result, resultFinal, summaryZfb, summaryWx, summaryTotal, summaryForm, summaryFormBuffer, savePath;
            return __generator(this, function (_a) {
                try {
                    filePosition_1 = path.join(__dirname, '../../upload/files');
                    files_1 = fs.readdirSync(filePosition_1).filter(function (name) { return name.indexOf('~') !== 0; });
                    // 1-1. 若文件为奇数，且不存在.DS_Store，则返回错误
                    if ((files_1.length % 2 === 1 && !files_1.find(function (x) { return x === '.DS_Store'; })) || (files_1.length % 2 === 0 && files_1.find(function (x) { return x === '.DS_Store'; }))) {
                        return [2 /*return*/, {
                                statusCode: 400,
                                msg: '文件数量错误，请关闭所有请重置后重新上传',
                            }];
                    }
                    summaryFormItems_1 = [];
                    theBillZfbIncomeIndex_1 = 0;
                    theBillWxIncomeIndex_1 = 0;
                    result = this.operatores.map(function (name) {
                        var onlyOneFile = files_1.filter(function (x) { return x.indexOf(name) === 0; }).length === 1;
                        var hasExisted = files_1.filter(function (x) { return x.indexOf(name) === 0; }).length === 2;
                        // 只有一份文件，无法分析
                        if (onlyOneFile) {
                            return {
                                name: name,
                                list: [],
                                errMsg: "\u53EA\u4E0A\u4F20\u4E86\u3010" + files_1.filter(function (x) { return x.indexOf(name) === 0; })[0] + "\u3011\uFF0C\u65E0\u6CD5\u5206\u6790",
                                allPass: false,
                                summary: "\u4E0D\u901A\u8FC7",
                            };
                        }
                        // 若当天存在 当前操作人员的 两份表格
                        if (hasExisted) {
                            var twoFiles = files_1.filter(function (x) { return x.indexOf(name) !== -1; });
                            var billFormName = twoFiles.find(function (x) { return x.indexOf('账单') !== -1; });
                            var reportFormName = twoFiles.find(function (x) { return x.indexOf('日报') !== -1; });
                            var reportForm = xlsx.parse(filePosition_1 + "/" + reportFormName);
                            var billForm = xlsx.parse(filePosition_1 + "/" + billFormName);
                            // 【日报】（表头在第一行） - 表头、操作人员、微信、支付宝 下标
                            var reportHeaderIndex = 0;
                            var reportWxIndex_1 = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '微信'; });
                            var reportZfbIndex_1 = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '支付宝'; });
                            var reportOperatorIndex_1 = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '操作人员'; });
                            theBillWxIncomeIndex_1 = reportWxIndex_1;
                            theBillZfbIncomeIndex_1 = reportZfbIndex_1;
                            // 【账单】支付宝、微信的 表 的下标
                            var billZfbIndex = billForm.findIndex(function (x) { return x.name === '支付宝'; });
                            var billWxIndex = billForm.findIndex(function (x) { return x.name === '微信'; });
                            ;
                            // 【账单】（支付宝的表头第三行、微信的表头在五行）
                            var billZfbHeaderIndex = 2;
                            var billWxHeaderIndex = 4;
                            // 【账单】拿到微信、支付宝的 收入、备注 下标
                            var billZfbIncomeIndex_1 = billForm[billZfbIndex].data[billZfbHeaderIndex].findIndex(function (x) { return x === '收入（+元）'; });
                            var billZfbRemarkIndex_1 = billForm[billZfbIndex].data[billZfbHeaderIndex].findIndex(function (x) { return x === '备注'; });
                            var billWxIncomeIndex_1 = billForm[billWxIndex].data[billWxHeaderIndex].findIndex(function (x) { return x === '交易金额(元)'; });
                            var billWxRemarkIndex_1 = billForm[billWxIndex].data[billWxHeaderIndex].findIndex(function (x) { return x === '备注'; });
                            // 【日报】当前操作人员的所有条目
                            var operatorRows = reportForm[0].data.filter(function (x) { return x[reportOperatorIndex_1] === name; });
                            // 【科室】当前操作人员所负责的所有科室
                            var operatorMapDepartmenItem = _this.cache.getDuiZhang(_this.OperatorChargeDepartment);
                            var targetItem = operatorMapDepartmenItem.filter(function (x) { return x.name === name; });
                            // 【错误】未对当前操作人员，设置 操作人员与科室的映射关系
                            if (targetItem.length === 0) {
                                return {
                                    name: name,
                                    list: [],
                                    allPass: false,
                                    summary: '不通过',
                                    errMsg: "\u672A\u8BBE\u7F6E\u3010" + name + "\u5BF9\u5E94\u7684\u79D1\u5BA4\u3011\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u7F6E"
                                };
                            }
                            var departments_1 = targetItem[0].departments;
                            // 【账单-支付宝】当前操作人员负责全部科室的所有条目
                            var zfbRows = billForm[billZfbIndex].data.filter(function (x) { return departments_1.find(function (dname) { return dname === x[billZfbRemarkIndex_1]; }); });
                            // 【账单-微信】当前操作人员负责全部科室的所有条目
                            var wxRows = billForm[billWxIndex].data.filter(function (x) { return departments_1.find(function (dname) { return dname === x[billWxRemarkIndex_1]; }); });
                            // 【日报／支付宝】汇总
                            var reportFormZfbTotal = operatorRows.reduce(function (pre, next) { return (next[reportZfbIndex_1] ? Number(next[reportZfbIndex_1]) * 100 : 0) + pre; }, 0) / 100;
                            // 【日报／微信】汇总
                            var reportFormWxTotal = operatorRows.reduce(function (pre, next) { return (next[reportWxIndex_1] ? Number(next[reportWxIndex_1]) * 100 : 0) + pre; }, 0) / 100;
                            // 【账单／支付宝】汇总
                            var billFormZfbTotal = zfbRows.reduce(function (pre, next) { return (next[billZfbIncomeIndex_1] ? Number(next[billZfbIncomeIndex_1]) * 100 : 0) + pre; }, 0) / 100;
                            // 【账单／微信】汇总
                            var billFormWxTotal = wxRows.reduce(function (pre, next) { return (next[billWxIncomeIndex_1] ? Number(next[billWxIncomeIndex_1]) * 100 : 0) + pre; }, 0) / 100;
                            //【日报／汇总】表头
                            var reportFormHeader = reportForm[0].data[0];
                            if (summaryFormItems_1.length === 0) {
                                summaryFormItems_1.push(reportFormHeader);
                            }
                            //【日报／汇总】汇总所有提交者所负责的条目
                            summaryFormItems_1 = summaryFormItems_1.concat(operatorRows);
                            // 验证结果
                            var zfbResult = '';
                            var wxResult = '';
                            //【校验-支付宝】
                            if (reportFormZfbTotal === 0) {
                                // 日报金额为0，账单金额为0
                                if (zfbRows.length === 0) {
                                    zfbResult = "\u5BA1\u6838\u901A\u8FC7\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormZfbTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormZfbTotal + "\u5143\u76F8\u7B49\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                    // 日报金额为0，账单金额不为0
                                }
                                else {
                                    zfbResult = "\u5BA1\u6838\u5931\u8D25\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormZfbTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormZfbTotal + "\u5143\u4E0D\u76F8\u7B49\uFF0C\u8BF7\u91CD\u65B0\u6838\u5BF9\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                }
                            }
                            else {
                                // 日报金额不为0，账单金额为0( 未填写备注 )
                                if (zfbRows.length === 0) {
                                    zfbResult = "\u5BA1\u6838\u5931\u8D25\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormZfbTotal + "\u5143\uFF0C\u4F46\u3010\u8D26\u5355\uFF0F\u652F\u4ED8\u5B9D\u3011\u8868\u683C\u7684\u4E2D\uFF0C\u6CA1\u6709\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u7684\u5907\u6CE8\uFF0C\u8BF7\u8865\u4E0A\u5907\u6CE8\u540E\u91CD\u73B0\u63D0\u4EA4\u3002";
                                    // 日报金额不为0，账单金额为0
                                }
                                else {
                                    zfbResult = "\u5BA1\u6838" + (reportFormZfbTotal === billFormZfbTotal ? '通过' : '失败') + "\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormZfbTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormZfbTotal + "\u5143" + (reportFormZfbTotal === billFormZfbTotal ? '相等' : '不相等') + "\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                }
                            }
                            //【校验-微信】
                            if (reportFormWxTotal === 0) {
                                // 日报金额为0，账单金额为0
                                if (wxRows.length === 0) {
                                    wxResult = "\u5BA1\u6838\u901A\u8FC7\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormWxTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormWxTotal + "\u5143\u76F8\u7B49\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                    // 日报金额为0，账单金额不为0
                                }
                                else {
                                    wxResult = "\u5BA1\u6838\u5931\u8D25\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormWxTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormWxTotal + "\u5143\u4E0D\u76F8\u7B49\uFF0C\u8BF7\u91CD\u65B0\u6838\u5BF9\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                }
                            }
                            else {
                                // 日报金额不为0，账单金额为0( 未填写备注 )
                                if (wxRows.length === 0) {
                                    wxResult = "\u5BA1\u6838\u5931\u8D25\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormWxTotal + "\u5143\uFF0C\u4F46\u3010\u8D26\u5355\uFF0F\u5FAE\u4FE1\u3011\u8868\u683C\u7684\u4E2D\uFF0C\u6CA1\u6709\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u7684\u5907\u6CE8\uFF0C\u8BF7\u8865\u4E0A\u5907\u6CE8\u540E\u91CD\u73B0\u63D0\u4EA4\u3002";
                                    // 日报金额为0，账单金额不为0
                                }
                                else {
                                    wxResult = "\u5BA1\u6838" + (reportFormWxTotal === billFormWxTotal ? '通过' : '失败') + "\uFF0C\u3010\u65E5\u62A5\u91D1\u989D\u3011" + reportFormWxTotal + "\u5143\u4E0E\u3010\u8D26\u5355\u91D1\u989D\u3011" + billFormWxTotal + "\u5143" + (reportFormWxTotal === billFormWxTotal ? '相等' : '不相等') + "\u3002\u5979\u5F53\u5929\u8D1F\u8D23\u7684\u79D1\u5BA4\u4E3A\u3010" + departments_1.join('、') + "\u3011\u3002";
                                }
                            }
                            // 验证结果
                            return {
                                name: name,
                                errMsg: '',
                                summary: "" + ((reportFormZfbTotal === billFormZfbTotal && reportFormWxTotal === billFormWxTotal) ? '通过' : '不通过'),
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
                            };
                        }
                        return undefined;
                    });
                    resultFinal = result.filter(function (x) { return x !== undefined; });
                    // 2-1. 【日报】生成汇总
                    if (resultFinal.length > 0) {
                        summaryZfb = (summaryFormItems_1.slice(1).reduce(function (pre, next) { return (next[theBillZfbIncomeIndex_1] ? Number(next[theBillZfbIncomeIndex_1]) * 100 : 0) + pre; }, 0)) / 100;
                        summaryWx = (summaryFormItems_1.slice(1).reduce(function (pre, next) { return (next[theBillWxIncomeIndex_1] ? Number(next[theBillWxIncomeIndex_1]) * 100 : 0) + pre; }, 0)) / 100;
                        summaryTotal = [];
                        summaryTotal[theBillZfbIncomeIndex_1] = "\u5408\u8BA1: " + summaryZfb + "\u5143";
                        summaryTotal[theBillWxIncomeIndex_1] = "\u5408\u8BA1: " + summaryWx + "\u5143";
                        //【日报／汇总】合计
                        summaryFormItems_1[summaryFormItems_1.length] = summaryTotal;
                        summaryForm = [
                            {
                                name: 'sheet1',
                                data: summaryFormItems_1
                            }
                        ];
                        summaryFormBuffer = xlsx.build(summaryForm);
                        savePath = path.join(__dirname, '../../static/download');
                        if (!fs.existsSync(savePath)) {
                            fs.mkdirSync(savePath);
                        }
                        fs.writeFileSync(savePath + "/summary.xlsx", summaryFormBuffer);
                    }
                    return [2 /*return*/, {
                            msg: '分析成功',
                            statusCode: 200,
                            data: {
                                result: resultFinal,
                                dowmloadUrl: "/static/download/summary.xlsx"
                            }
                        }];
                }
                catch (e) {
                    console.log(e);
                    return [2 /*return*/, {
                            msg: '分析失败，请点击”重置“后重试。或请联系男朋友。',
                            statusCode: 500,
                            data: {
                                result: [],
                                dowmloadUrl: ''
                            }
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        routing_controllers_1.Get('/operator-charge-department-list'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DuiZhangCtrl.prototype, "list", null);
    __decorate([
        routing_controllers_1.Put('/operator-charge-department-list'),
        __param(0, routing_controllers_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], DuiZhangCtrl.prototype, "set", null);
    __decorate([
        routing_controllers_1.Get('/analys-all'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DuiZhangCtrl.prototype, "analysAll", null);
    DuiZhangCtrl = __decorate([
        routing_controllers_1.JsonController('/duizhang'),
        inversify_1.injectable(),
        __param(0, inversify_1.inject(cache_1.Cache)),
        __metadata("design:paramtypes", [cache_1.Cache])
    ], DuiZhangCtrl);
    return DuiZhangCtrl;
}());
exports.DuiZhangCtrl = DuiZhangCtrl;
