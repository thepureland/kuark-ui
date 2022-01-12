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
          <el-input v-model="searchParams.roleCode" placeholder="角色编码" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.roleName" placeholder="角色名称" @change="search" clearable/>
        </el-col>

        <el-col :span="2">
          <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
        </el-col>

        <el-col :span="1">
          <el-button type="primary" round @click="search">搜索</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" round @click="resetSearchFields">重置</el-button>
        </el-col>
        <el-col :span="8">
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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>

      <add-edit-role v-model="addDialogVisible" @response="afterAdd"/>
      <add-edit-role v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue"
import addEditRole from './addEditRole.vue';
import {BaseListPage} from "../../../base/BaseListPage.ts"

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.convertThis()
  }

  protected initState(): any {
    return {
      searchParams: {
        roleCode: null,
        roleName: null,
      },
    }
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params["roleCode"] = this.state.searchParams.roleCode
    params["roleName"] = this.state.searchParams.roleName
    return params
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.roleCode = null
    this.state.searchParams.roleName = null
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
  }

}

export default defineComponent({
  name: "~index",
  components: {addEditRole},

//  components: {addEditParam},
  setup(props, context) {
    const listPage = reactive(new ListPage())
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage),
    }
  }
})
</script>

<style lang='css' scoped>
.el-breadcrumb {
  margin-bottom: 14px;
}

.el-pagination {
  margin-top: 10px;
  text-align: right;
}

.toolbar {
  margin-bottom: 10px;
}
</style>
