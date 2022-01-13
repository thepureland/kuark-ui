<template>
  <el-dialog title="添加组信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="组编码" prop="groupCode">
        <el-input v-model="formModel.groupCode"/>
      </el-form-item>
      <el-form-item label="组名称" prop="groupName">
        <el-input v-model="formModel.groupName"/>
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

class Page extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.convertThis()
  }

  protected initState(): any {
    return {
      formModel: {
        groupCode: null,
        groupName: null,
        remark:null
      },
    }
  }

  protected getRootActionPath(): String {
    return "rbac/group"
  }

  protected createSubmitParams(): any {
    return {
      id: this.props.rid,
      groupCode: this.state.formModel.groupCode,
      groupName: this.state.formModel.groupName,
      remark: this.state.formModel.remark
    }
  }

  protected fillForm(rowObject: any) {
    this.state.formModel.groupCode = rowObject.groupCode
    this.state.formModel.groupName = rowObject.groupName
    this.state.formModel.remark = rowObject.remark
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
  }

}

export default defineComponent({
  name: "~AddEditUserGroup",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new Page(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>