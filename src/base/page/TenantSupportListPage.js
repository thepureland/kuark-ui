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
exports.TenantSupportListPage = void 0;
var element_plus_1 = require("element-plus");
var BaseListPage_ts_1 = require("./BaseListPage.ts");
var Pair_ts_1 = require("../Pair.ts");
/**
 * 多租户支持的列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var TenantSupportListPage = /** @class */ (function (_super) {
    __extends(TenantSupportListPage, _super);
    function TenantSupportListPage(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.initTenantVars();
        _this.loadDicts([
            new Pair_ts_1.Pair("kuark:sys", "sub_sys")
        ]).then(function () { return _this.loadTenants(); });
        return _this;
    }
    TenantSupportListPage.prototype.initTenantVars = function () {
        var searchParams = this.state.searchParams;
        if (!searchParams) {
            searchParams = {};
            this.state.searchParams = searchParams;
        }
        searchParams.subSysOrTenant = null;
        this.state.subSysDictCode = null;
        this.state.tenantId = null;
        this.state.subSysOrTenants = null;
        var self = this;
        this.state.cascaderProps = {
            multiple: false,
            checkStrictly: self.isCheckStrictly(),
            expandTrigger: "hover"
        };
    };
    TenantSupportListPage.prototype.isCheckStrictly = function () {
        return true;
    };
    TenantSupportListPage.prototype.isRequireSubSysOrTenantForSearch = function () {
        return true;
    };
    TenantSupportListPage.prototype.createSearchParams = function () {
        var pair = this.parseSubSysOrTenant();
        if (pair == null) {
            return null;
        }
        else {
            var params = _super.prototype.createSearchParams.call(this);
            params.subSysDictCode = pair.first;
            this.state.subSysDictCode = pair.first;
            params.tenantId = pair.second;
            this.state.tenantId = pair.second;
            return params;
        }
    };
    TenantSupportListPage.prototype.parseSubSysOrTenant = function () {
        var subSysOrTenant = this.state.searchParams.subSysOrTenant;
        if (this.isRequireSubSysOrTenantForSearch() && (subSysOrTenant == null || subSysOrTenant.length == 0)) {
            element_plus_1.ElMessage.error('请先选择子系统/租户！');
            return null;
        }
        var pair = new Pair_ts_1.Pair(null, null);
        if (subSysOrTenant) {
            if (subSysOrTenant.length > 0) {
                pair.first = subSysOrTenant[0];
            }
            if (subSysOrTenant.length > 1) {
                pair.second = subSysOrTenant[1];
            }
        }
        return pair;
    };
    TenantSupportListPage.prototype.doAfterAdd = function (params) {
        var subSysDictCode = params.subSysDictCode;
        var tenantId = params.tenantId;
        var subSysOrTenant = [subSysDictCode];
        if (tenantId) {
            subSysOrTenant.push(tenantId);
        }
        this.state.searchParams.subSysOrTenant = subSysOrTenant;
        _super.prototype.doAfterAdd.call(this, params);
    };
    TenantSupportListPage.prototype.loadTenants = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, options, subSyses, _i, subSyses_1, subSys, subSysOption, tenants, tenantOptions, tenantId, tenantOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax({ url: "sys/tenant/getAllActiveTenants", method: "post" })];
                    case 1:
                        result = _a.sent();
                        if (result.code == 200) {
                            options = [];
                            subSyses = this.getDictItems("kuark:sys", "sub_sys");
                            for (_i = 0, subSyses_1 = subSyses; _i < subSyses_1.length; _i++) {
                                subSys = subSyses_1[_i];
                                subSysOption = { value: subSys.first, label: subSys.second };
                                options.push(subSysOption);
                                tenants = result.data[subSys.first];
                                if (tenants) {
                                    tenantOptions = [];
                                    subSysOption["children"] = tenantOptions;
                                    for (tenantId in tenants) {
                                        tenantOption = { value: tenantId, label: tenants[tenantId] };
                                        tenantOptions.push(tenantOption);
                                    }
                                }
                            }
                            this.state.subSysOrTenants = options;
                        }
                        else {
                            element_plus_1.ElMessage.error('加载租户信息失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return TenantSupportListPage;
}(BaseListPage_ts_1.BaseListPage));
exports.TenantSupportListPage = TenantSupportListPage;
