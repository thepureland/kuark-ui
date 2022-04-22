<template>
  <el-dialog title="添加域名信息" v-model="visible" width="25%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="100px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="域名" prop="domain" class="is-required">
        <el-col :span="10">
          <el-input v-model="formModel.domain"/>
        </el-col>
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
import {defineComponent, reactive, ref, toRefs} from "vue";
import {TenantSupportAddEditPage} from "../../../base/page/TenantSupportAddEditPage.ts";

class AddEditPage extends TenantSupportAddEditPage {

  constructor(props, context) {
    super(props, context)
  }

  protected initState(): any {
    return {
      formModel: {
        domain: null,
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "sys/domain"
  }

}

export default defineComponent({
  name: "~DomainAddEdit",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new AddEditPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state),
    }
  }
})
</script>

<style lang='css' scoped>

</style>