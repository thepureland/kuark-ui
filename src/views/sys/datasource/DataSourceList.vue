<!--
 * 数据源列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>数据源列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.name" placeholder="名称" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                       :props="cascaderProps" placeholder="子系统/租户"/>
        </el-col>

        <el-col :span="1">
          <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
        </el-col>

        <el-col :span="16">
          <el-button type="primary" round @click="search">搜索</el-button>
          <el-button type="primary" round @click="resetSearchFields">重置</el-button>
          <el-button type="success" @click="openAddDialog">添加</el-button>
          <el-button type="danger" @click="multiDelete">删除</el-button>
        </el-col>
      </el-row>

      <el-table border stripe :data="tableData" height="650" @selection-change="handleSelectionChange"
                :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange" default-expand-all
                row-key="id">
        <el-table-column type="selection" width="39"/>
        <el-table-column type="index" width="50"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="子系统" prop="subSysDictCode">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="租户" prop="tenantName"/>
        <el-table-column label="URL" prop="url"/>
        <el-table-column label="用户名" prop="username"/>
        <el-table-column label="启用">
          <template #default="scope">
            <el-switch v-model="scope.row.active" :active-value=true :inactive-value=false
                       @change="updateActive(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <edit @click="handleEdit(scope.row)" class="operate-column-icon"/>
            <delete @click="handleDelete(scope.row)" class="operate-column-icon"/>
            <tickets @click="handleDetail(scope.row)" class="operate-column-icon"/>
            <lock @click="resetPassword(scope.row)" class="operate-column-icon"/>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="passwordDialogVisible" title="请输入新密码" width="20%">
        <el-input v-model="newPassword"/>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="passwordDialogVisible = false; newPassword = null">取消</el-button>
            <el-button type="primary" @click="commitNewPassword(newPassword)">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <data-source-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <data-source-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <data-source-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import DataSourceAddEdit from './DataSourceAddEdit.vue'
import DataSourceDetail from './DataSourceDetail.vue'
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts";
import {Pair} from "../../../base/Pair.ts";
import {ElMessage} from "element-plus";

class ListPage extends TenantSupportListPage {

  constructor(props, context) {
    super(props, context)
    this.loadDicts([
      new Pair("kuark:sys", "sub_sys")
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        name: null,
        active: true,
      },
      passwordDialogVisible: false,
      newPassword: null,
      currentRow: null
    }
  }

  protected getRootActionPath(): String {
    return "sys/dataSource"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    if (params) {
      params.active = this.state.searchParams.active
    }
    return params
  }

  public resetPassword: (row: any) => void

  private doResetPassword(row: any) {
    this.state.passwordDialogVisible = true
    this.state.currentRow = row
  }

  public commitNewPassword: (newPassword: String) => void

  private async doCommitNewPassword(newPassword: String) {
    this.state.passwordDialogVisible = false
    const row = this.state.currentRow
    const params = {
      id: row.id,
      password: newPassword
    }
    const url = "sys/dataSource/resetPassword"

    // @ts-ignore
    const result = await ajax({url: url, params})
    if (result.code = 200) {
      ElMessage.info('重置密码成功！')
    } else {
      ElMessage.error('重置密码失败！')
    }
  }

  protected convertThis() {
    super.convertThis()
    this.resetPassword = (row: any) => {
      this.doResetPassword(row)
    }
    this.commitNewPassword = (newPassword: String) => {
      this.doCommitNewPassword(newPassword)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {DataSourceAddEdit, DataSourceDetail},
  setup(props, context) {
    const listPage = reactive(new ListPage(props, context))
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage),
    }
  }
})
</script>

<style lang='css' scoped>

</style>

