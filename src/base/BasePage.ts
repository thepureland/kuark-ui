import {reactive} from "vue"
import * as moment from 'moment'
import {ElMessage} from "element-plus"

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BasePage {

    private dictCache: Map<String, Map<String, String>> = new Map()// Map<字典类型, Map<字典项编码，字典项名称>>

    public state: any

    protected constructor() {
        this.state = reactive(this.initBaseState())
        const additionalState = reactive(this.initState())
        Object.assign(this.state, additionalState)
        this.__convertThis()
    }

    protected abstract initState(): any

    protected abstract initBaseState(): any

    protected abstract getRootActionPath(): String

    public transDict: (module, type, code, row) => String

    protected doTransDict(module, type, code, row): String {
        let itemMap = this.dictCache[type]
        const name = itemMap[code]
        return name != null ? name : code
    }

    protected async loadDict(module, type) {
        const params = {
            module: module,
            type: type
        }
        // @ts-ignore
        const result = await ajax({url: "reg/dictItem/getDictItemMap", params})
        if (result.data) {
            this.dictCache[type] = result.data
        } else {
            ElMessage.error('字典项加载失败！')
        }
    }

    public formatBool = (value: Boolean) => {
        return value ? "是" : "否"
    }

    public formatDate = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
        if (date) {
            return moment(date.slice(0, 6)).format(formatStr)
        }
        return ''
    }

    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    private __convertThis() {
        this.transDict = (module, type, code, row) => {
            return this.doTransDict(module, type, code, row)
        }
    }

}