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
Object.defineProperty(exports, "__esModule", { value: true });
var LRU = require("lru-cache");
var inversify_1 = require("inversify");
var Cache = /** @class */ (function () {
    function Cache() {
        var _this = this;
        this.cacheOptions = {
            maxAge: 30 * 24 * 60 * 60 * 1000
        };
        this.getDuiZhang = function (key) {
            return _this.DuiZhangCache.get(key);
        };
        this.setDuiZhang = function (key, value) {
            _this.DuiZhangCache.set(key, value);
        };
        this.DuiZhangCache = LRU(this.cacheOptions);
    }
    Cache = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], Cache);
    return Cache;
}());
exports.Cache = Cache;