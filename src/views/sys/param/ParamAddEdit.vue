<template>
  <el-dialog title="添加参数信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="90px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="所属模块" prop="module" class="is-required">
        <el-select v-model="formModel.module" placeholder="Select">
          <el-option v-for="item in modules" :key="item.value" :label="item.value" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="参数名称" prop="paramName" class="is-required">
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
import {defineComponent, reactive, toRefs} from "vue"
import {BaseAddEditPage} from "../../../base/page/BaseAddEditPage.ts"
import {Pair} from "../../../base/Pair.ts"

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.loadModules()
  }

  protected initState(): any {
    return {
      formModel: {
        module: null,
        paramName: null,
        paramValue: null,
        defaultValue: null,
        seqNo: 0,
        remark: null
      },
      modules: []
    }
  }

  protected getRootActionPath(): String {
    return "sys/param"
  }

  private async loadModules() {
    this.loadDicts([
        new Pair("kuark:sys", "module")
    ]).then(()=> {
        const items = this.getDictItems("kuark:sys", "module")
        const moduleCodes = []
        for (let item of items) {
            moduleCodes.push({"value": item.first}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
            this.state.modules = moduleCodes
        }
    })
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