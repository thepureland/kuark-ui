import {ElMessage} from "element-plus"
import {BaseListPage} from "./BaseListPage.ts"
import {Pair} from "../Pair.ts"

/**
 * 多租户支持的列表页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class TenantSupportListPage extends BaseListPage {

    protected constructor() {
        super()
        this.initTenantVars()
        this.loadDicts([
            new Pair("kuark:sys", "sub_sys")
        ]).then(() => this.loadTenants())
    }

    private initTenantVars() {
        let searchParams = this.state.searchParams
        if (!searchParams) {
            searchParams = {}
            this.state.searchParams = searchParams
        }
        searchParams.subSysOrTenant = null
        this.state.subSysDictCode = null
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
        return true
    }

    protected isRequireSubSysOrTenantForSearch() {
        return false
    }

    protected createSearchParams() {
        const params = super.createSearchParams()
        const subSysOrTenant = this.state.searchParams.subSysOrTenant
        if (this.isRequireSubSysOrTenantForSearch() && (subSysOrTenant == null || subSysOrTenant.length == 0)) {
            ElMessage.error('请先选择子系统/租户！')
            return null
        }
        if (subSysOrTenant) {
            if (subSysOrTenant.length > 0) {
                params.subSysDictCode = subSysOrTenant[0]
            }
            if (subSysOrTenant.length > 1) {
                params.tenantId = subSysOrTenant[1]
            }
        }
        return params
    }

    private async loadTenants() {
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