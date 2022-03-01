"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
exports.BasePage = void 0;
var vue_1 = require("vue");
var moment = require("moment");
var element_plus_1 = require("element-plus");
// @ts-ignore
var Pair_ts_1 = require("../Pair.ts");
/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var BasePage = /** @class */ (function () {
    function BasePage() {
        var _this = this;
        this.getDictItems = function (module, dictType) {
            var key = (module ? module : "") + '---' + dictType;
            var map = _this.dictCache[key];
            var pairs = [];
            if (map) {
                for (var k in map) {
                    pairs.push(new Pair_ts_1.Pair(k, map[k]));
                }
            }
            return pairs;
        };
        this.formatBool = function (value) {
            return value ? "是" : "否";
        };
        this.formatDate = function (date, formatStr) {
            if (formatStr === void 0) { formatStr = 'YYYY-MM-DD HH:mm:ss'; }
            if (date) {
                if (date instanceof Array) {
                    date = date.slice(0, 6);
                }
                return moment(date).format(formatStr);
            }
            return '';
        };
        if (!window["dictCache"]) {
            window["dictCache"] = new Map();
        }
        this.dictCache = window["dictCache"];
        this.state = vue_1.reactive(this.initBaseState());
        var initState = this.initState();
        if (initState) {
            var additionalState = vue_1.reactive(initState);
            Object.assign(this.state, additionalState);
        }
        this.__convertThis();
    }
    BasePage.prototype.doTransDict = function (module, dictType, code) {
        if (code) {
            var key = (module ? module : "") + '---' + dictType;
            var itemMap = this.dictCache[key];
            if (itemMap) {
                var name_1 = itemMap[code];
                return name_1 != null ? name_1 : code;
            }
            else {
                return code;
            }
        }
        return '';
    };
    BasePage.prototype.loadDict = function (module, dictType) {
        return __awaiter(this, void 0, void 0, function () {
            var key, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = (module ? module : "") + '---' + dictType;
                        if (this.dictCache[key]) {
                            return [2 /*return*/];
                        }
                        params = {
                            module: module,
                            dictType: dictType
                        };
                        return [4 /*yield*/, ajax({ url: "sys/dictItem/getDictItemMap", params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.data) {
                            this.dictCache[key] = result.data;
                        }
                        else {
                            element_plus_1.ElMessage.error('字典项加载失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BasePage.prototype.loadDicts = function (moduleAndTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _i, moduleAndTypes_1, obj, module_1, dictType, key, result, key, parts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        for (_i = 0, moduleAndTypes_1 = moduleAndTypes; _i < moduleAndTypes_1.length; _i++) {
                            obj = moduleAndTypes_1[_i];
                            module_1 = obj.first ? obj.first : "";
                            dictType = obj.second;
                            key = module_1 + '---' + dictType;
                            if (!this.dictCache[key]) {
                                params.push({
                                    module: module_1,
                                    dictType: dictType
                                });
                            }
                        }
                        if (params.length == 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, ajax({ url: "sys/dictItem/batchGetDictItemMap", method: "post", params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.data) {
                            for (key in result.data) {
                                parts = key.substr(1, key.length - 2).split(", ");
                                this.dictCache[parts[0] + "---" + parts[1]] = result.data[key];
                            }
                        }
                        else {
                            element_plus_1.ElMessage.error('批量加载字典项失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    BasePage.prototype.__convertThis = function () {
        var _this = this;
        this.transDict = function (module, type, code) {
            return _this.doTransDict(module, type, code);
        };
    };
    return BasePage;
}());
exports.BasePage = BasePage;
