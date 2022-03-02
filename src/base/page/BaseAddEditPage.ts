import {ElMessage} from "element-plus"
import {computed, ref} from "vue"
// @ts-ignore
import {ValidationRuleAdapter} from "../ValidationRuleAdapter.ts"
// @ts-ignore
import {BasePage} from "./BasePage.ts"


/**
 * 添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class BaseAddEditPage extends BasePage {

    public form: any

    public props: any
    public context: any
    public visible: any

    protected constructor(props, context) {
        super()
        this.props = props
        this.context = context
        this.form = ref()
        this.visible = computed({
            get: () => this.props.modelValue,
            set: () => {
            }
        })

        if (this.props.rid) {
            this.loadRowObject().then(() => this.initValidationRule())
        } else {
            this.initValidationRule()
        }
    }

    protected initBaseState(): any {
        return {
            rules: null,
        }
    }

    protected getValidationRuleUrl(): String {
        // @ts-ignore
        return this.getRootActionPath() + "/getValidationRule"
    }

    protected getSubmitUrl(): String {
        // @ts-ignore
        return this.getRootActionPath() + "/saveOrUpdate"
    }

    protected getRowObjectLoadUrl(): String {
        // @ts-ignore
        return this.getRootActionPath() + "/get"
    }

    protected createSubmitParams(): any {
        // remark: this.state.formModel.remark
        const params = {
            id: this.props.rid
        }
        // @ts-ignore
        const model = this.state.formModel
        if (model) {
            for (const propName in model) {
                params[propName] = model[propName]
            }
        }
        return params
    }

    protected fillForm(rowObject: any) {
        for (const propName in rowObject) {
            // @ts-ignore
            if (propName in this.state.formModel) {
                // @ts-ignore
                this.state.formModel[propName] = rowObject[propName]
            }
        }
    }

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
            // @ts-ignore
            this.state.rules = new ValidationRuleAdapter(result.data, () => {
                return this.form.value.model
            }).getRules()
        } else {
            ElMessage.error('表单校验规则加载失败！')
        }
    }

    public submit: () => void

    protected doSubmit() {
        this.form.value.validate(async valid => {
            if (!valid) return ElMessage.error('验证未通过')
            const params = this.createSubmitParams()
            if (params) {
                // @ts-ignore
                const result = await ajax({url: this.getSubmitUrl(), method: "post", params})
                if (result.data) {
                    ElMessage.success('保存成功！')
                    this.form.value.resetFields()
                    params.id = result.data
                    this.context.emit('response', params)
                    this.context.emit('update:modelValue', false)
                } else {
                    ElMessage.error('保存失败！')
                }
            }
        })
    }

    public close: () => void

    protected doClose() {
        this.form.value.resetFields()
        this.context.emit('update:modelValue', false);
    }

    protected convertThis() {
        super.convertThis()
        this.submit = () => {
            this.doSubmit()
        }
        this.close = () => {
            this.doClose()
        }
    }

}