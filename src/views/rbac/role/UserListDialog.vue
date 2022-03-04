<!--
 * 角色下的账号列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <el-dialog title="用户列表" v-model="visible" width="50%" center @close="close">
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
          <tickets @click="handleDetail(scope.row)" class="operate-column-icon"/>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>

  </el-dialog>

  <account-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseListPage} from "../../../base/page/BaseListPage.ts"
import AccountDetail from '../../user/account/AccountDetail.vue'
import {Pair} from "../../../base/Pair.ts"

class UserListDialog extends BaseListPage {

  constructor(props, context) {
    super(props, context)
    this.loadDicts([
      new Pair("kuark:user", "user_status"),
      new Pair("kuark:user", "user_type"),
    ])
    this.search()
  }

  protected initState(): any {
    return {}
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected getSearchUrl(): String {
    return this.getRootActionPath() + "/searchAssignedUsers"
  }

  protected createSearchParams(): any {
    const params = super.createSearchParams()
    params._roleId = this.props.rid
    return params
  }

}

export default defineComponent({
  name: "~UserListDialog",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue'],
  components: {AccountDetail},
  setup(props, context) {
    const listPage = reactive(new UserListDialog(props, context))
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage),
    }
  }
})
</script>

<style lang='css' scoped>

</style>
