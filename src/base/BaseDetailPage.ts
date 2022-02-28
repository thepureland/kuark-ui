// @ts-ignore
import {BasePage} from "./BasePage.ts"
import {ElMessage} from "element-plus"

/**
 * 详情页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseDetailPage extends BasePage {

    public visible: any
    public props: any
    public context: any

    protected constructor(props, context) {
        super()
        this.props = props
        this.context = context
        if (this.props.rid) {
            const promise = this.preLoad()
            if (promise) {
                const self = this
                promise.then(function () {
                    self.loadData()
                    self.loadOthers()
                })
            } else {
                this.loadData()
            }
            this._convertThis()
        } else {
            console.error("rid不能为空！")
        }
    }

    protected initBaseState(): any {
        return {
            detail: null,
            visible: false,
            rid: '',
        }
    }

    protected initState(): any {
    }

    protected async preLoad() {
    }

    protected getDetailLoadUrl(): String {
        // @ts-ignore
        return this.getRootActionPath() + "/getDetail"
    }

    protected createDetailLoadParams(): any {
        return {
            // @ts-ignore
            id: this.props.rid
        }
    }

    protected async loadData() {
        const params = this.createDetailLoadParams()
        // @ts-ignore
        const result = await ajax({url: this.getDetailLoadUrl(), params});
        if (result.data) {
            this.postLoadDataSuccessfully(result.data)
        } else {
            ElMessage.error('数据加载失败！')
        }
    }

    protected postLoadDataSuccessfully(data) {
        // @ts-ignore
        this.state.detail = data
        // @ts-ignore
        this.state.visible = true
    }

    protected async loadOthers() {
    }

    public close: () => void

    protected doClose() {
        // @ts-ignore
        this.state.visible = true
        this.context.emit('update:modelValue', false)
    }

    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    private _convertThis() {
        this.close = () => {
            this.doClose()
        }
    }

}