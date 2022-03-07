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
exports.BaseAddEditPage = void 0;
var element_plus_1 = require("element-plus");
var vue_1 = require("vue");
// @ts-ignore
var ValidationRuleAdapter_ts_1 = require("../ValidationRuleAdapter.ts");
// @ts-ignore
var BasePage_ts_1 = require("./BasePage.ts");
/**
 * 添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var BaseAddEditPage = /** @class */ (function (_super) {
    __extends(BaseAddEditPage, _super);
    function BaseAddEditPage(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.form = vue_1.ref();
        if (props.rid) {
            _this.loadRowObject().then(function () { return _this.initValidationRule(); });
        }
        else {
            _super.prototype.render.call(_this);
            _this.initValidationRule();
        }
        return _this;
    }
    BaseAddEditPage.prototype.initBaseState = function () {
        return {
            rules: null,
        };
    };
    BaseAddEditPage.prototype.getValidationRuleUrl = function () {
        // @ts-ignore
        return this.getRootActionPath() + "/getValidationRule";
    };
    BaseAddEditPage.prototype.getSubmitUrl = function () {
        // @ts-ignore
        return this.getRootActionPath() + "/saveOrUpdate";
    };
    BaseAddEditPage.prototype.getRowObjectLoadUrl = function () {
        // @ts-ignore
        return this.getRootActionPath() + "/get";
    };
    BaseAddEditPage.prototype.createSubmitParams = function () {
        // remark: this.state.formModel.remark
        var params = {
            id: this.props.rid
        };
        // @ts-ignore
        var model = this.state.formModel;
        if (model) {
            for (var propName in model) {
                params[propName] = model[propName];
            }
        }
        return params;
    };
    BaseAddEditPage.prototype.fillForm = function (rowObject) {
        for (var propName in rowObject) {
            // @ts-ignore
            if (propName in this.state.formModel) {
                // @ts-ignore
                this.state.formModel[propName] = rowObject[propName];
            }
        }
    };
    BaseAddEditPage.prototype.createRowObjectLoadParams = function () {
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
                        params = this.createRowObjectLoadParams();
                        return [4 /*yield*/, ajax({ url: this.getRowObjectLoadUrl(), params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.data) {
                            this.fillForm(result.data);
                            _super.prototype.render.call(this);
                        }
                        else {
                            element_plus_1.ElMessage.error('数据加载失败！');
                        }
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
                        if (result.data) {
                            // @ts-ignore
                            this.state.rules = new ValidationRuleAdapter_ts_1.ValidationRuleAdapter(result.data, function () {
                                return _this.form.value.model;
                            }).getRules();
                        }
                        else {
                            element_plus_1.ElMessage.error('表单校验规则加载失败！');
                        }
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
                        params = this.createSubmitParams();
                        if (!params) return [3 /*break*/, 2];
                        return [4 /*yield*/, ajax({ url: this.getSubmitUrl(), method: "post", params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.data) {
                            element_plus_1.ElMessage.success('保存成功！');
                            this.form.value.resetFields();
                            params.id = result.data;
                            this.doClose();
                            _super.prototype.context.emit('response', params);
                        }
                        else {
                            element_plus_1.ElMessage.error('保存失败！');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    BaseAddEditPage.prototype.doClose = function () {
        _super.prototype.doClose.call(this);
        this.form.value.resetFields();
    };
    BaseAddEditPage.prototype.convertThis = function () {
        var _this = this;
        _super.prototype.convertThis.call(this);
        this.submit = function () {
            _this.doSubmit();
        };
    };
    return BaseAddEditPage;
}(BasePage_ts_1.BasePage));
exports.BaseAddEditPage = BaseAddEditPage;
