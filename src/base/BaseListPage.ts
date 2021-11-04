import {reactive} from "vue";


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
            }
        })
        this.handleSizeChange = (newSize: number) => { // 为了解决恶心的this问题
            this.state.pagination.pageSize = newSize
            this.loadData()
        }
        this.handleCurrentChange = (newCurrent: number) => { // 为了解决恶心的this问题
            if (newCurrent) {
                this.state.pagination.pageNo = newCurrent
                this.loadData()
            }
        }
    }

    protected abstract getSearchParams()

    public async loadData() {
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

    public handleCurrentChange: (newCurrent: number) => void

}