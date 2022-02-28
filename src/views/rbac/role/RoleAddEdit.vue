<template>
  <el-dialog title="添加角色信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="100px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="角色编码" prop="roleCode" class="is-required">
        <el-input v-model="formModel.roleCode"/>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName" class="is-required">
        <el-input v-model="formModel.roleName"/>
      </el-form-item>
      <el-form-item label="子系统/租户" prop="subSysDictCode" class="is-required">
        <el-cascader :options="subSysOrTenants" v-model="formModel.subSysOrTenant"
                     :props="cascaderProps" placeholder="请选择子系统/租户"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.remark"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import {BaseAddEditPage} from "../../../base/BaseAddEditPage.ts";
import {ElMessage} from "element-plus";

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.loadTenants()
  }

  protected initState(): any {
    return {
      formModel: {
        roleCode: null,
        roleName: null,
        subSysDictCode: null,
        subSysOrTenant: [],
        remark: null
      },
      cascaderProps: {
        multiple: false,
        checkStrictly: true,
        expandTrigger: "hover"
      },
      subSysOrTenants: [],
    }
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected createSubmitParams(): any {
    const params = super.createSubmitParams()
    const subSysOrTenant = this.state.formModel.subSysOrTenant
    if (!subSysOrTenant) {
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

export default defineComponent({
  name: "~RoleAddEdit",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new AddEditPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>