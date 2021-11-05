import {reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";


export abstract class BaseListPage {

    public state: any

    constructor() {
        this.state = reactive({
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
        })

        // 为了解决恶心的this问题
        this.handleSizeChange = (newSize: number) => {
            this.doHandleSizeChange(newSize)
        }
        this.handleCurrentChange = (newCurrent: number) => {
            this.doHandleCurrentChange(newCurrent)
        }
        this.loadData = () => {
            this.doLoadData()
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
    }

    protected abstract getSearchParams()

    public loadData: () => void

    protected async doLoadData() {
        const params = this.getSearchParams()
        if (this.state.sort.orderProperty) {
            params["orders"] = [{
                property: this.state.sort.orderProperty,
                direction: this.state.sort.orderDirection,
            }]
        }
        // @ts-ignore
        const result = await ajax({url: "sysDict/list", method: "post", params});
        this.state.tableData = result.data.first
        this.state.pagination.total = result.data.second
    }

    public handleSizeChange: (newSize: number) => void

    protected doHandleSizeChange(newSize: number) {
        this.state.pagination.pageSize = newSize
        this.loadData()
    }

    public handleCurrentChange: (newCurrent: number) => void

    protected doHandleCurrentChange(newCurrent: number) {
        if (newCurrent) {
            this.state.pagination.pageNo = newCurrent
            this.loadData()
        }
    }

    public resetSearchFields: () => void

    protected doResetSearchFields() {
    }

    public handleSortChange: (column) => void

    protected doHandleSortChange(column) {
        this.state.sort.orderProperty = column.prop
        this.state.sort.orderDirection = column.order == "ascending" ? "ASC" : "DESC"
        this.doLoadData()
    }

    public handleFilter: (value, row, column) => void

    protected doHandleFilter(value, row, column) {
        const property = column['property']
        return row[property] === value
    }

    public handleDelete: (row: any) => void

    protected async doHandleDelete(row: any) {
        const confirmResult = await ElMessageBox.confirm('确定要删除该数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return ElMessage.info('取消删除！')
        //@ts-ignore
        const result = await ajax({url: "sysDict/delete", method: "delete", params: {id: row.id}})
        // if (code === "ok") ElMessage.success('删除成功！');
        // useSearch(state);
    }

    public handleEdit: (row: any) => void

    protected doHandleEdit(row: any) {
        this.state.editDialogVisible = true;
        this.state.rid = row.id
    }

    public response: () => void

    protected doResponse() {
        this.loadData()
    }

}