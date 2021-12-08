import {reactive} from "vue"
import * as moment from 'moment'
import {ElMessage, ElMessageBox} from "element-plus"

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseListPage {

    public state: any

    private dictCache: Map<String, Map<String, String>> = new Map()// Map<字典类型, Map<字典项编码，字典项名称>>

    protected constructor() {
        this.state = reactive(this.initBaseState())
        const additionalState = reactive(this.initState())
        Object.assign(this.state, additionalState)
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
            rid: '',
            selectedRows: []
        }
    }

    protected abstract getRootActionPath(): String

    protected abstract initState(): any

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

        // @ts-ignore
        const result = await ajax({url: this.getSearchUrl(), method: "post", params})
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
        if (rows.length == 0) {
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

    public formatBool = (value: Boolean) => {
        return value ? "是" : "否"
    }

    public formatDate = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
        return moment(date).format(formatStr)
    }

    public transDict: (module, type, code, row) => void

    public transDict1 = (row, column, cellValue, index) => {
        console.info("####################: " + cellValue)
    }

    protected async doTransDict(module, type, code, row): Promise<String> {
        let itemMap = this.dictCache[type]
        if (itemMap == null) {
            const params = {
                module: module,
                type: type
            }
            // @ts-ignore
            const result = await ajax({url: "regDictItem/getDictItemMap", params})
            if (result.data) {
                itemMap = result.data
                this.dictCache[type] = itemMap
            } else {
                ElMessage.error('字典项加载失败！')
            }
        }
        const name = itemMap[code]
        return name != null ? name : code
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
        this.transDict = (module, type, code, row) => {
            if (row) {
                this.doTransDict(module, type, code, row).then((value) => {
                        this.transDictOnRow(row, type, value)
                    }
                )
            }
        }
    }

    protected transDictOnRow(row: any, type: String, value: String) {
    }

}