<!--
 * 账号列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div style="height: 90%">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20" class="toolbar">
      <el-col :span="2">
        <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                     :props="cascaderProps" placeholder="子系统/租户"/>
      </el-col>
      <el-col :span="2">
        <el-input v-model="searchParams.username" placeholder="用户名" @change="search" clearable/>
      </el-col>

      <el-col :span="16">
        <el-button type="primary" round @click="search">搜索</el-button>
        <el-button type="primary" round @click="resetSearchFields">重置</el-button>
        <el-button type="success" @click="openAddDialog">添加</el-button>
        <el-button type="danger" @click="multiDelete">删除</el-button>
      </el-col>
    </el-row>


    <el-container style="height: 100%; border: 1px solid #eee">

      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-scrollbar>
          <el-tree
              :data="organizations"
              node-key="id"
              default-expand-all
              :props="defaultProps"
          />
        </el-scrollbar>
      </el-aside>

      <el-main>
        <el-table border stripe :data="tableData" height="94%" @selection-change="handleSelectionChange"
                  :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange">
          <el-table-column type="selection" width="39"/>
          <el-table-column type="index" width="50"/>
          <el-table-column label="用户名" prop="username"/>
          <el-table-column label="子系统" prop="subSysDictCode">
            <template #default="scope">
              {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
            </template>
          </el-table-column>
          <el-table-column label="用户状态" prop="userStatusDictCode">
            <template #default="scope">
              {{ transDict("kuark:user", "user_status", scope.row.userStatusDictCode) }}
            </template>
          </el-table-column>
          <el-table-column label="用户类型" prop="userTypeDictCode">
            <template #default="scope">
              {{ transDict("kuark:user", "user_type", scope.row.userTypeDictCode) }}
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
      </el-main>

    </el-container>

    <account-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
    <account-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
    <account-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>
  </div>

</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import AccountAddEdit from './AccountAddEdit.vue'
import AccountDetail from './AccountDetail.vue'
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts"
import {Pair} from "../../../base/Pair.ts"
import {ElMessage} from "element-plus";

class ListPage extends TenantSupportListPage {

  constructor(props, context) {
    super(props, context)
    this.loadDicts([
      new Pair("kuark:user", "user_status"),
      new Pair("kuark:user", "user_type"),
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        username: null,
      },
      userStatuses: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      organizations: []
    }
  }

  protected getRootActionPath(): String {
    return "user/account"
  }

  protected isCheckStrictly(): boolean {
    return false
  }

  protected isRequireSubSysOrTenantForSearch(): boolean {
    return true
  }

  protected async doSearch(): Promise<void> {
    const pair = super.parseSubSysOrTenant()
    if (pair == null) return null
    this.loadTree(pair)
    return super.doSearch()
  }

  private async loadTree(pair) {
    const params = {
      subSysDictCode: pair.first,
      tenantId: pair.second
    }
    // @ts-ignore
    const result = await ajax({url: "user/organization/loadTree", params})
    if (result.code == 200) {
      this.state.organizations = result.data
    } else {
      ElMessage.error('加载组织机构树失败！')
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {AccountAddEdit, AccountDetail},
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

.el-aside {
  width: 240px;
  color: var(--el-text-color-primary);
  background: #fff !important;
  border-right: solid 1px #e6e6e6;
  box-sizing: border-box;
}

.el-main {
  padding: 0;
}

</style>
