<template>
  <el-dialog title="添加角色信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="formModel.roleCode"/>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formModel.roleName"/>
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

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.convertThis()
  }

  protected initState(): any {
    return {
      formModel: {
        roleCode: null,
        roleName: null,
        remark:null
      },
    }
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected createSubmitParams(): any {
    return {
      id: this.props.rid,
      roleCode: this.state.formModel.roleCode,
      roleName: this.state.formModel.roleName,
      remark: this.state.formModel.remark
    }
  }

  protected fillForm(rowObject: any) {
    this.state.formModel.roleCode = rowObject.roleCode
    this.state.formModel.roleName = rowObject.roleName
    this.state.formModel.remark = rowObject.remark
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
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