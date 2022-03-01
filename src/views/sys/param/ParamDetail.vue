<!--
 * 参数详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="参数信息详情" v-model="visible" width="44%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="3">参数ID：</el-col>
      <el-col :span="9">{{detail.id}}</el-col>
      <el-col :span="3">参数名：</el-col>
      <el-col :span="9">{{detail.paramName}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">参数值：</el-col>
      <el-col :span="9">{{detail.paramValue}}</el-col>
      <el-col :span="3">默认参数值：</el-col>
      <el-col :span="9">{{detail.defaultValue}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">排序：</el-col>
      <el-col :span="9">{{detail.seqNo}}</el-col>
      <el-col :span="3">模块：</el-col>
      <el-col :span="9">{{transDict("kuark:sys", "module", detail.module)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">创建时间：</el-col>
      <el-col :span="9">{{formatDate(detail.createTime)}}</el-col>
      <el-col :span="3">最近更新时间：</el-col>
      <el-col :span="9">{{formatDate(detail.updateTime)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">创建用户：</el-col>
      <el-col :span="9">{{detail.createUser}}</el-col>
      <el-col :span="3">最近更新用户：</el-col>
      <el-col :span="9">{{detail.updateUser}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">是否内置：</el-col>
      <el-col :span="9">{{detail.builtIn ? '是' : '否'}}</el-col>
      <el-col :span="3">是否启用：</el-col>
      <el-col :span="9">{{detail.active ? '是' : '否'}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">备注：</el-col>
      <el-col :span="21">{{detail.remark}}</el-col>
    </el-row>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseDetailPage} from "../../../base/page/BaseDetailPage.ts"

class DetailPage extends BaseDetailPage {

  constructor(props, context) {
    super(props, context)
  }

  protected async preLoad(): Promise<void> {
    await this.loadDict("kuark:sys", "module")
  }

  protected getRootActionPath(): String {
    return "sys/param"
  }

}

export default defineComponent({
  name: "~ParamDetail",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const page = reactive(new DetailPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col-3 {
  text-align: right;
  font-weight: bold;
}
</style>