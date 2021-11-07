import {ElMessage} from "element-plus";
import {computed, reactive, ref, Ref} from "vue";
// @ts-ignore
import {ValidationRuleAdapter} from "./ValidationRuleAdapter.ts";

/**
 * 添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseAddEditPage {

    public state: any
    public form: any

    public props: any
    public context: any
    public visible: any

    protected constructor(props, context) {
        this.props = props
        this.context = context
        this.form = ref()
        this.visible = computed({
            get: () => this.props.modelValue,
            set: () => {
            }
        })

        this.state = reactive(this.initBaseState())
        const additionalState = reactive(this.initState())
        Object.assign(this.state, additionalState)

        if (this.props.rid) {
            this.loadRowObject().then(() => this.initValidationRule())
        } else {
            this.initValidationRule()
        }

        this._convertThis() // 为了解决恶心的this问题，无任何业务逻辑代码
    }

    protected initBaseState(): any {
        return {
            rules: null,
        }
    }

    protected abstract initState(): any

    protected abstract getValidationRuleUrl(): String

    protected abstract getSubmitUrl(): String

    protected abstract getRowObjectLoadUrl(): String

    protected abstract createSubmitParams(): any

    protected abstract fillForm(rowObject: any)

    protected createRowObjectLoadParams(): any {
        return {
            id: this.props.rid
        }
    }

    protected async loadRowObject() {
        const params = this.createRowObjectLoadParams()
        // @ts-ignore
        const result = await ajax({url: this.getRowObjectLoadUrl(), params});
        if (result.data) {
            this.fillForm(result.data)
        } else {
            ElMessage.error('数据加载失败！')
        }
    }

    protected async initValidationRule(): Promise<any> {
        // @ts-ignore
        const result = await ajax({url: this.getValidationRuleUrl()});
        if (result.data) {
            this.state.rules = new ValidationRuleAdapter(result.data, () => {
                return this.form.value.model
            }).getRules()
        } else {
            ElMessage.error('数据加载失败！')
        }
    }

    public submit: () => void

    protected doSubmit() {
        this.form.value.validate(async valid => {
            if (!valid) return ElMessage.error('验证未通过')
            const params = this.createSubmitParams();
            // @ts-ignore
            const result = await ajax({url: this.getSubmitUrl(), method: "post", params})
            if (result.data) {
                ElMessage.success('保存成功！')
                this.form.value.resetFields()
                this.context.emit('response')
                this.context.emit('update:modelValue', false);
            } else {
                ElMessage.error('保存失败！')
            }
        });
    }

    public close: () => void

    protected doClose() {
        this.form.value.resetFields()
        this.context.emit('update:modelValue', false);
    }

    /**
     * 为了解决恶心的this问题，无任何业务逻辑代码
     */
    private _convertThis() {
        this.submit = () => {
            this.doSubmit()
        }
        this.close = () => {
            this.doClose()
        }
    }

}