"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.BaseDetailPage = void 0;
// @ts-ignore
var BasePage_ts_1 = require("./BasePage.ts");
var element_plus_1 = require("element-plus");
/**
 * 详情页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var BaseDetailPage = /** @class */ (function (_super) {
    __extends(BaseDetailPage, _super);
    function BaseDetailPage(props, context) {
        var _this = _super.call(this, props, context) || this;
        if (props.rid) {
            var promise = _this.preLoad();
            if (promise) {
                var self_1 = _this;
                promise.then(function () {
                    self_1.loadData();
                    self_1.loadOthers();
                });
            }
            else {
                _this.loadData();
            }
        }
        else {
            console.error("rid不能为空！");
        }
        return _this;
    }
    BaseDetailPage.prototype.initBaseState = function () {
        return {
            detail: null,
            rid: '',
        };
    };
    BaseDetailPage.prototype.initState = function () {
    };
    BaseDetailPage.prototype.preLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BaseDetailPage.prototype.showAfterLoadData = function () {
        return true;
    };
    BaseDetailPage.prototype.getDetailLoadUrl = function () {
        // @ts-ignore
        return this.getRootActionPath() + "/getDetail";
    };
    BaseDetailPage.prototype.createDetailLoadParams = function () {
        return {
            // @ts-ignore
            id: this.props.rid
        };
    };
    BaseDetailPage.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = this.createDetailLoadParams();
                        return [4 /*yield*/, ajax({ url: this.getDetailLoadUrl(), params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.code == 200) {
                            this.postLoadDataSuccessfully(result.data);
                        }
                        else {
                            element_plus_1.ElMessage.error('数据加载失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseDetailPage.prototype.postLoadDataSuccessfully = function (data) {
        // @ts-ignore
        this.state.detail = data;
        if (this.showAfterLoadData()) {
            this.render();
        }
    };
    BaseDetailPage.prototype.loadOthers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BaseDetailPage.prototype.convertThis = function () {
        _super.prototype.convertThis.call(this);
    };
    return BaseDetailPage;
}(BasePage_ts_1.BasePage));
exports.BaseDetailPage = BaseDetailPage;
