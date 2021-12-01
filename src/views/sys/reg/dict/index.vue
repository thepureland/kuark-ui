<!--
 * 字典列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>字典列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-tree ref="tree" :props="dictTreeProps" :load="loadTree" :expand-on-click-node="false" node-key="id"
                   @node-expand="expandTreeNode"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion lazy/>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20" class="toolbar">
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.module" placeholder="所属模块" @change="search"
                               @select="search" :fetch-suggestions="filterModule" clearable/>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.dictType" placeholder="字典类型" @change="search"
                               @select="search" :fetch-suggestions="filterDictType" :trigger-on-focus="false"
                               clearable/>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.dictName" placeholder="字典名称" @change="search" clearable/>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.itemCode" placeholder="字典项编码" @change="search"
                               @select="search" :fetch-suggestions="filterDictItemCode"
                               :trigger-on-focus="false" clearable/>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.itemName" placeholder="字典项名称" @change="search" clearable/>
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
            <el-table-column label="字典类型" prop="dictType" sortable="custom"/>
            <el-table-column label="字典名称" prop="dictName" sortable="custom"/>
            <el-table-column label="所属模块" prop="module" sortable="custom"/>
            <el-table-column label="字典项编码" prop="itemCode" sortable="custom"/>
            <el-table-column label="字典项名称" prop="itemName" sortable="custom"/>
            <el-table-column label="父项编码" prop="parentCode" sortable="custom"/>
            <el-table-column label="顺序" prop="seqNo" sortable="custom"/>
            <el-table-column label="启用">
              <template #default="scope">
                <el-switch v-model="scope.row.active" :active-value=true :inactive-value=false
                           @change="updateActive(scope.row)" v-if="scope.row.itemCode"/>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="handleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button @click="handleDelete(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>
        </el-col>
      </el-row>

      <add-edit-dict v-model="addDialogVisible" @response="afterAdd"/>
      <add-edit-dict v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"
                     :isDict="isDict"/>
    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue";
import addEditDict from './addEditDict.vue';
import {BaseListPage} from "../../../../base/BaseListPage.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  private tree: any

  constructor(tree: any) {
    super()
    this.tree = tree

    this.loadModules()
    this.loadDictTypes()
    this.loadDictItemCodes()

    this.convertThis()
  }

  protected initState(): any {
    return {
      dictTreeProps: {
        label: 'code'
      },
      searchParams: {
        parentId: null,
        firstLevel: null,
        module: null,
        dictType: null,
        dictName: null,
        itemCode: null,
        itemName: null,
        active: true
      },
      modules: [],
      dictTypes: [],
      dictItemCodes: [],
      searchSource: null,
      isDict: null,
      rootNode: null,
      rootResolve: null
    }
  }

  protected getRootActionPath(): String {
    return "regDict";
  }

  protected getUpdateActiveUrl(): String {
    return "regDictItem/updateActive";
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params["module"] = this.state.searchParams.module
    params["dictType"] = this.state.searchParams.dictType
    params["dictName"] = this.state.searchParams.dictName
    params["itemCode"] = this.state.searchParams.itemCode
    params["itemName"] = this.state.searchParams.itemName
    params["active"] = this.state.searchParams.active ? true : null
    return params
  }

  protected createDeleteParams(row: any): any {
    return {
      id: row.itemId == null ? row.dictId : row.itemId,
      isDict: row.itemId == null
    }
  }

  protected createBatchDeleteParams(): any {
    const params = {}
    for (let row of this.state.selectedItems) {
      params[this.getRowId(row)] = row.itemId == null
    }
    return params
  }

  protected async doSearch(): Promise<void> {
    this.state.searchSource = "button"
    await super.doSearch()
  }

  protected doAfterAdd(params: any) {
    super.doAfterAdd(params)
    this.state.rootNode.childNodes = []
    this.doLoadTree(this.state.rootNode, this.state.rootResolve)
  }

  protected doAfterEdit(params: any) {
    this.doAfterAdd(params)
  }

  protected doAfterDelete(ids: Array<any>) {
    super.doAfterDelete(ids)
    for (let id of ids) {
      this.tree.value.remove({"id": id})
    }
  }

  protected doHandleSizeChange(newSize: number) {
    this.state.pagination.pageSize = newSize
    if (this.state.searchSource == "button") {
      this.search()
    } else {
      this.searchByTree()
    }
  }

  protected doHandleCurrentChange(newCurrent: number) {
    if (newCurrent) {
      this.state.pagination.pageNo = newCurrent
      if (this.state.searchSource == "button") {
        this.search()
      } else {
        this.searchByTree()
      }
    }
  }

  protected doResetSearchFields() {
    super.doResetSearchFields()
    this.state.searchParams.module = null
    this.state.searchParams.dictType = null
    this.state.searchParams.dictName = null
    this.state.searchParams.itemCode = null
    this.state.searchParams.itemName = null
  }

  protected getDeleteMessage(row: any): string {
    if (row.itemCode == null) {
      return '删除字典类型时，将删除所有字典项，依然进行删除操作吗？'
    }
    return '将级联删除所有孩子结点（如果有的话），依然进行删除操作吗？'
  }

  protected getBatchDeleteMessage(rows: Array<any>): string {
    const existDict = rows.findIndex((row) => row.itemCode == null) != -1
    if (existDict) {
      return '删除字典类型时，将删除所有字典项；删除字典项时，将级联删除所有孩子结点（如果有的话）。' + super.getBatchDeleteMessage(rows)
    }
    return '将级联删除所有孩子结点（如果有的话），' + super.getBatchDeleteMessage(rows)
  }

  protected getRowId(row: any): String | Number {
    return row.itemId == null ? row.dictId : row.itemId
  }

  protected doHandleEdit(row: any) {
    super.doHandleEdit(row);
    this.state.isDict = row.itemId == null
  }

  public filterModule: (queryString: string, cb) => void

  private doFilterModule(queryString: string, cb) {
    cb(queryString ? this.state.modules.filter(this.createFilter(queryString)) : this.state.modules)
  }

  public filterDictType: (queryString: string, cb) => void

  private doFilterDictType(queryString: string, cb) {
    cb(queryString ? this.state.dictTypes.filter(this.createFilter(queryString)) : this.state.dictTypes)
  }

  public filterDictItemCode: (queryString: string, cb) => void

  private doFilterDictItemCode(queryString: string, cb) {
    cb(queryString ? this.state.dictItemCodes.filter(this.createFilter(queryString)) : this.state.dictItemCodes)
  }

  private setParamsForTree(node, expend: Boolean) {
    this.state.searchSource = "tree"
    this.state.searchParams.level = node.level
    if (node.level != 0) {
      if (node.level === 1) {
        this.state.searchParams.module = node.data.code
        this.state.searchParams.dictType = null
        this.state.searchParams.itemCode = null
      } else if (node.level === 2) {
        this.state.searchParams.module = node.parent.data.code
        this.state.searchParams.dictType = node.data.code
        this.state.searchParams.itemCode = null
      } else {
        this.state.searchParams.module = this.getModuleByNode(node)
        this.state.searchParams.dictType = this.getDictTypeByNode(node)
        if (!expend) {
          this.state.searchParams.itemCode = node.data.code
        }
      }
      this.state.searchParams.parentId = node.level === 1 ? node.data.code : node.data.id
      this.state.searchParams.firstLevel = node.level === 1
    }
  }

  private getModuleByNode(node) {
    while (node.level != 1) {
      node = node.parent
    }
    return node.data.code
  }

  private getDictTypeByNode(node) {
    while (node.level != 2) {
      node = node.parent
    }
    return node.data.code
  }

  public loadTree: (node, resolve) => void

  private async doLoadTree(node, resolve) {
    if (node.level === 0) {
      this.state.rootNode = node
      this.state.rootResolve = resolve
    }
    this.resetSearchFields()
    this.setParamsForTree(node, true)
    const params = {
      parentId: node.level === 0 ? null : (node.level === 1 ? node.data.code : node.data.id),
      firstLevel: node.level === 1,
      active: this.state.searchParams.active ? true : null
    }
    // @ts-ignore
    const result = await ajax({url: "regDict/loadTreeNodes", method: "post", params});
    if (result.data) {
      resolve(result.data)
    } else {
      ElMessage.error('字典树加载失败！')
    }
  }

  public expandTreeNode: (nodeData, node) => void

  private doExpandTreeNode(nodeData, node) {
    if (node.data) {
      this.resetSearchFields()
      this.setParamsForTree(node, true)
      this.searchByTree()
    }
  }

  public clickTreeNode: (nodeData, node) => void

  private async doClickTreeNode(nodeData, node) {
    if (node.level === 1) {
      return
    }
    this.state.searchSource = "tree"
    this.resetSearchFields()
    this.setParamsForTree(node, false)
    const params = {
      id: nodeData.id,
      isDict: node.level === 2
    }
    // @ts-ignore
    const result = await ajax({url: "regDict/get", params});
    if (result.data) {
      this.state.tableData = [result.data]
      this.state.pagination.total = 1
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private createFilter(queryString) {
    return (item) => {
      return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }

  private async searchByTree() {
    this.state.searchSource = "tree"
    const params = {
      parentId: this.state.searchParams.parentId,
      firstLevel: this.state.searchParams.firstLevel,
      pageNo: this.state.pagination.pageNo,
      pageSize: this.state.pagination.pageSize,
      active: this.state.searchParams.active ? true : null
    }
    if (this.state.sort.orderProperty) {
      params["orders"] = [{
        property: this.state.sort.orderProperty,
        direction: this.state.sort.orderDirection,
      }]
    }
    // @ts-ignore
    const result = await ajax({url: "regDict/searchByTree", method: "post", params});
    if (result.data) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private async loadModules() {
    // @ts-ignore
    const result = await ajax({url: "regDict/loadModules"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.modules.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('模块列表加载失败！')
    }
  }

  private async loadDictTypes() {
    // @ts-ignore
    const result = await ajax({url: "regDict/loadDictTypes"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.dictTypes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('字典类型列表加载失败！')
    }
  }

  private async loadDictItemCodes() {
    // @ts-ignore
    const result = await ajax({url: "regDictItem/loadDictItemCodes"})
    if (result.data) {
      result.data.forEach((val) => {
        this.state.dictItemCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('字典项编码列表加载失败！')
    }
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
    this.filterModule = (queryString: string, cb) => {
      this.doFilterModule(queryString, cb)
    }
    this.filterDictType = (queryString: string, cb) => {
      this.doFilterDictType(queryString, cb)
    }
    this.filterDictItemCode = (queryString: string, cb) => {
      this.doFilterDictItemCode(queryString, cb)
    }
    this.loadTree = (node, resolve) => {
      this.doLoadTree(node, resolve)
    }
    this.expandTreeNode = (nodeData, node) => {
      this.doExpandTreeNode(nodeData, node)
    }
    this.clickTreeNode = (nodeData, node) => {
      this.doClickTreeNode(nodeData, node)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {addEditDict},
  setup(props, context) {
    const tree = ref()
    const listPage = reactive(new ListPage(tree))
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage),
      tree
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
