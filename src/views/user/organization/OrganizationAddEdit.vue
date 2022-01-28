<template>
  <el-dialog title="添加组织信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="简称" prop="abbrName">
        <el-input v-model="formModel.abbrName"/>
      </el-form-item>
      <el-form-item label="组织类型" prop="orgTypeDictCode">
        <el-select v-model="formModel.orgTypeDictCode" placeholder="请选择组织类型" clearable>
          <el-option v-for="item in getDictItems('kuark:user', 'organization_type')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="子系统" prop="subSysDictCode">
        <el-select v-model="formModel.subSysDictCode" placeholder="请选择子系统" clearable>
          <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所有者ID" prop="ownerId">
        <el-input v-model="formModel.ownerId"/>
      </el-form-item>
      <el-form-item label="排序" prop="seqNo">
        <el-input-number v-model="formModel.seqNo"/>
      </el-form-item>
      <el-form-item label="上级" prop="parent">
        <el-cascader v-model="formModel.parent" :props="cascaderProps"/>
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
        name: null,
        abbrName: null,
        orgTypeDictCode: null,
        subSysDictCode: null,
        ownerId: null,
        seqNo: 0,
        parent: [],
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "user/organization"
  }

  protected createSubmitParams(): any {
    return {
      id: this.props.rid,
      name: this.state.formModel.name,
      abbrName: this.state.formModel.abbrName,
      orgTypeDictCode: this.state.formModel.orgTypeDictCode,
      subSysDictCode: this.state.formModel.subSysDictCode,
      ownerId: this.state.formModel.ownerId,
      seqNo: this.state.formModel.seqNo,
      parent: this.state.formModel.parent,
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
  name: "~OrganizationAddEdit",
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