<!--
 * 角色管理
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                       :props="cascaderProps" placeholder="子系统/租户" />
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.roleCode" placeholder="角色编码" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.roleName" placeholder="角色名称" @change="search" clearable/>
        </el-col>

        <el-col :span="2">
          <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
        </el-col>

        <el-col :span="12">
          <el-button type="primary" round @click="search">搜索</el-button>
          <el-button type="primary" round @click="resetSearchFields">重置</el-button>
          <el-button type="success" @click="openAddDialog">添加</el-button>
          <el-button type="danger" @click="multiDelete">删除</el-button>
        </el-col>
      </el-row>

      <el-table border stripe :data="tableData" height="650" @selection-change="handleSelectionChange"
                :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange">
        <el-table-column type="selection" width="39"/>
        <el-table-column type="index" width="50"/>
        <el-table-column label="角色编码" prop="roleCode"/>
        <el-table-column label="角色名称" prop="roleName"/>
        <el-table-column label="子系统" prop="subSysDictCode">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"/>
        <el-table-column label="启用">
          <template #default="scope">
            <el-switch v-model="scope.row.active" :active-value=true :inactive-value=false
                       @change="updateActive(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <edit @click="handleEdit(scope.row)" class="operate-column-icon"/>
            <delete @click="handleDelete(scope.row)" class="operate-column-icon"/>
            <tickets @click="handleDetail(scope.row)" class="operate-column-icon"/>
            <el-dropdown split-button size="small" type="primary" @command="authorize" style="margin-right: 8px;">
              授权
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in getDictItems('kuark:sys', 'resource_type')"
                                    v-text="item.second" :command="commandValue(item,scope.row)"/>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-dropdown split-button size="small" type="primary" @command="assign">
              用户
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="commandValue(1,scope.row)">关联用户</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(2,scope.row)">查看用户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>

      <role-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <role-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <role-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>
      <menu-authorization v-if="menuAuthorizationDialogVisible" v-model="menuAuthorizationDialogVisible" :rid="rid"/>
      <user-assignment-dialog v-if="userAssignmentDialogVisible" v-model="userAssignmentDialogVisible"
                              :rid="rid" :subSysDictCode="subSysDictCode" :tenantId="tenantId"/>
      <user-list-dialog v-if="userListDialogVisible" v-model="userListDialogVisible" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import RoleAddEdit from './RoleAddEdit.vue'
import RoleDetail from './RoleDetail.vue'
import MenuAuthorization from './MenuAuthorization.vue'
import UserListDialog from './UserListDialog.vue'
import UserAssignmentDialog from './UserAssignmentDialog.vue'
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts";
import {Pair} from "../../../base/Pair.ts"

class ListPage extends TenantSupportListPage {

  public commandValue: any

  constructor(props, context) {
    super(props, context)
    this.commandValue = (item, row) => {
      return {
        item: item,
        row: row
      }
    }
    this.loadDicts([
      new Pair("kuark:sys", "resource_type"),
      new Pair("kuark:sys", "sub_sys")
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        roleCode: null,
        roleName: null,
      },
      menuAuthorizationDialogVisible: false,
      userAssignmentDialogVisible: false,
      userListDialogVisible: false
    }
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params.active = this.state.searchParams.active
    return params
  }

  public commandValue: (item, row) => any

  public authorize: (commandValue) => void

  private doAuthorize(commandValue) {
    const {item, row} = commandValue
    this.state.rid = this.getRowId(row)
    const resType = item.first
    if (resType == 1) {
      this.state.menuAuthorizationDialogVisible = true
    } else if (resType == 2) {

    } else {

    }
  }

  public assign: (type) => void

  private doAssign(type) {
    const {item, row} = type
    this.state.rid = this.getRowId(row)
    this.state.subSysDictCode = row.subSysDictCode
    this.state.tenantId = row.tenantId
    if (item == 1) {
      this.state.userAssignmentDialogVisible = true
    } else {
      this.state.userListDialogVisible = true
    }
  }

  protected convertThis() {
    super.convertThis()
    this.assign = (type) => {
      this.doAssign(type)
    }
    this.authorize = (commandValue) => {
      this.doAuthorize(commandValue)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {RoleAddEdit, RoleDetail, MenuAuthorization, UserAssignmentDialog, UserListDialog},
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
