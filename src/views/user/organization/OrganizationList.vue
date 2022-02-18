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
          <el-cascader ref="parentCascader" :options="subSysOrTenants" v-model="searchParams.subSysOrTenant" :props="cascaderProps"/>
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
                :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange" default-expand-all row-key="id">
        <el-table-column type="selection" width="39"/>
        <el-table-column type="index" width="50"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="组织类型" prop="orgTypeDictCode">
          <template #default="scope">
            {{ transDict("kuark:user", "organization_type", scope.row.orgTypeDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="子系统" prop="subSysDictCode">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="所有者id" prop="ownerId"/>
        <el-table-column label="简称" prop="abbrName"/>
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

      <user-group-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <user-group-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <user-group-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import UserGroupAddEdit from './OrganizationAddEdit.vue'
import UserGroupDetail from './OrganizationDetail.vue'
import {BaseListPage} from "../../../base/BaseListPage.ts"
import {Pair} from "../../../base/Pair.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.loadDicts([
      new Pair("kuark:user", "organization_type"),
      new Pair("kuark:sys", "sub_sys")
    ]).then(() => this.loadTenants())
    this.convertThis()
  }

  protected initState(): any {
    return {
      searchParams: {
        name: null,
        active: true,
        subSysOrTenant: null
      },
      cascaderProps: {
        multiple: false,
        // checkStrictly: true,
        expandTrigger: "hover"
      },
      subSysOrTenants: null
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
    params["name"] = this.state.searchParams.name
    params["active"] = this.state.searchParams.active
    return params
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.name = null
  }

  private async loadTenants() {
    // @ts-ignore
    const result = await ajax({url: "sys/tenant/getAllActiveTenants", method: "post"})
    if (result.data) {
      const options = []
      const subSyses = this.getDictItems("kuark:sys", "sub_sys")
      for(let subSys of subSyses) {
        const subSysOption = {value: subSys.first, label: subSys.second}
        options.push(subSysOption)
        const tenants = result.data[subSys.first]
        if (tenants) {
          const tenantOptions = []
          subSysOption["children"] = tenantOptions
          for (let tenantId in tenants) {
            const tenantOption = {value: tenantId, label: tenants[tenantId]}
            tenantOptions.push(tenantOption)
          }
        }
      }
      this.state.subSysOrTenants = options
    } else {
      ElMessage.error('加载租户信息失败！')
    }
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
  }

}

export default defineComponent({
  name: "~index",
  components: {UserGroupAddEdit, UserGroupDetail},
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

</style>
