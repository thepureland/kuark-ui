import {ElMessage} from "element-plus"
// @ts-ignore
import {TenantSupportAddEditPage} from "./TenantSupportAddEditPage.ts"


/**
 * 组织机构支持的添加/编辑页面处理抽象父类
 *
 * @author K
 * @since 1.0.0
 */
export abstract class OrgSupportAddEditPage extends TenantSupportAddEditPage {

    private parentCascader: any

    protected constructor(props, context, parentCascader) {
        super(props, context)
        this.parentCascader = parentCascader
        this.convertThis()
    }

    protected initVars() {
        super.initVars()
        const _self = this
        this.state.cascaderProps = {
            lazy: true,
                value: "id",
                label: "name",
                multiple: false,
                checkStrictly: true,
                expandTrigger: "hover",
                lazyLoad(node, resolve) {
                _self.loadTreeNodes(node, resolve)
            },
        }
        this.state.formModel.parent = []
    }

    protected createSubmitParams(): any {
        const params = super.createSubmitParams()
        const nodes = this.parentCascader.value.getCheckedNodes()
        params.tenantId = this.getTenantId(nodes[0])
        params.parentId = this.getParentId(nodes[0])
        params.subSysDictCode = this.state.formModel.parent[0]
        return params
    }

    protected fillForm(rowObject: any) {
        super.fillForm(rowObject)
        const parents = [rowObject.subSysDictCode]
        if (rowObject.tenantId) {
            parents.push(rowObject.tenantId)
        }
        if (rowObject.parentId) {
            parents.push(rowObject.parentId)
        }
        this.state.formModel.parent = parents
    }

    public loadTreeNodes: (node, resolve) => void

    protected async doLoadTreeNodes(node, resolve) {
        if (node.level === 0) {
            const dictItems = this.getDictItems("kuark:sys", "sub_sys")
            const subSyses = []
            for (let item of dictItems) {
                subSyses.push({id: item.first, name: item.second})
            }
            resolve(subSyses)
        } else {
            const params = {
                subSysDictCode: this.getSubSysDictCode(node),
                tenantId: this.getTenantId(node),
                parentId: this.getParentId(node),
                active: true
            }
            // @ts-ignore
            const result = await ajax({url: this.getRootActionPath() + "/lazyLoadTree", method: "post", params})
            if (result.data) {
                resolve(result.data)
            } else {
                ElMessage.error('组织机构树加载失败！')
            }
        }
    }

    protected getSubSysDictCode(node): String {
        while (node.parent) {
            node = node.parent
        }
        return node.data.id
    }

    protected getTenantId(node): String {
        while (node.parent) {
            if (node.data.organization === false) {
                return node.data.id
            }
            node = node.parent
        }
        return null
    }

    protected getParentId(node): String {
        if (node.data.organization === false || node.parent == undefined) {
            return null
        }
        return node.data.id
    }

    protected convertThis() {
        super.convertThis()
        this.loadTreeNodes = (node, resolve) => {
            this.doLoadTreeNodes(node, resolve)
        }
    }

}