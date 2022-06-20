<!--
 * 菜单权限列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                       :props="cascaderProps" placeholder="子系统/租户"/>
        </el-col>

        <el-col :span="16">
          <el-button type="primary" round @click="search">搜索</el-button>
          <el-button type="primary" round @click="resetSearchFields">重置</el-button>
        </el-col>
      </el-row>

      <el-table border stripe :data="tableData" height="650" @selection-change="handleSelectionChange"
                :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange" default-expand-all
                row-key="id">
        <el-table-column type="index" width="50"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="URL" prop="url"/>
        <el-table-column label="关联的角色" prop="roleNames"/>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <edit @click="handleEdit(scope.row)" class="operate-column-icon"/>
          </template>
        </el-table-column>
      </el-table>

      <menu-role-assign-dialog v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit"
                               :rid="rid" :subSysDictCode="subSysDictCode" :tenantId="tenantId"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts"
import MenuRoleAssignDialog from "./MenuRoleAssignDialog.vue"


class ListPage extends TenantSupportListPage {

  constructor(props, context) {
    super(props, context)
  }

  protected initState(): any {
  }

  protected getRootActionPath(): String {
    return "rbac/resourcepermission"
  }

  protected getSearchUrl(): String {
    return this.getRootActionPath() + "/searchTree"
  }

  protected isCheckStrictly(): boolean {
    return false
  }

}

export default defineComponent({
  name: "~index",
  components: {MenuRoleAssignDialog},
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
