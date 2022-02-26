<template>
  <el-dialog title="添加账号信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="用户名" prop="username" class="is-required">
        <el-input v-model="formModel.username"/>
      </el-form-item>
      <el-form-item label="子系统" prop="subSysDictCode" class="is-required">
        <el-select v-model="formModel.subSysDictCode" placeholder="请选择子系统" clearable>
          <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="userTypeDictCode" class="is-required">
        <el-select v-model="formModel.userTypeDictCode" placeholder="请选择用户类型" clearable>
          <el-option v-for="item in getDictItems('kuark:user', 'user_type')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
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
    this.loadDict("kuark:sys", "sub_sys")
  }

  protected initState(): any {
    return {
      formModel: {
        roleCode: null,
        roleName: null,
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "user/account"
  }

}

export default defineComponent({
  name: "~AccountAddEdit",
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