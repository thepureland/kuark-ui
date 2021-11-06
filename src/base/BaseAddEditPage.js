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
exports.BaseAddEditPage = void 0;
var element_plus_1 = require("element-plus");
var vue_1 = require("vue");
// @ts-ignore
var ValidationRuleAdapter_ts_1 = require("./ValidationRuleAdapter.ts");
var BaseAddEditPage = /** @class */ (function () {
    function BaseAddEditPage(props, context) {
        var _this = this;
        this.form = null;
        this.props = props;
        this.context = context;
        this.form = vue_1.ref();
        this.visible = vue_1.computed({
            get: function () { return _this.props.modelValue; },
            set: function () {
            }
        });
        this.state = vue_1.reactive(this.initBaseState());
        var additionalState = vue_1.reactive(this.initState());
        Object.assign(this.state, additionalState);
        if (this.props.rid) {
            this.loadRowObject().then(function () { return _this.initValidationRule(); });
        }
        else {
            this.initValidationRule();
        }
        this._convertThis(); // 为了解决恶心的this问题，无任何业务逻辑代码
    }
    BaseAddEditPage.prototype.initBaseState = function () {
        return {
            rules: null,
        };
    };
    BaseAddEditPage.prototype.getRowObjectLoadParams = function () {
        return {
            id: this.props.rid
        };
    };
    BaseAddEditPage.prototype.loadRowObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = this.getRowObjectLoadParams();
                        return [4 /*yield*/, ajax({ url: this.getRowObjectLoadUrl(), params: params })];
                    case 1:
                        result = _a.sent();
                        this.fillForm(result.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseAddEditPage.prototype.initValidationRule = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax({ url: this.getValidationRuleUrl() })];
                    case 1:
                        result = _a.sent();
                        this.state.rules = new ValidationRuleAdapter_ts_1.ValidationRuleAdapter(result.data, function () {
                            return _this.form.value.model;
                        }).getRules();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseAddEditPage.prototype.doSubmit = function () {
        var _this = this;
        this.form.value.validate(function (valid) { return __awaiter(_this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!valid)
                            return [2 /*return*/, element_plus_1.ElMessage.error('验证未通过')];
                        params = this.getSubmitParams();
                        return [4 /*yield*/, ajax({ url: this.getSubmitUrl(), method: "post", params: params })];
                    case 1:
                        result = _a.sent();
                        this.form.value.resetFields();
                        this.context.emit('response');
                        this.context.emit('update:modelValue', false);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BaseAddEditPage.prototype.doClose = function () {
        this.form.value.resetFields();
        this.context.emit('update:modelValue', false);
    };
    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    BaseAddEditPage.prototype._convertThis = function () {
        var _this = this;
        this.submit = function () {
            _this.doSubmit();
        };
        this.close = function () {
            _this.doClose();
        };
    };
    return BaseAddEditPage;
}());
exports.BaseAddEditPage = BaseAddEditPage;
