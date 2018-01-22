"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controllers_1 = require("./controllers");
var inversify_1 = require("inversify");
exports.ioc = new inversify_1.Container();
/** controllers bind */
controllers_1.default.map(function (ctrl) { return exports.ioc.bind(ctrl).toSelf(); });
