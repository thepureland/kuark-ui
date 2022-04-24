<template>
  <el-dialog title="添加账号信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="100px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="用户名" prop="username" class="is-required">
        <el-col :span="8">
          <el-input v-model="formModel.username"/>
        </el-col>
      </el-form-item>
      <el-form-item label="隶属" prop="parent" class="is-required">
        <el-cascader ref="parentCascader" v-model="formModel.parent" :props="cascaderProps" style="display: block;"/>
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
import {defineComponent, reactive, ref, toRefs} from "vue"
import {OrgSupportAddEditPage} from "../../../base/page/OrgSupportAddEditPage.ts"

class AddEditPage extends OrgSupportAddEditPage {

  constructor(props, context, parentCascader) {
    super(props, context, parentCascader)
  }

  protected initState(): any {
    return {
      formModel: {
        username: null,
        userTypeDictCode: null,
        remark: null,
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
    const parentCascader = ref()
    const page = reactive(new AddEditPage(props, context, parentCascader))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>