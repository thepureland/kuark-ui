import {ElMessage, ElMessageBox} from "element-plus"
import {BasePage} from "./BasePage.ts"

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseListPage extends BasePage {

    protected constructor() {
        super()
        this._convertThis()
    }

    protected initBaseState(): any {
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
            detailDialogVisible: false,
            rid: '',
            selectedRows: []
        }
    }

    protected createSearchParams(): any {
        const params = {}
        if (this.state.sort.orderProperty) {
            params["orders"] = [{
                property: this.state.sort.orderProperty,
                direction: this.state.sort.orderDirection,
            }]
        }
        if (this.state.pagination) {
            params["pageNo"] = this.state.pagination.pageNo
            params["pageSize"] = this.state.pagination.pageSize
        }
        const searchParams = this.state.searchParams
        if (searchParams) {
            for (const paramName in searchParams) {
                params[paramName] = searchParams[paramName]
            }
        }
        return params
    }

    protected getSearchUrl(): String {
        return this.getRootActionPath() + "/search"
    }

    protected getDeleteUrl(): String {
        return this.getRootActionPath() + "/delete"
    }

    protected getBatchDeleteUrl(): String {
        return this.getRootActionPath() + "/batchDelete"
    }

    protected getDetailUrl(): String {
        return this.getRootActionPath() + "/getDetail"
    }

    protected getUpdateActiveUrl(): String {
        return this.getRootActionPath() + "/updateActive"
    }

    protected getSelectedIds(): Array<any> {
        const ids = []
        for (let row of this.state.selectedItems) {
            ids.push(this.getRowId(row))
        }
        return ids
    }

    protected createDeleteParams(row: any): any {
        return {
            id: this.getRowId(row)
        }
    }

    protected createBatchDeleteParams(): any {
        return this.getSelectedIds()
    }

    protected getDeleteMessage(row: any): string {
        return '确定要删除该数据？'
    }

    protected getBatchDeleteMessage(rows: Array<any>): string {
        return "确定要删除这" + rows.length + "行数据吗？"
    }

    protected getRowId(row: any): String | Number {
        return row.id
    }

    public search: () => void

    protected async doSearch() {
        const params = this.createSearchParams()
        if (!params) {
            return
        }

        // @ts-ignore
        const result = await ajax({url: this.getSearchUrl(), method: "post", params})
        if (result.data) {
            this.postSearchSuccessfully(result.data)
        } else {
            ElMessage.error('查询失败！')
        }
    }

    protected postSearchSuccessfully(data) {
        this.state.tableData = data.first
        this.state.pagination.total = data.second
    }

    public handleSizeChange: (newSize: number) => void

    protected doHandleSizeChange(newSize: number) {
        this.state.pagination.pageSize = newSize
        this.search()
    }

    public handleCurrentChange: (newCurrent: number) => void

    protected doHandleCurrentChange(newCurrent: number) {
        if (newCurrent) {
            this.state.pagination.pageNo = newCurrent
            this.search()
        }
    }

    public handleSelectionChange: (selection) => void

    protected doHandleSelectionChange(selection) {
        this.state.selectedItems = selection
    }

    public resetSearchFields: () => void

    protected doResetSearchFields() {
        this.state.pagination.pageNo = 1
        const searchParams = this.state.searchParams
        if (searchParams) {
            for (const paramName in searchParams) {
                searchParams[paramName] = null
            }
        }
    }

    public handleSortChange: (column) => void

    protected doHandleSortChange(column) {
        this.state.sort.orderProperty = column.prop
        this.state.sort.orderDirection = column.order == "ascending" ? "ASC" : "DESC"
        this.doSearch()
    }

    public handleFilter: (value, row, column) => void

    protected doHandleFilter(value, row, column) {
        const property = column['property']
        return row[property] === value
    }

    public handleDelete: (row: any) => void

    protected async doHandleDelete(row: any) {
        const confirmResult = await ElMessageBox.confirm(this.getDeleteMessage(row), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
            return
        }
        const params = this.createDeleteParams(row)
        //@ts-ignore
        const result = await ajax({url: this.getDeleteUrl(), method: "delete", params: params})
        if (result.data === true) {
            ElMessage.success('删除成功！')
            this.doAfterDelete([params["id"]])
        } else {
            ElMessage.error('删除失败！')
        }
    }

    public multiDelete: () => void

    protected async doMultiDelete() {
        const rows = this.state.selectedItems
        if (!rows || rows.length == 0) {
            ElMessage.info('请先选择要删除的数据！')
        } else {
            const confirmResult = await ElMessageBox.confirm(this.getBatchDeleteMessage(rows), '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return
            }
            const params = this.createBatchDeleteParams()
            //@ts-ignore
            const result = await ajax({url: this.getBatchDeleteUrl(), method: "post", params: params})
            if (result.data === true) {
                ElMessage.success('删除成功！')
                this.doAfterDelete(this.getSelectedIds())
            } else {
                ElMessage.error('删除失败！')
            }
        }
    }

    public handleDetail: (row: any) => void

    protected doHandleDetail(row: any) {
        this.state.detailDialogVisible = true
        this.state.rid = this.getRowId(row)
    }

    public updateActive: (row: any) => void

    protected async doUpdateActive(row: any) {
        const params = {
            id: this.getRowId(row),
            active: row.active
        }
        // @ts-ignore
        const result = await ajax({url: this.getUpdateActiveUrl(), params})
        if (!result.data) {
            ElMessage.error('启用状态更新失败！')
        }
    }

    public handleEdit: (row: any) => void

    protected doHandleEdit(row: any) {
        this.state.editDialogVisible = true
        this.state.rid = this.getRowId(row)
    }

    public openAddDialog: () => void

    protected doOpenAddDialog() {
        this.state.addDialogVisible = true
    }

    public afterAdd: (params: any) => void

    protected doAfterAdd(params: any) {
        this.search()
    }

    public afterEdit: (params: any) => void

    protected doAfterEdit(params: any) {
        this.search()
    }

    public afterDelete: (ids: Array<any>) => void

    protected doAfterDelete(ids: Array<any>) {
        this.search()
    }

    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    private _convertThis() {
        this.handleSizeChange = (newSize: number) => {
            this.doHandleSizeChange(newSize)
        }
        this.handleCurrentChange = (newCurrent: number) => {
            this.doHandleCurrentChange(newCurrent)
        }
        this.search = () => {
            this.doSearch()
        }
        this.resetSearchFields = () => {
            this.doResetSearchFields()
        }
        this.handleSortChange = (column) => {
            this.doHandleSortChange(column)
        }
        this.handleFilter = (value, row, column) => {
            this.doHandleFilter(value, row, column)
        }
        this.handleDelete = (row: any) => {
            this.doHandleDelete(row)
        }
        this.handleEdit = (row: any) => {
            this.doHandleEdit(row)
        }
        this.handleDetail = (row: any) => {
            this.doHandleDetail(row)
        }
        this.afterAdd = (params: any) => {
            this.doAfterAdd(params)
        }
        this.afterEdit = (params: any) => {
            this.doAfterEdit(params)
        }
        this.afterDelete = (ids: Array<any>) => {
            this.doAfterDelete(ids)
        }
        this.openAddDialog = () => {
            this.doOpenAddDialog()
        }
        this.multiDelete = () => {
            this.doMultiDelete()
        }
        this.updateActive = (row: any) => {
            this.doUpdateActive(row)
        }
        this.handleSelectionChange = (selection) => {
            this.doHandleSelectionChange(selection)
        }
    }

}