<!--
 * 字典详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="字典信息详情" v-model="visible" width="40%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="3">字典ID：</el-col>
      <el-col :span="9">{{detail.id}}</el-col>
      <el-col :span="3">字典类型：</el-col>
      <el-col :span="9">{{detail.dictType}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">字典名：</el-col>
      <el-col :span="9">{{detail.dictName}}</el-col>
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
      <el-col :span="3">备注：</el-col>
      <el-col :span="9">{{detail.remark}}</el-col>
    </el-row>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseDetailPage} from "../../../../base/BaseDetailPage.ts"

class DetailPage extends BaseDetailPage {

  constructor(props, context) {
    super(props, context)
  }

  protected async preLoad(): Promise<void> {
    await this.loadDict("kuark:sys", "module")
  }

  protected getRootActionPath(): String {
    return "reg/dict"
  }

}

export default defineComponent({
  name: "~DictDetail",
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