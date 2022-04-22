<!--
 * 域名详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="域名信息详情" v-model="visible" width="44%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="3">域名ID：</el-col>
      <el-col :span="9">{{detail.id}}</el-col>
      <el-col :span="3">域名：</el-col>
      <el-col :span="9">{{detail.domain}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">子系统：</el-col>
      <el-col :span="9">{{transDict("kuark:sys", "sub_sys", detail.subSysDictCode)}}</el-col>
      <el-col :span="3">备注：</el-col>
      <el-col :span="9">{{detail.remark}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">租户ID：</el-col>
      <el-col :span="9">{{detail.tenantId}}</el-col>
      <el-col :span="3">租户名称：</el-col>
      <el-col :span="9">{{detail.tenantName}}</el-col>
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
    await this.loadDict("kuark:sys", "sub_sys")
  }

  protected getRootActionPath(): String {
    return "sys/domain"
  }

}

export default defineComponent({
  name: "~DomainDetail",
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