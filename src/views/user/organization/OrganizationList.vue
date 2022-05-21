<!--
 * 组织列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>组织列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                       :props="cascaderProps" placeholder="子系统/租户" />
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
                :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange" default-expand-all row-key="id">
        <el-table-column type="selection" width="39"/>
        <el-table-column type="index" width="50"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="简称" prop="abbrName"/>
        <el-table-column label="组织类型" prop="orgTypeDictCode">
          <template #default="scope">
            {{ transDict("kuark:user", "organization_type", scope.row.orgTypeDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="seqNo"/>
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

      <organization-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <organization-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <organization-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import OrganizationAddEdit from './OrganizationAddEdit.vue'
import OrganizationDetail from './OrganizationDetail.vue'
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts";
import {Pair} from "../../../base/Pair.ts";

class ListPage extends TenantSupportListPage {

  constructor(props, context) {
    super(props, context)
    this.loadDicts([
      new Pair("kuark:user", "organization_type"),
      new Pair("kuark:sys", "sub_sys")
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        active: true,
      },
    }
  }

  protected getRootActionPath(): String {
    return "user/organization"
  }

  protected getSearchUrl(): String {
    return this.getRootActionPath() + "/searchTree"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    if (params) {
      params.active = this.state.searchParams.active
    }
    return params
  }

  protected getDeleteMessage(row: any): string {
    return '将级联删除所有孩子结点（如果有的话），依然进行删除操作吗？'
  }

  protected getBatchDeleteMessage(rows: Array<any>): string {
    return '将级联删除所有孩子结点（如果有的话），' + super.getBatchDeleteMessage(rows)
  }

  protected isCheckStrictly(): boolean {
    return false
  }

  protected isRequireSubSysOrTenantForSearch(): boolean {
    return true
  }

}

export default defineComponent({
  name: "~index",
  components: {OrganizationAddEdit, OrganizationDetail},
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
