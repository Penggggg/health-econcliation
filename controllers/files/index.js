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
var asyncBusboy = require("async-busboy");
var routing_controllers_1 = require("routing-controllers");
var DEBUG = process.env.NODE_ENV === 'development';
var UploadCtrl = /** @class */ (function () {
    function UploadCtrl() {
        this.operatores = ['陈燕', '龚文静', '黄清晖', '胡云凤', '熊萍萍', '徐子莹', '刘燕英'];
    }
    UploadCtrl.prototype.upload = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, files, fields, filePosition_1, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, asyncBusboy(ctx.req)];
                    case 1:
                        _a = _b.sent(), files = _a.files, fields = _a.fields;
                        filePosition_1 = path.join(__dirname, '../../upload/files');
                        files.map(function (x) {
                            console.log("\u6B63\u5728\u5B58\u50A8: " + x.filename);
                            x.pipe(fs.createWriteStream(filePosition_1 + "/" + x.filename));
                        });
                        return [2 /*return*/, 1];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UploadCtrl.prototype.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filePosition, deleteFolder_1;
            return __generator(this, function (_a) {
                try {
                    filePosition = path.join(__dirname, '../../upload/files');
                    deleteFolder_1 = function (path) {
                        if (fs.existsSync(path)) {
                            var files = fs.readdirSync(path);
                            files.forEach(function (file) {
                                if (fs.statSync(path + "/" + file).isDirectory()) {
                                    deleteFolder_1(path + "/" + file);
                                }
                                else {
                                    fs.unlinkSync(path + "/" + file);
                                    console.log("\u6210\u529F\u5220\u9664\u6587\u4EF6\uFF1A" + path + "/" + file);
                                }
                            });
                        }
                    };
                    deleteFolder_1(filePosition);
                    return [2 /*return*/, {
                            msg: '重置成功',
                            statusCode: 200
                        }];
                }
                catch (e) {
                    return [2 /*return*/, {
                            msg: '重置失败，请联系男朋友',
                            statusCode: 500
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    UploadCtrl.prototype.analysAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filePosition_2, files_1, result;
            return __generator(this, function (_a) {
                try {
                    filePosition_2 = path.join(__dirname, '../../upload/files');
                    files_1 = fs.readdirSync(filePosition_2);
                    // 1-1. 若文件为奇数，且不存在.DS_Store，则返回错误
                    if ((files_1.length % 2 === 1 && !files_1.find(function (x) { return x === '.DS_Store'; })) || (files_1.length % 2 === 0 && files_1.find(function (x) { return x === '.DS_Store'; }))) {
                        return [2 /*return*/, {
                                statusCode: 400,
                                msg: '文件数量错误，请重置后重新上传',
                            }];
                    }
                    result = this.operatores.map(function (name) {
                        var hasExisted = files_1.find(function (x) { return x.indexOf(name) !== -1; });
                        // 若当天存在 当前操作人员的两份表格
                        if (hasExisted) {
                            var twoFiles = files_1.filter(function (x) { return x.indexOf(name) !== -1; });
                            var billFormName = twoFiles.find(function (x) { return x.indexOf('账单') !== -1; });
                            var reportFormName = twoFiles.find(function (x) { return x.indexOf('日报') !== -1; });
                            var reportForm = xlsx.parse(filePosition_2 + "/" + reportFormName);
                            var billForm = xlsx.parse(filePosition_2 + "/" + billFormName);
                            // 【日报】（表头在第一行） - 表头、操作人员、微信、支付宝 下标
                            var reportHeaderIndex = 0;
                            var reportWxIndex = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '微信'; });
                            var reportXfbIndex = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '支付宝'; });
                            var reportOperatorIndex_1 = reportForm[0].data[reportHeaderIndex].findIndex(function (x) { return x === '操作人员'; });
                            var operatorRows = reportForm[0].data.filter(function (x) { return x[reportOperatorIndex_1] === name; });
                            // 【账单】支付宝、微信的 表下表
                            var billZfbIndex = billForm.findIndex(function (x) { return x.name === '支付宝'; });
                            var billWxIndex = billForm.findIndex(function (x) { return x.name === '微信'; });
                            ;
                            // 【账单】（支付宝的表头第三行、微信的表头在五行）
                            var billZfbHeaderIndex = 2;
                            var billWxHeaderIndex = 4;
                            // 拿到微信、支付宝的 收入、备注 下标
                            var billZfbIncomeIndex = billForm[billZfbIndex].data[billZfbHeaderIndex].findIndex(function (x) { return x === '收入（+元）'; });
                            var billZfbRemarkIndex = billForm[billZfbIndex].data[billZfbHeaderIndex].findIndex(function (x) { return x === '备注'; });
                            var billWxIncomeIndex = billForm[billWxIndex].data[billWxHeaderIndex].findIndex(function (x) { return x === '交易金额(元)'; });
                            var billWxRemarkIndex = billForm[billWxIndex].data[billWxHeaderIndex].findIndex(function (x) { return x === '备注'; });
                            // 2-1. 核对支付宝的 - 返回true/false
                            // 2-2. 核对微信的 - 返回true/false
                        }
                    });
                    return [2 /*return*/, {
                            msg: '分析成功',
                            statusCode: 200
                        }];
                }
                catch (e) {
                    console.log(e);
                    return [2 /*return*/, {
                            msg: '重置失败，请联系男朋友',
                            statusCode: 500
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        routing_controllers_1.Post('/upload'),
        __param(0, routing_controllers_1.Ctx()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UploadCtrl.prototype, "upload", null);
    __decorate([
        routing_controllers_1.Get('/delete-all'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], UploadCtrl.prototype, "deleteAll", null);
    __decorate([
        routing_controllers_1.Get('/analys-all'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], UploadCtrl.prototype, "analysAll", null);
    UploadCtrl = __decorate([
        routing_controllers_1.JsonController('/files'),
        inversify_1.injectable()
    ], UploadCtrl);
    return UploadCtrl;
}());
exports.UploadCtrl = UploadCtrl;
