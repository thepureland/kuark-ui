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
            const self = this
            this.preLoad().then(function () {
                self.loadDetail()
            })
        }
        this._convertThis()
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

    protected async loadDetail() {
        const params = this.createDetailLoadParams()
        // @ts-ignore
        const result = await ajax({url: this.getDetailLoadUrl(), params});
        if (result.data) {
            // @ts-ignore
            this.state.detail = result.data
            // @ts-ignore
            this.state.visible = true
        } else {
            ElMessage.error('数据加载失败！')
        }
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