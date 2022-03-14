<!--
 * 组管理
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>组管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.groupCode" placeholder="组编码" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.groupName" placeholder="组名称" @change="search" clearable/>
        </el-col>

        <el-col :span="2">
          <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
        </el-col>

        <el-col :span="14">
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
        <el-table-column label="组编码" prop="groupCode"/>
        <el-table-column label="组名称" prop="groupName"/>
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
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>

    </el-card>

    <user-group-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
    <user-group-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
    <user-group-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import UserGroupAddEdit from './UserGroupAddEdit.vue'
import UserGroupDetail from './UserGroupDetail.vue'
import {BaseListPage} from "../../../base/page/BaseListPage.ts"

class ListPage extends BaseListPage {

  constructor(props, context) {
    super(props, context)
  }

  protected initState(): any {
    return {
      searchParams: {
        groupCode: null,
        groupName: null,
      },
    }
  }

  protected getRootActionPath(): String {
    return "rbac/group"
  }

}

export default defineComponent({
  name: "~index",
  components: {UserGroupAddEdit, UserGroupDetail},
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
