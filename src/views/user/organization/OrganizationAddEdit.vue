<template>
  <el-dialog title="添加组织信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="名称" prop="name" class="is-required">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="简称" prop="abbrName">
        <el-input v-model="formModel.abbrName"/>
      </el-form-item>
      <el-form-item label="上级" prop="parent" class="is-required">
        <el-cascader ref="parentCascader" v-model="formModel.parent" :props="cascaderProps" style="display: block;"/>
      </el-form-item>
      <el-form-item label="组织类型" prop="orgTypeDictCode" class="is-required">
        <el-select v-model="formModel.orgTypeDictCode" placeholder="请选择组织类型" clearable>
          <el-option v-for="item in getDictItems('kuark:user', 'organization_type')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="seqNo">
        <el-input-number v-model="formModel.seqNo"/>
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
import {OrgSupportAddEditPage} from "../../../base/page/OrgSupportAddEditPage.ts";

class AddEditPage extends OrgSupportAddEditPage {

  constructor(props, context, parentCascader) {
    super(props, context, parentCascader)
  }

  protected initState(): any {
    return {
      formModel: {
        name: null,
        abbrName: null,
        orgTypeDictCode: null,
        seqNo: 0,
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "user/organization"
  }

}

export default defineComponent({
  name: "~OrganizationAddEdit",
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
      ...toRefs(page.state),
      parentCascader
    }
  }
})
</script>

<style lang='css' scoped>

</style>