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
              <el-input v-model="searchParams.itemCode" placeholder="字典项编码" @change="search" clearable/>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.itemName" placeholder="字典项名称" @change="search" clearable/>
            </el-col>

            <el-col :span="1">
              <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked/>
            </el-col>

            <el-col :span="9">
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
            <el-table-column label="字典类型" prop="dictType" sortable="custom"/>
            <el-table-column label="字典名称" prop="dictName" sortable="custom"/>
            <el-table-column label="所属模块" prop="module" sortable="custom"/>
            <el-table-column label="字典项编码" prop="itemCode" sortable="custom" v-if="!searchParams.isDict"/>
            <el-table-column label="字典项名称" prop="itemName" sortable="custom" v-if="!searchParams.isDict"/>
            <el-table-column label="父项编码" prop="parentCode" sortable="custom" v-if="!searchParams.isDict"/>
            <el-table-column label="顺序" prop="seqNo" sortable="custom" v-if="!searchParams.isDict"/>
            <el-table-column label="启用" v-if="!searchParams.isDict">
              <template #default="scope">
                <el-switch v-model="scope.row.active" :active-value=true :inactive-value=false
                           @change="updateActive(scope.row)" v-if="scope.row.itemCode"/>
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
        </el-col>
      </el-row>

      <dict-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"
                     :module="searchParams.module" :dictType="searchParams.dictType"/>
      <dict-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"
                     :isDict="isDict"/>
      <dict-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>
      <dict-item-detail v-if="itemDetailDialogVisible" v-model="itemDetailDialogVisible" :rid="rid"/>

    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue"
import DictAddEdit from './DictAddEdit.vue'
import DictDetail from './DictDetail.vue'
import DictItemDetail from './DictItemDetail.vue'
import {BaseListPage} from "../../../base/page/BaseListPage.ts"
import {ElMessage} from "element-plus"
import {Pair} from "../../../base/Pair.ts"

class ListPage extends BaseListPage {

  private tree: any

  constructor(props, context, tree: any) {
    super(props, context)
    this.tree = tree

    this.loadModules()
    this.loadDictTypes()
  }

  protected initState(): any {
    return {
      dictTreeProps: {
        label: 'code'
      },
      searchParams: {
        parentId: null,
        level: null,
        module: null,
        dictType: null,
        dictName: null,
        itemCode: null,
        itemName: null,
        active: true,
        isDict: false
      },
      modules: [],
      dictTypes: [],
      dictItemCodes: [],
      searchSource: null,
      isDict: false,
      rootNode: null,
      rootResolve: null,
      itemDetailDialogVisible: false
    }
  }

  protected getRootActionPath(): String {
    return "sys/dict";
  }

  protected getUpdateActiveUrl(): String {
    return "sys/dictItem/updateActive";
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params.active = this.state.searchParams.active ? true : null
    if (params.dictType || params.dictName || params.itemCode || params.itemName) {
      this.state.searchParams.isDict = false
    } else {
      this.state.searchParams.isDict = true
    }
    params.isDict = this.state.searchParams.isDict
    params.parentId = null
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

  protected doHandleDetail(row: any) {
    if (row.itemId == null) {
      this.state.detailDialogVisible = true
    } else {
      this.state.itemDetailDialogVisible = true
    }
    this.state.rid = this.getRowId(row)
  }

  public filterModule: (queryString: string, cb) => void

  private doFilterModule(queryString: string, cb) {
    cb(queryString ? this.state.modules.filter(this.createFilter(queryString)) : this.state.modules)
  }

  public filterDictType: (queryString: string, cb) => void

  private doFilterDictType(queryString: string, cb) {
    cb(queryString ? this.state.dictTypes.filter(this.createFilter(queryString)) : this.state.dictTypes)
  }

  private setParamsForTree(node, expend: Boolean) {
    this.state.searchSource = "tree"
    this.state.searchParams.level = node.level
    if (node.level != 0) {
      if (node.level === 1) {
        this.state.searchParams.module = node.data.code
        this.state.searchParams.dictType = null
        this.state.searchParams.itemCode = null
        this.state.searchParams.isDict = true
      } else if (node.level === 2) {
        this.state.searchParams.module = node.parent.data.code
        this.state.searchParams.dictType = node.data.code
        this.state.searchParams.itemCode = null
        this.state.searchParams.isDict = !expend
      } else {
        this.state.searchParams.module = ListPage.getModuleByNode(node)
        this.state.searchParams.dictType = ListPage.getDictTypeByNode(node)
        if (!expend) {
          this.state.searchParams.itemCode = node.data.code
        }
        this.state.searchParams.isDict = false
      }
      this.state.searchParams.parentId = node.level === 1 ? node.data.code : node.data.id
    }
  }

  private static getModuleByNode(node) {
    while (node.level != 1) {
      node = node.parent
    }
    return node.data.code
  }

  private static getDictTypeByNode(node) {
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
    const result = await ajax({url: "sys/dict/loadTreeNodes", method: "post", params});
    if (result.code == 200) {
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
    const result = await ajax({url: "sys/dict/getDict", params});
    if (result.code == 200) {
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
      firstLevel: this.state.searchParams.level == 1,
      pageNo: this.state.pagination.pageNo,
      pageSize: this.state.pagination.pageSize,
      active: this.state.searchParams.active ? true : null,
      isDict: this.state.searchParams.isDict
    }
    if (this.state.sort.orderProperty) {
      params["orders"] = [{
        property: this.state.sort.orderProperty,
        direction: this.state.sort.orderDirection,
      }]
    }
    // @ts-ignore
    const result = await ajax({url: "sys/dict/searchByTree", method: "post", params});
    if (result.code == 200) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private loadModules() {
    this.loadDicts([
      new Pair("kuark:sys", "module")
    ]).then(() => {
      const items = this.getDictItems("kuark:sys", "module")
      const moduleCodes = []
      for (let item of items) {
        moduleCodes.push({"value": item.first}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
        this.state.modules = moduleCodes
      }
    })
  }

  private async loadDictTypes() {
    // @ts-ignore
    const result = await ajax({url: "sys/dict/loadDictTypes"})
    if (result.code == 200) {
      result.data.forEach((val) => {
        this.state.dictTypes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
      })
    } else {
      ElMessage.error('字典类型列表加载失败！')
    }
  }

  protected convertThis() {
    super.convertThis()
    this.filterModule = (queryString: string, cb) => {
      this.doFilterModule(queryString, cb)
    }
    this.filterDictType = (queryString: string, cb) => {
      this.doFilterDictType(queryString, cb)
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
  components: {DictAddEdit, DictDetail, DictItemDetail},
  setup(props, context) {
    const tree = ref()
    const listPage = reactive(new ListPage(props, context, tree))
    return {
      ...toRefs(listPage.state),
      ...toRefs(listPage),
      tree
    }
  }
})
</script>

<style lang='css' scoped>

</style>
