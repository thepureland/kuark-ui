<!--
 * 账号列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.username" placeholder="用户名" @change="search" clearable/>
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
        <el-table-column label="用户名" prop="username"/>
        <el-table-column label="子系统" prop="subSysDictCode">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode, scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="userStatusDictCode">
          <template #default="scope">
            {{ transDict("kuark:user", "user_status", scope.row.userStatusDictCode, scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="用户类型" prop="userTypeDictCode">
          <template #default="scope">
            {{ transDict("kuark:user", "user_type", scope.row.userTypeDictCode, scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="最后一次登陆时间">
          <template #default="scope">
            {{ formatDate(scope.row.lastLoginTime) }}
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

      <add-edit-account v-model="addDialogVisible" @response="afterAdd"/>
      <add-edit-account v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue"
import AddEditAccount from './AddEditAccount.vue';
import {BaseListPage} from "../../../base/BaseListPage.ts"

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.loadDict("kuark:user", "user_status")
    this.loadDict("kuark:user", "user_type")
    this.loadDict("kuark:sys", "sub_sys")
    this.convertThis()
  }

  protected initState(): any {
    return {
      searchParams: {
        username: null,
      },
      userStatuses: []
    }
  }

  protected getRootActionPath(): String {
    return "user/account"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params["username"] = this.state.searchParams.username
    return params
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.username = null
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
  }

}

export default defineComponent({
  name: "~index",
  components: {AddEditAccount},
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
