<!--
 * 账号详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="账号信息详情" v-model="visible" width="45%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="3">账号ID：</el-col>
      <el-col :span="9">{{detail.id}}</el-col>
      <el-col :span="3">用户名：</el-col>
      <el-col :span="9">{{detail.username}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">用户状态：</el-col>
      <el-col :span="9">{{transDict("kuark:user", "user_status", detail.userStatusDictCode)}}</el-col>
      <el-col :span="3">用户状态原因：</el-col>
      <el-col :span="9">{{detail.userStatusReason}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">用户类型：</el-col>
      <el-col :span="9">{{transDict("kuark:user", "user_type", detail.userTypeDictCode)}}</el-col>
      <el-col :span="3">是否内置：</el-col>
      <el-col :span="9">{{detail.builtIn ? '是' : '否'}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">账号锁定时间起：</el-col>
      <el-col :span="9">{{formatDate(detail.lockTimeStart)}}</el-col>
      <el-col :span="3">账号锁定时间止：</el-col>
      <el-col :span="9">{{formatDate(detail.lockTimeEnd)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">最后一次登入时间：</el-col>
      <el-col :span="9">{{formatDate(detail.lastLoginTime)}}</el-col>
      <el-col :span="3">最后一次登出时间：</el-col>
      <el-col :span="9">{{formatDate(detail.lastLogoutTime)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">最后一次登入ip：</el-col>
      <el-col :span="9">{{detail.lastLoginIp}}</el-col>
      <el-col :span="3">最后一次登入终端：</el-col>
      <el-col :span="9">{{transDict("kuark:user", "user_terminal", detail.lastLoginTerminalDictCode)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">总在线时长(小时)：</el-col>
      <el-col :span="9">{{detail.totalOnlineTime}}</el-col>
      <el-col :span="3">动态验证码的密钥：</el-col>
      <el-col :span="9">{{detail.dynamicAuthKey}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">注册ip：</el-col>
      <el-col :span="9">{{detail.registerIp}}</el-col>
      <el-col :span="3">注册url：</el-col>
      <el-col :span="9">{{detail.registerUrl}}</el-col>
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
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseDetailPage} from "../../../base/page/BaseDetailPage.ts"
import {Pair} from "../../../base/Pair.ts"

class DetailPage extends BaseDetailPage {

  constructor(props, context) {
    super(props, context)
  }

  protected async preLoad() {
    await this.loadDicts([
      new Pair("kuark:sys", "sys"),
      new Pair("kuark:user", "user_status"),
      new Pair("kuark:user", "user_type"),
      new Pair("kuark:user", "user_terminal")
    ])
  }

  protected getRootActionPath(): String {
    return "user/account"
  }

}

export default defineComponent({
  name: "~AccountDetail",
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