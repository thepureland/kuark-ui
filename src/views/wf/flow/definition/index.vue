<!--
 * 流程定义
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工作流管理</el-breadcrumb-item>
      <el-breadcrumb-item>流程定义</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.key" placeholder="流程key" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.name" placeholder="流程名称" clearable/>
        </el-col>
        <el-col :span="2">
          <el-select v-model="searchParams.category" placeholder="分类" clearable>
            <el-option v-for="item in categories" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-checkbox v-model="searchParams.latestOnly" label="仅显示最新版本" class="el-input" checked/>
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
        <el-table-column label="流程key" prop="key" sortable="custom"/>
        <el-table-column label="流程名称" prop="name" sortable="custom"/>
        <el-table-column label="版本" prop="version" sortable="custom"/>
        <el-table-column label="分类" prop="category" :formatter="transDict1" sortable="custom">
<!--          <template #default="scope">
            {{ transDict("kuark:flow", "flow_category", scope.row.category, scope.row) }}
          </template>-->
        </el-table-column>
        <el-table-column label="已部署" sortable="custom">
          <template #default="scope">
            {{ formatBool(scope.row.deployed) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable="custom">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最近更新时间" sortable="custom">
          <template #default="scope">
            {{ formatDate(scope.row.lastUpdateTime) }}
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
    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import {BaseListPage} from "../../../../base/BaseListPage.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.loadCategories()
    this.convertThis()
  }

  protected initState(): any {
    return {
      searchParams: {
        key: null,
        name: null,
        category: null,
        latestOnly: true
      },
      categories: []
    }
  }

  protected getRootActionPath(): String {
    return "flow/definition"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params["key"] = this.state.searchParams.key
    params["name"] = this.state.searchParams.name
    params["category"] = this.state.searchParams.category
    params["latestOnly"] = this.state.searchParams.latestOnly ? true : null
    return params
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.key = null
    this.state.searchParams.name = null
    this.state.searchParams.category = null
  }

  public async loadCategories() {
    // @ts-ignore
    const result = await ajax({url: "flow/definition/loadCategories"})
    if (result.data) {
      for (let key in result.data) {
        this.state.categories.push({key: key, value: result.data[key]})
      }
    } else {
      ElMessage.error('分类失败！')
    }
  }

  protected transDictOnRow(row: any, type: String, value: String) {
    row["category"] = value
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {

  }

}

export default defineComponent({
  name: "~index",
//  components: {addEditParam},
  setup(props, context) {
    const listPage = reactive(new ListPage())
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage)
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
