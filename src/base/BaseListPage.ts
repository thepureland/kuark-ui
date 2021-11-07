import {reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseListPage {

    public state: any

    protected constructor() {
        this.state = reactive(this.initBaseState())
        const additionalState = reactive(this.initState())
        Object.assign(this.state, additionalState)
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
        }
    }

    protected abstract initState(): any

    protected abstract createSearchParams(): any

    protected abstract getSearchUrl(): String

    protected abstract getDeleteUrl(): String

    protected createDeleteParams(row: any): any {
        return {
            id: row.id
        }
    }

    protected getDeleteMessage(): string {
        return '确定要删除该数据？'
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

    public resetSearchFields: () => void

    protected doResetSearchFields() {
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

    public handleEdit: (row: any) => void

    protected doHandleEdit(row: any) {
        this.state.editDialogVisible = true;
        this.state.rid = row.id
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
    }

}