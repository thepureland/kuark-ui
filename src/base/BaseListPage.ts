import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseListPage {

    public state: any
    public dataTable: any

    protected constructor() {
        this.state = reactive(this.initBaseState())
        const additionalState = reactive(this.initState())
        Object.assign(this.state, additionalState)
        this.dataTable = ref()
        this._convertThis() // 为了解决恶心的this问题，无任何业务逻辑代码
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
            rid: '',
            selectedRows: []
        }
    }

    protected abstract getRootActionPath(): String

    protected abstract initState(): any

    protected abstract createSearchParams(): any

    protected getSearchUrl(): String {
        return this.getRootActionPath() + "/search"
    }

    protected getDeleteUrl(): String {
        return this.getRootActionPath() + "/delete"
    }

    protected getBatchDeleteUrl(): String {
        return this.getRootActionPath() + "/batchDelete"
    }

    protected getUpdateActiveUrl(): String {
        return this.getRootActionPath() + "/updateActive"
    }

    protected createDeleteParams(row: any): any {
        return {
            id: this.getRowId(row)
        }
    }

    protected createBatchDeleteParams(): any {
        const ids = []
        for (let row of this.state.selectedItems) {
            ids.push(this.getRowId(row))
        }
        return ids
    }

    protected getDeleteMessage(): string {
        return '确定要删除该数据？'
    }

    protected getBatchDeleteMessage(): string {
        const count = this.state.selectedItems.length
        return "确定要删除这" + count + "行数据吗？"
    }

    protected getRowId(row: any): String | Number {
        return row.id
    }

    public search: () => void

    protected async doSearch() {
        const params = this.createSearchParams()
        if (this.state.sort.orderProperty) {
            params["orders"] = [{
                property: this.state.sort.orderProperty,
                direction: this.state.sort.orderDirection,
            }]
        }
        // @ts-ignore
        const result = await ajax({url: this.getSearchUrl(), method: "post", params});
        if (result.data) {
            this.state.tableData = result.data.first
            this.state.pagination.total = result.data.second
        } else {
            ElMessage.error('查询失败！')
        }
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
        const confirmResult = await ElMessageBox.confirm(this.getDeleteMessage(), '提示', {
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
            this.search()
        } else {
            ElMessage.error('删除失败！')
        }
    }

    public multiDelete: () => void

    protected async doMultiDelete() {
        if (this.state.selectedItems.length == 0) {
            ElMessage.info('请先选择要删除的数据！')
        } else {
            const confirmResult = await ElMessageBox.confirm(this.getBatchDeleteMessage(), '提示', {
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
                this.search()
            } else {
                ElMessage.error('删除失败！')
            }
        }
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
        this.state.editDialogVisible = true;
        this.state.rid = this.getRowId(row)
    }

    public openAddDialog: () => void

    protected doOpenAddDialog() {
        this.state.addDialogVisible = true
    }

    public response: () => void

    protected doResponse() {
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
        this.response = () => {
            this.doResponse()
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