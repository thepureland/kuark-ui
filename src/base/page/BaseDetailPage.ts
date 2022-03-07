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

    protected constructor(props, context) {
        super(props, context)
        if (props.rid) {
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
        } else {
            console.error("rid不能为空！")
        }
    }

    protected initBaseState(): any {
        return {
            detail: null,
            rid: '',
        }
    }

    protected initState(): any {
    }

    protected async preLoad() {
    }

    protected showAfterLoadData(): Boolean {
        return true
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
        if (this.showAfterLoadData()) {
            this.render()
        }
    }

    protected async loadOthers() {
    }

    protected convertThis() {
        super.convertThis()
    }

}