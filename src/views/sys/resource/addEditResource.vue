<template>
  <el-dialog title="添加资源信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="90px" :rules="rules">
      <el-form-item label="上级" prop="parent">
        <el-cascader ref="cascader" v-model="formModel.parent" :props="cascaderProps"/>
      </el-form-item>
      <el-form-item label="所属子系统" prop="subSysDictCode">
        <el-select v-model="formModel.subSysDictCode" placeholder="Select">
          <el-option v-for="item in subSysDictCodes" :key="item.value" :label="item.value" :value="item.value"/>
        </el-select>

      </el-form-item>
      <el-form-item label="资源类型" prop="resourceType">
        <el-select v-model="formModel.resourceTypeDictCode" placeholder="Select">
          <el-option v-for="item in resourceTypeDictCodes" :key="item.value" :label="item.value" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="资源默认值" prop="defaultValue">
        <el-input v-model="formModel.defaultValue"/>
      </el-form-item>
      <el-form-item label="序号" prop="seqNo">
        <el-input-number v-model="formModel.seqNo" :min="1" :max="999999999"/>
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
import {defineComponent, reactive, toRefs, ref} from "vue";
import {ElMessage} from 'element-plus';
import {BaseAddEditPage} from "../../../base/BaseAddEditPage.ts";

class Page extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.loadSubSysDictCodes()
    this.loadResourceTypeDictCodes()
    this.convertThis() // 为了解决恶心的this问题
  }

  protected initState(): any {
    return {
      formModel: {
        module: "",
        paramName: "",
        paramValue: "",
        defaultValue: "",
        seqNo: undefined,
        remark: ""
      },
      subSyses: [],
      resourceTypes: []
    }
  }

  protected getRootActionPath(): String {
    return "sysParam"
  }

  protected createSubmitParams(): any {
    return {
      id: this.props.rid,
      module: this.state.formModel.module,
      paramName: this.state.formModel.paramName,
      paramValue: this.state.formModel.paramValue,
      defaultValue: this.state.formModel.defaultValue,
      seqNo: this.state.formModel.seqNo,
      remark: this.state.formModel.remark
    }
  }

  private async loadSubSysDictCodes() {
    // @ts-ignore
    const result = await ajax({url: "sysResource/loadSubSyses"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.subSysDictCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private async loadResourceTypeDictCodes() {
    // @ts-ignore
    const result = await ajax({url: "sysResource/loadResourceTypes"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.resourceTypeDictCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  protected fillForm(rowObject: any) {
    this.state.formModel.module = rowObject.module
    this.state.formModel.paramName = rowObject.paramName
    this.state.formModel.paramValue = rowObject.paramValue
    this.state.formModel.defaultValue = rowObject.defaultValue
    this.state.formModel.seqNo = rowObject.seqNo
    this.state.formModel.remark = rowObject.remark
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {

  }

}

export default defineComponent({
  name: "~addEditParam",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new Page(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state),
    }
  }
})
</script>

<style lang='css' scoped>

</style>