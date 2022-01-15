<template>
  <el-dialog title="添加参数信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="90px" :rules="rules">
      <el-form-item label="所属模块" prop="module">
        <el-select v-model="formModel.module" placeholder="Select">
          <el-option v-for="item in modules" :key="item.value" :label="item.value" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="参数名称" prop="paramName">
        <el-input v-model="formModel.paramName"/>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="formModel.paramValue"/>
      </el-form-item>
      <el-form-item label="参数默认值" prop="defaultValue">
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
import {defineComponent, reactive, toRefs} from "vue";
import {ElMessage} from 'element-plus';
import {BaseAddEditPage} from "../../../../base/BaseAddEditPage.ts";

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.loadModules()
    this.convertThis()
  }

  protected initState(): any {
    return {
      formModel: {
        module: null,
        paramName: null,
        paramValue: null,
        defaultValue: null,
        seqNo: undefined,
        remark: null
      },
      modules: []
    }
  }

  protected getRootActionPath(): String {
    return "reg/param"
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

  private async loadModules() {
    // @ts-ignore
    const result = await ajax({url: "reg/param/loadModules"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.modules.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('模块列表加载失败！')
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
  name: "~ParamAddEdit",
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