"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Koa = require("koa");
var path = require("path");
var KoaLog = require("koa-logs-full");
var KoaServer = require("koa-static2");
var controllers_1 = require("./controllers");
var inversify_config_1 = require("./inversify.config");
var app_config_1 = require("./config/app.config");
var routing_controllers_1 = require("routing-controllers");
var app = new Koa();
app
    .use(KoaServer('static', __dirname + '/static'))
    .use(KoaLog(app, {
    logdir: path.join(__dirname, 'logs')
}));
routing_controllers_1.useContainer(inversify_config_1.ioc);
routing_controllers_1.useKoaServer(app, {
    controllers: controllers_1.default
});
if (process.env.NODE_ENV === 'development') {
    app.listen(app_config_1.serverConfig.devPort);
    console.log("running in " + app_config_1.serverConfig.devPort + " with " + process.env.NODE_ENV + ".");
}
else {
    app.listen(app_config_1.serverConfig.proPort);
    console.log("running in " + app_config_1.serverConfig.proPort + " with " + process.env.NODE_ENV + ".");
}
