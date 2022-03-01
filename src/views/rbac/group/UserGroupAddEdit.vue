<template>
  <el-dialog title="添加组信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="组编码" prop="groupCode" class="is-required">
        <el-input v-model="formModel.groupCode"/>
      </el-form-item>
      <el-form-item label="组名称" prop="groupName" class="is-required">
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
import {BaseAddEditPage} from "../../../base/page/BaseAddEditPage.ts";

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
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

}

export default defineComponent({
  name: "~UserGroupAddEdit",
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