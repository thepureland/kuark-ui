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
var BaseListPage = /** @class */ (function () {
    function BaseListPage() {
        var _this = this;
        this.state = vue_1.reactive({
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
            DialogVisible: false,
            editDialogVisible: false,
            rid: '',
        });
        // 为了解决恶心的this问题
        this.handleSizeChange = function (newSize) {
            _this.doHandleSizeChange(newSize);
        };
        this.handleCurrentChange = function (newCurrent) {
            _this.doHandleCurrentChange(newCurrent);
        };
        this.loadData = function () {
            _this.doLoadData();
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
    }
    BaseListPage.prototype.doLoadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = this.getSearchParams();
                        if (this.state.sort.orderProperty) {
                            params["orders"] = [{
                                    property: this.state.sort.orderProperty,
                                    direction: this.state.sort.orderDirection,
                                }];
                        }
                        return [4 /*yield*/, ajax({ url: "sysDict/list", method: "post", params: params })];
                    case 1:
                        result = _a.sent();
                        this.state.tableData = result.data.first;
                        this.state.pagination.total = result.data.second;
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseListPage.prototype.doHandleSizeChange = function (newSize) {
        this.state.pagination.pageSize = newSize;
        this.loadData();
    };
    BaseListPage.prototype.doHandleCurrentChange = function (newCurrent) {
        if (newCurrent) {
            this.state.pagination.pageNo = newCurrent;
            this.loadData();
        }
    };
    BaseListPage.prototype.doResetSearchFields = function () {
    };
    BaseListPage.prototype.doHandleSortChange = function (column) {
        this.state.sort.orderProperty = column.prop;
        this.state.sort.orderDirection = column.order == "ascending" ? "ASC" : "DESC";
        this.doLoadData();
    };
    BaseListPage.prototype.doHandleFilter = function (value, row, column) {
        var property = column['property'];
        return row[property] === value;
    };
    BaseListPage.prototype.doHandleDelete = function (row) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('确定要删除该数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })["catch"](function (err) { return err; })];
                    case 1:
                        confirmResult = _a.sent();
                        if (confirmResult !== 'confirm')
                            return [2 /*return*/, element_plus_1.ElMessage.info('取消删除！')
                                //@ts-ignore
                            ];
                        return [4 /*yield*/, ajax({ url: "sysDict/delete", method: "delete", params: { id: row.id } })
                            // if (code === "ok") ElMessage.success('删除成功！');
                            // useSearch(state);
                        ];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseListPage.prototype.doHandleEdit = function (row) {
        this.state.editDialogVisible = true;
        this.state.rid = row.id;
    };
    BaseListPage.prototype.doResponse = function () {
        this.loadData();
    };
    return BaseListPage;
}());
exports.BaseListPage = BaseListPage;
