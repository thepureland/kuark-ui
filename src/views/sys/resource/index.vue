<!--
 * 资源列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>资源列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-tree :props="resourceTreeProps" :load="loadTree" :expand-on-click-node="false"
                   @node-expand="expandTreeNode"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion lazy/>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20" class="toolbar">
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.subSysDictCode" placeholder="所属子系统" @change="search"
                               @select="search" :fetch-suggestions="filterSubSysDictCode" clearable/>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.resourceTypeDictCode" placeholder="资源类型" @change="search" clearable/>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.name" placeholder="资源名称" @change="search" clearable/>
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
          <el-table-column label="所属子系统" prop="subSysDictCode" sortable="custom"/>
          <el-table-column label="资源类型" prop="resourceTypeDictCode" sortable="custom"/>
          <el-table-column label="资源名称" prop="name" sortable="custom"/>
          <el-table-column label="URL" prop="url" sortable="custom"/>
          <el-table-column label="图标" prop="icon" sortable="custom"/>
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
        </el-col>
      </el-row>

<!--      <add-edit-param v-model="addDialogVisible" @response="response"/>
      <add-edit-param v-if="editDialogVisible" v-model="editDialogVisible" @response="response" :rid="rid"/>-->
    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import addEditParam from './addEditResource.vue';
import {BaseListPage} from "../../../base/BaseListPage.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  constructor() {
    super()
    this.loadSubSyses()
    this.convertThis() // 为了解决恶心的this问题
  }

  protected initState(): any {
    return {
      resourceTreeProps: {
        label: 'name'
      },
      searchParams: {
        parentId: null,
        subSysDictCode: null,
        resourceTypeDictCode: null,
        subSysDictCodeForTree: null,
        resourceTypeDictCodeForTree: null,
        name: null,
        active: true,
        level: null
      },
      subSysDictCodes: [],
      resourceTypeDictCodes: [],
      searchSource: null,
    }
  }

  protected getRootActionPath(): String {
    return "sysResource"
  }

  protected createSearchParams() {
    return {
      subSysDictCode: this.state.searchParams.subSysDictCode,
      resourceTypeDictCode: this.state.searchParams.resourceTypeDictCode,
      level: this.state.searchParams.level,
      parentId: this.state.searchParams.parentId,
      name: this.state.searchParams.name,
      active: this.state.searchParams.active ? true : null
    }
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.subSysDictCode = null
    this.state.searchParams.resourceTypeDictCode = null
    this.state.searchParams.name = null
  }

  protected async doSearch(): Promise<void> {
    this.state.searchSource = "button"
    super.doSearch()
  }

  public loadTree: (node, resolve) => void

  private doLoadTree(node, resolve) {
    this.setParamsForTree(node)
    this.laodTreeNodes(node, resolve)
  }

  public expandTreeNode: (nodeData, node) => void

  private doExpandTreeNode(nodeData, node) {
    if (node.level == 0 || node.level == 1) return
    this.resetSearchFields()
    this.setParamsForTree(node)
    this.listByTree()
  }

  public clickTreeNode: (nodeData, node) => void

  private async doClickTreeNode(nodeData, node) {
    if (node.level === 1 || node.level === 2) {
      return
    }
    this.state.searchSource = "tree"
    this.setParamsForTree(node)
    this.resetSearchFields()
    const params = {
      id: nodeData.id,
    }
    // @ts-ignore
    const result = await ajax({url: "sysResource/get", params});
    if (result.data) {
      this.state.tableData = [result.data]
      this.state.pagination.total = 1
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private setParamsForTree(node) {
    if (node.level == 1) {
      this.state.searchParams.resourceTypeDictCodeForTree = node.data.id
    }
    if (node.level == 2) {
      this.state.searchParams.subSysDictCodeForTree = node.data.id
    }
    this.state.searchParams.parentId = node.level != 1 && node.level != 2 ? null : node.data.id
    this.state.searchParams.level = node.level
    this.state.searchParams.resourceTypeDictCode = this.state.searchParams.resourceTypeDictCodeForTree
    this.state.searchParams.subSysDictCode = this.state.searchParams.subSysDictCodeForTree
  }

  private async laodTreeNodes(node, resolve) {
    const params = this.createSearchParams()
    // @ts-ignore
    const result = await ajax({url: "sysResource/laodTreeNodes", method: "post", params});
    if (result.data) {
      resolve(result.data)
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private async listByTree() {
    this.state.searchSource = "tree"
    const params = this.createSearchParams()
    params["pageNo"] = this.state.pagination.pageNo
    params["pageSize"] = this.state.pagination.pageSize
    if (this.state.sort.orderProperty) {
      params["orders"] = [{
        property: this.state.sort.orderProperty,
        direction: this.state.sort.orderDirection,
      }]
    }
    // @ts-ignore
    const result = await ajax({url: "sysResource/searchByTree", method: "post", params})
    if (result.data) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  public filterSubSysDictCode: (queryString: string, cb) => void

  private doFilterSubSysDictCode(queryString: string, cb) {
    cb(queryString ? this.state.subSysDictCodes.filter(this.createFilter(queryString)) : this.state.subSysDictCodes)
  }

  public filterResourceTypeDictCode: (queryString: string, cb) => void

  private doFilterResourceTypeDictCode(queryString: string, cb) {
    cb(queryString ? this.state.resourceTypeDictCodes.filter(this.createFilter(queryString)) : this.state.resourceTypeDictCodes)
  }

  private createFilter(queryString) {
    return (item) => {
      return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }

  public async loadSubSyses() {
    // @ts-ignore
    const result = await ajax({url: "sysResource/loadSubSyses"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.subSysDictCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
    this.loadTree = (node, resolve) => {
      this.doLoadTree(node, resolve)
    }
    this.expandTreeNode = (nodeData, node) => {
      this.doExpandTreeNode(nodeData, node)
    }
    this.clickTreeNode = (nodeData, node) => {
      this.doClickTreeNode(nodeData, node)
    }
    this.filterSubSysDictCode = (queryString: string, cb) => {
      this.doFilterSubSysDictCode(queryString, cb)
    }
    this.filterResourceTypeDictCode = (queryString: string, cb) => {
      this.doFilterResourceTypeDictCode(queryString, cb)
    }
  }

}

export default defineComponent({
  name: "~index",
  // components: {addEditParam},
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
