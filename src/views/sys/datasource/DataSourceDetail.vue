<!--
 * 数据源详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="数据源信息详情" v-model="visible" width="37%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="4">数据源ID：</el-col>
      <el-col :span="8">{{detail.id}}</el-col>
      <el-col :span="4">名称：</el-col>
      <el-col :span="8">{{detail.name}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">URL：</el-col>
      <el-col :span="8">{{detail.url}}</el-col>
      <el-col :span="4">子系统：</el-col>
      <el-col :span="8">{{transDict("kuark:sys", "sub_sys", detail.subSysDictCode)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">用户名：</el-col>
      <el-col :span="8">{{detail.username}}</el-col>
      <el-col :span="4">密码：</el-col>
      <el-col :span="8">{{detail.password}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">租户ID：</el-col>
      <el-col :span="8">{{detail.tenantId}}</el-col>
      <el-col :span="4">租户名称：</el-col>
      <el-col :span="8">{{detail.tenantName}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">初始连接数：</el-col>
      <el-col :span="8">{{detail.initialSize}}</el-col>
      <el-col :span="4">最大连接数：</el-col>
      <el-col :span="8">{{detail.maxActive}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">最大空闲连接数：</el-col>
      <el-col :span="8">{{detail.maxIdle}}</el-col>
      <el-col :span="4">最小空闲连接数：</el-col>
      <el-col :span="8">{{detail.minIdle}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">出借最长期限(毫秒)：</el-col>
      <el-col :span="8">{{detail.maxWait}}</el-col>
      <el-col :span="4">连接寿命(毫秒)：</el-col>
      <el-col :span="8">{{detail.maxAge}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">创建时间：</el-col>
      <el-col :span="8">{{formatDate(detail.createTime)}}</el-col>
      <el-col :span="4">最近更新时间：</el-col>
      <el-col :span="8">{{formatDate(detail.updateTime)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">创建用户：</el-col>
      <el-col :span="8">{{detail.createUser}}</el-col>
      <el-col :span="4">最近更新用户：</el-col>
      <el-col :span="8">{{detail.updateUser}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">是否内置：</el-col>
      <el-col :span="8">{{detail.builtIn ? '是' : '否'}}</el-col>
      <el-col :span="4">是否启用：</el-col>
      <el-col :span="8">{{detail.active ? '是' : '否'}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">备注：</el-col>
      <el-col :span="20">{{detail.remark}}</el-col>
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
    return "sys/dataSource"
  }

}

export default defineComponent({
  name: "~DataSourceDetail",
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
.el-col-4 {
  text-align: right;
  font-weight: bold;
}
</style>