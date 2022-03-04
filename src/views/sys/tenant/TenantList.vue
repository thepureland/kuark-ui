<!--
 * 租户列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>租户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.name" placeholder="租户名称" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-select v-model="searchParams.subSysDictCode" placeholder="子系统" clearable>
            <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                       :key="item.first" :value="item.first" :label="item.second"/>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
        </el-col>

        <el-col :span="15">
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
        <el-table-column label="租户名称" prop="name" sortable="custom"/>
        <el-table-column label="子系统" prop="subSysDictCode">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
          </template>
        </el-table-column>
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

      <tenant-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <tenant-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <tenant-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import TenantAddEdit from './TenantAddEdit.vue';
import TenantDetail from './TenantDetail.vue';
import {BaseListPage} from "../../../base/page/BaseListPage.ts";
import {Pair} from "../../../base/Pair.ts";

class ListPage extends BaseListPage {

  constructor(props, context) {
    super(props, context)
    this.loadDicts([
      new Pair("kuark:sys", "sub_sys"),
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        name: null,
        subSysDictCode: null,
        active: true
      },
    }
  }

  protected getRootActionPath(): String {
    return "sys/tenant"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params.active = this.state.searchParams.active ? true : null
    return params
  }

}

export default defineComponent({
  name: "~index",
  components: {TenantAddEdit, TenantDetail},
  setup(props, context) {
    const listPage = reactive(new ListPage(props, context))
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage)
    }
  }
})
</script>

<style lang='css' scoped>

</style>
