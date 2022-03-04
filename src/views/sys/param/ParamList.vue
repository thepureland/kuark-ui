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

        <el-col :span="13">
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

      <param-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <param-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <param-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import ParamAddEdit from './ParamAddEdit.vue'
import ParamDetail from './ParamDetail.vue'
import {BaseListPage} from "../../../base/page/BaseListPage.ts"
import {Pair} from "../../../base/Pair.ts"

class ListPage extends BaseListPage {

  constructor(props, context) {
    super(props, context)
    this.loadModules()
  }

  protected initState(): any {
    return {
      searchParams: {
        module: null,
        paramName: null,
        paramValue: null,
        active: true
      },
      modules: []
    }
  }

  protected getRootActionPath(): String {
    return "sys/param"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params["active"] = this.state.searchParams.active ? true : null
    return params
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
    this.loadDicts([
        new Pair("kuark:sys", "module")
    ]).then(()=> {
        const items = this.getDictItems("kuark:sys", "module")
        const moduleCodes = []
        for (let item of items) {
            moduleCodes.push({"value": item.first}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
            this.state.modules = moduleCodes
        }
    })
  }

  protected convertThis() {
    super.convertThis()
    this.filterModule = (queryString: string, cb) => {
      this.doFilterModule(queryString, cb)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {ParamAddEdit, ParamDetail},
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
