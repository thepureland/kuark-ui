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
exports.OrgSupportAddEditPage = void 0;
var element_plus_1 = require("element-plus");
// @ts-ignore
var TenantSupportAddEditPage_ts_1 = require("./TenantSupportAddEditPage.ts");
/**
 * 组织机构支持的添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var OrgSupportAddEditPage = /** @class */ (function (_super) {
    __extends(OrgSupportAddEditPage, _super);
    function OrgSupportAddEditPage(props, context, parentCascader) {
        var _this = _super.call(this, props, context) || this;
        _this.parentCascader = parentCascader;
        _this.convertThis();
        return _this;
    }
    OrgSupportAddEditPage.prototype.initVars = function () {
        _super.prototype.initVars.call(this);
        var _self = this;
        this.state.cascaderProps = {
            lazy: true,
            value: "id",
            label: "name",
            multiple: false,
            checkStrictly: true,
            expandTrigger: "hover",
            lazyLoad: function (node, resolve) {
                _self.loadTreeNodes(node, resolve);
            },
        };
        this.state.formModel.parent = [];
    };
    OrgSupportAddEditPage.prototype.createSubmitParams = function () {
        var params = _super.prototype.createSubmitParams.call(this);
        var nodes = this.parentCascader.value.getCheckedNodes();
        params.tenantId = this.getTenantId(nodes[0]);
        params.parentId = this.getParentId(nodes[0]);
        params.subSysDictCode = this.state.formModel.parent[0];
        return params;
    };
    OrgSupportAddEditPage.prototype.fillForm = function (rowObject) {
        _super.prototype.fillForm.call(this, rowObject);
        var parents = [rowObject.subSysDictCode];
        if (rowObject.tenantId) {
            parents.push(rowObject.tenantId);
        }
        var parentIds = rowObject.parentIds;
        if (parentIds) {
            for (var _i = 0, parentIds_1 = parentIds; _i < parentIds_1.length; _i++) {
                var parentId = parentIds_1[_i];
                parents.push(parentId);
            }
        }
        this.state.formModel.parent = parents;
    };
    OrgSupportAddEditPage.prototype.doLoadTreeNodes = function (node, resolve) {
        return __awaiter(this, void 0, void 0, function () {
            var dictItems, subSyses, _i, dictItems_1, item, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(node.level === 0)) return [3 /*break*/, 1];
                        dictItems = this.getDictItems("kuark:sys", "sub_sys");
                        subSyses = [];
                        for (_i = 0, dictItems_1 = dictItems; _i < dictItems_1.length; _i++) {
                            item = dictItems_1[_i];
                            subSyses.push({ id: item.first, name: item.second });
                        }
                        resolve(subSyses);
                        return [3 /*break*/, 3];
                    case 1:
                        params = {
                            subSysDictCode: this.getSubSysDictCode(node),
                            tenantId: this.getTenantId(node),
                            parentId: this.getParentId(node),
                            active: true
                        };
                        return [4 /*yield*/, ajax({ url: "user/organization/lazyLoadTree", method: "post", params: params })];
                    case 2:
                        result = _a.sent();
                        if (result.code == 200) {
                            resolve(result.data);
                        }
                        else {
                            element_plus_1.ElMessage.error('组织机构树加载失败！');
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrgSupportAddEditPage.prototype.getSubSysDictCode = function (node) {
        while (node.parent) {
            node = node.parent;
        }
        return node.data.id;
    };
    OrgSupportAddEditPage.prototype.getTenantId = function (node) {
        while (node.parent) {
            if (node.data.organization === false) {
                return node.data.id;
            }
            node = node.parent;
        }
        return null;
    };
    OrgSupportAddEditPage.prototype.getParentId = function (node) {
        if (node.data.organization === false || node.parent == undefined) {
            return null;
        }
        return node.data.id;
    };
    OrgSupportAddEditPage.prototype.convertThis = function () {
        var _this = this;
        _super.prototype.convertThis.call(this);
        this.loadTreeNodes = function (node, resolve) {
            _this.doLoadTreeNodes(node, resolve);
        };
    };
    return OrgSupportAddEditPage;
}(TenantSupportAddEditPage_ts_1.TenantSupportAddEditPage));
exports.OrgSupportAddEditPage = OrgSupportAddEditPage;
