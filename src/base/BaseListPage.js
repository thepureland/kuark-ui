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
exports.BaseListPage = void 0;
var vue_1 = require("vue");
var element_plus_1 = require("element-plus");
/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
var BaseListPage = /** @class */ (function () {
    function BaseListPage() {
        this.state = vue_1.reactive(this.initBaseState());
        var additionalState = vue_1.reactive(this.initState());
        Object.assign(this.state, additionalState);
        this._convertThis(); // 为了解决恶心的this问题，无任何业务逻辑代码
    }
    BaseListPage.prototype.initBaseState = function () {
        return {
            tableData: [],
            sort: {
                orderProperty: '',
                orderDirection: ''
            },
            pagination: {
                total: 0,
                pageNo: 1,
                pageSize: 10
            },
            addDialogVisible: false,
            editDialogVisible: false,
            rid: '',
        };
    };
    BaseListPage.prototype.createDeleteParams = function (row) {
        return {
            id: row.id
        };
    };
    BaseListPage.prototype.getDeleteMessage = function () {
        return '确定要删除该数据？';
    };
    BaseListPage.prototype.doSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = this.createSearchParams();
                        if (this.state.sort.orderProperty) {
                            params["orders"] = [{
                                    property: this.state.sort.orderProperty,
                                    direction: this.state.sort.orderDirection,
                                }];
                        }
                        return [4 /*yield*/, ajax({ url: this.getSearchUrl(), method: "post", params: params })];
                    case 1:
                        result = _a.sent();
                        if (result.data) {
                            this.state.tableData = result.data.first;
                            this.state.pagination.total = result.data.second;
                        }
                        else {
                            element_plus_1.ElMessage.error('查询失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseListPage.prototype.doHandleSizeChange = function (newSize) {
        this.state.pagination.pageSize = newSize;
        this.search();
    };
    BaseListPage.prototype.doHandleCurrentChange = function (newCurrent) {
        if (newCurrent) {
            this.state.pagination.pageNo = newCurrent;
            this.search();
        }
    };
    BaseListPage.prototype.doResetSearchFields = function () {
    };
    BaseListPage.prototype.doHandleSortChange = function (column) {
        this.state.sort.orderProperty = column.prop;
        this.state.sort.orderDirection = column.order == "ascending" ? "ASC" : "DESC";
        this.doSearch();
    };
    BaseListPage.prototype.doHandleFilter = function (value, row, column) {
        var property = column['property'];
        return row[property] === value;
    };
    BaseListPage.prototype.doHandleDelete = function (row) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmResult, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, element_plus_1.ElMessageBox.confirm(this.getDeleteMessage(), '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })["catch"](function (err) { return err; })];
                    case 1:
                        confirmResult = _a.sent();
                        if (confirmResult !== 'confirm') {
                            return [2 /*return*/];
                        }
                        params = this.createDeleteParams(row);
                        return [4 /*yield*/, ajax({ url: this.getDeleteUrl(), method: "delete", params: params })];
                    case 2:
                        result = _a.sent();
                        if (result.data === true) {
                            element_plus_1.ElMessage.success('删除成功！');
                            this.search();
                        }
                        else {
                            element_plus_1.ElMessage.error('删除失败！');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseListPage.prototype.doHandleEdit = function (row) {
        this.state.editDialogVisible = true;
        this.state.rid = row.id;
    };
    BaseListPage.prototype.doOpenAddDialog = function () {
        this.state.addDialogVisible = true;
    };
    BaseListPage.prototype.doResponse = function () {
        this.search();
    };
    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    BaseListPage.prototype._convertThis = function () {
        var _this = this;
        this.handleSizeChange = function (newSize) {
            _this.doHandleSizeChange(newSize);
        };
        this.handleCurrentChange = function (newCurrent) {
            _this.doHandleCurrentChange(newCurrent);
        };
        this.search = function () {
            _this.doSearch();
        };
        this.resetSearchFields = function () {
            _this.doResetSearchFields();
        };
        this.handleSortChange = function (column) {
            _this.doHandleSortChange(column);
        };
        this.handleFilter = function (value, row, column) {
            _this.doHandleFilter(value, row, column);
        };
        this.handleDelete = function (row) {
            _this.doHandleDelete(row);
        };
        this.handleEdit = function (row) {
            _this.doHandleEdit(row);
        };
        this.response = function () {
            _this.doResponse();
        };
        this.openAddDialog = function () {
            _this.doOpenAddDialog();
        };
    };
    return BaseListPage;
}());
exports.BaseListPage = BaseListPage;
