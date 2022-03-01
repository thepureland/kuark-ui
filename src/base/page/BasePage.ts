import {reactive} from "vue"
import * as moment from 'moment'
import {ElMessage} from "element-plus"
// @ts-ignore
import {Pair} from "../Pair.ts";

/**
 * 列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BasePage {

    public dictCache: Map<String, Map<String, String>>  // Map<模块---字典类型, Map<字典项编码，字典项名称>>

    public state: any

    protected constructor() {
        if (!window["dictCache"]) {
            window["dictCache"] = new Map()
        }
        this.dictCache = window["dictCache"]

        this.state = reactive(this.initBaseState())
        const initState = this.initState()
        if (initState) {
            const additionalState = reactive(initState)
            Object.assign(this.state, additionalState)
        }
        this.__convertThis()
    }

    protected abstract initState(): any

    protected abstract initBaseState(): any

    protected abstract getRootActionPath(): String

    public transDict: (module, type, code) => String

    protected doTransDict(module, dictType, code): String {
        if (code) {
            const key = (module ? module : "") + '---' + dictType
            let itemMap = this.dictCache[key]
            if (itemMap) {
                const name = itemMap[code]
                return name != null ? name : code
            } else {
                return code
            }
        }
        return ''
    }

    protected async loadDict(module, dictType) {
        const key = (module ? module : "") + '---' + dictType
        if (this.dictCache[key]) {
            return
        }

        const params = {
            module: module,
            dictType: dictType
        }
        // @ts-ignore
        const result = await ajax({url: "sys/dictItem/getDictItemMap", params})
        if (result.data) {
            this.dictCache[key] = result.data
        } else {
            ElMessage.error('字典项加载失败！')
        }
    }

    protected async loadDicts(moduleAndTypes: Array<Pair>) {
        const params = []
        for (let obj of moduleAndTypes) {
            let module = obj.first ? obj.first : ""
            const dictType = obj.second
            let key = module + '---' + dictType
            if (!this.dictCache[key]) {
                params.push({
                    module: module,
                    dictType: dictType
                })
            }
        }
        if (params.length == 0) return

        // @ts-ignore
        const result = await ajax({url: "sys/dictItem/batchGetDictItemMap", method: "post", params})
        if (result.data) {
            for (let key in result.data) {
                const parts = key.substr(1, key.length - 2).split(", ")
                this.dictCache[parts[0] + "---" + parts[1]] = result.data[key]
            }
        } else {
            ElMessage.error('批量加载字典项失败！')
        }
    }

    public getDictItems = (module, dictType): Array<Pair> => {
        const key = (module ? module : "") + '---' + dictType
        const map = this.dictCache[key]
        const pairs = []
        if (map) {
            for (let k in map) {
                pairs.push(new Pair(k, map[k]))
            }
        }
        return pairs
    }

    public formatBool = (value: Boolean) => {
        return value ? "是" : "否"
    }

    public formatDate = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
        if (date) {
            if (date instanceof Array) {
                date = date.slice(0, 6)
            }
            return moment(date).format(formatStr)
        }
        return ''
    }

    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    private __convertThis() {
        this.transDict = (module, type, code) => {
            return this.doTransDict(module, type, code)
        }
    }

}