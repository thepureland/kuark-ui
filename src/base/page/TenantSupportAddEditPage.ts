import {ElMessage} from "element-plus"
// @ts-ignore
import {ValidationRuleAdapter} from "./ValidationRuleAdapter.ts"
// @ts-ignore
import {BaseAddEditPage} from "./BaseAddEditPage.ts"


/**
 * 多租户支持的添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class TenantSupportAddEditPage extends BaseAddEditPage {

    protected constructor(props, context) {
        super(props, context)
        this.initTenantVars()
        this.loadTenants()
    }

    private initTenantVars() {
        let formModel = this.state.formModel
        if (!formModel) {
            formModel = {}
            this.state.formModel = formModel
        }
        formModel.subSysOrTenant = null
        formModel.subSysDictCode = null
        this.state.tenantId = null
        this.state.subSysOrTenants = null
        const self = this
        this.state.cascaderProps = {
            multiple: false,
            checkStrictly: self.isCheckStrictly(),
            expandTrigger: "hover"
        }
    }

    protected isCheckStrictly() {
        return false
    }

    protected createSubmitParams(): any {
        const params = super.createSubmitParams()
        const subSysOrTenant = this.state.formModel.subSysOrTenant
        if (!subSysOrTenant || subSysOrTenant.length == 0) {
            ElMessage.error('请选择子系统/租户！')
            return
        } else {
            params.subSysDictCode = subSysOrTenant[0]
            if (subSysOrTenant.length > 1) {
                params.tenantId = subSysOrTenant[1]
            }
        }
        return params
    }

    protected fillForm(rowObject: any) {
        super.fillForm(rowObject)
        const subSysOrTenant = [rowObject.subSysDictCode]
        if (rowObject.tenantId) {
            subSysOrTenant.push(rowObject.tenantId)
        }
        this.state.formModel.subSysOrTenant = subSysOrTenant
    }

    protected async loadTenants() {
        // @ts-ignore
        const result = await ajax({url: "sys/tenant/getAllActiveTenants", method: "post"})
        if (result.data) {
            const options = []
            const subSyses = this.getDictItems("kuark:sys", "sub_sys")
            for (let subSys of subSyses) {
                const subSysOption = {value: subSys.first, label: subSys.second}
                options.push(subSysOption)
                const tenants = result.data[subSys.first]
                if (tenants) {
                    const tenantOptions = []
                    subSysOption["children"] = tenantOptions
                    for (let tenantId in tenants) {
                        const tenantOption = {value: tenantId, label: tenants[tenantId]}
                        tenantOptions.push(tenantOption)
                    }
                }
            }
            this.state.subSysOrTenants = options
        } else {
            ElMessage.error('加载租户信息失败！')
        }
    }

}