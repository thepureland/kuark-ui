<!--
 * 参数列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-autocomplete v-model="searchParams.module" placeholder="所属模块" @change="search"
                           @select="search" :fetch-suggestions="filterModule" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.paramName" placeholder="参数名称" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="searchParams.paramValue" placeholder="参数值" @change="search" clearable/>
        </el-col>

        <el-col :span="1">
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
        <el-table-column label="参数名称" prop="paramName" sortable="custom"/>
        <el-table-column label="参数值" prop="paramValue" sortable="custom"/>
        <el-table-column label="参数默认值" prop="defaultValue" sortable="custom"/>
        <el-table-column label="所属模块" prop="module" sortable="custom"/>
        <el-table-column label="顺序" prop="seqNo" sortable="custom"/>
        <el-table-column label="启用">
          <template #default="scope">
            <el-switch v-model="scope.row.active" :active-value=true :inactive-value=false
                       @change="updateActive(scope.row)"/>
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

      <add-edit-param v-model="addDialogVisible" @response="response"/>
      <add-edit-param v-if="editDialogVisible" v-model="editDialogVisible" @response="response" :rid="rid"/>
    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import addEditParam from './addEditParam.vue';
import {BaseListPage} from "../../../base/BaseListPage.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.loadModules()
    this.convertThis() // 为了解决恶心的this问题
  }

  protected initState(): any {
    return {
      searchParams: {
        module: '',
        paramName: '',
        paramValue: '',
        active: true
      },
      modules: []
    }
  }

  protected getRootActionPath(): String {
    return "sysParam"
  }

  protected createSearchParams() {
    return {
      module: this.state.searchParams.module,
      paramName: this.state.searchParams.paramName,
      paramValue: this.state.searchParams.paramValue,
      active: this.state.searchParams.active ? true : null
    }
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.module = null
    this.state.searchParams.paramName = null
    this.state.searchParams.paramValue = null
  }

  public filterModule: (queryString: string, cb) => void

  private doFilterModule(queryString: string, cb) {
    cb(queryString ? this.state.modules.filter(this.createFilter(queryString)) : this.state.modules)
  }

  private createFilter(queryString) {
    return (item) => {
      return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }

  public async loadModules() {
    // @ts-ignore
    const result = await ajax({url: "sysParam/loadModules"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.modules.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
    this.filterModule = (queryString: string, cb) => {
      this.doFilterModule(queryString, cb)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {addEditParam},
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
