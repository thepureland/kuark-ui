import {ElMessage} from "element-plus";
import {computed, reactive, ref, Ref} from "vue";
// @ts-ignore
import {ValidationRuleAdapter} from "./ValidationRuleAdapter.ts";
import {ComputedRef} from "@vue/reactivity";

export abstract class BaseAddEditPage {

    public state: any
    public form: any = null

    public props: any
    public context: any
    public visible: any

    constructor(props, context) {
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

    protected abstract getSubmitParams(): any

    protected abstract fillForm(rowObject: any)

    protected getRowObjectLoadParams(): any {
        return {
            id: this.props.rid
        }
    }

    protected async loadRowObject() {
        const params = this.getRowObjectLoadParams()
        // @ts-ignore
        const result = await ajax({url: this.getRowObjectLoadUrl(), params});
        this.fillForm(result.data)
    }

    protected async initValidationRule(): Promise<any> {
        // @ts-ignore
        const result = await ajax({url: this.getValidationRuleUrl()});
        this.state.rules = new ValidationRuleAdapter(result.data, () => {
            return this.form.value.model
        }).getRules()
    }

    public submit: () => void

    protected doSubmit() {
        this.form.value.validate(async valid => {
            if (!valid) return ElMessage.error('验证未通过')
            const params = this.getSubmitParams();
            // @ts-ignore
            const result = await ajax({url: this.getSubmitUrl(), method: "post", params})
            this.form.value.resetFields()

            this.context.emit('response')
            this.context.emit('update:modelValue', false);
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