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
          <el-tree :props="dictTreeProps" :load="loadTree" :expand-on-click-node="false"
                   @node-expand="expandTreeNode"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion lazy/>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20" class="toolbar">
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.module" placeholder="所属模块" @change="search"
                               @select="search" :fetch-suggestions="filterModule"
                               clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.dictType" placeholder="字典类型" @change="search"
                               @select="search" :fetch-suggestions="filterDictType"
                               :trigger-on-focus="false"
                               clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.dictName" placeholder="字典名称" @change="search"
                        clearable></el-input>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.itemCode" placeholder="字典项编码" @change="search"
                               @select="search" :fetch-suggestions="filterDictItemCode"
                               :trigger-on-focus="false"
                               clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.itemName" placeholder="字典项名称" @change="search"
                        clearable></el-input>
            </el-col>

            <el-col :span="1">
              <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked></el-checkbox>
            </el-col>

            <el-col :span="1">
              <el-button type="primary" round @click="search">搜索</el-button>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" round @click="resetSearchFields">重置</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="success" @click="openAddDialog">添加</el-button>
              <el-button type="danger" @click="">删除</el-button>
            </el-col>
          </el-row>

          <el-table border stripe :data="tableData" height="650" :header-cell-style="{textAlign: 'center'}"
                    @sort-change="handleSortChange">
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
                <el-button @click="handleDelete(scope.row)" type="danger" size="mini" icon="el-icon-delete"
                           v-if="scope.row.itemCode">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>
        </el-col>
      </el-row>

      <add-edit-dict v-model="addDialogVisible" @response="response"/>
      <add-edit-dict v-if="editDialogVisible" v-model="editDialogVisible" @response="response" :rid="rid" :isDict="isDict"/>
    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import addEditDict from './addEditDict.vue';
import {BaseListPage} from "../../../base/BaseListPage.ts";

class ListPage extends BaseListPage {

  constructor() {
    super()

    this.loadModules(this.state)
    this.loadDictTypes(this.state)
    this.loadDictItemCodes(this.state)

    this.convertThis() // 为了解决恶心的this问题
  }

  protected initState(): any {
    return {
      dictTreeProps: {
        label: 'code'
      },
      searchParams: {
        parentId: '',
        firstLevel: '',
        module: '',
        dictType: '',
        dictName: '',
        itemCode: '',
        itemName: '',
        active: true
      },
      modules: [],
      dictTypes: [],
      dictItemCodes: [],
      searchSource: null,
      isDict: null
    }
  }

  protected getSearchUrl(): String {
    return "sysDict/list";
  }

  protected getDeleteUrl(): String {
    return "sysDict/delete";
  }

  protected createSearchParams() {
    return {
      module: this.state.searchParams.module,
      dictType: this.state.searchParams.dictType,
      dictName: this.state.searchParams.dictName,
      itemCode: this.state.searchParams.itemCode,
      itemName: this.state.searchParams.itemName,
      pageNo: this.state.pagination.pageNo,
      pageSize: this.state.pagination.pageSize,
      active: this.state.searchParams.active ? true : null
    }
  }

  protected createDeleteParams(row: any): any {
    return {
      id: row.itemId == null ? row.dictId : row.itemId,
      isDict: row.itemId == null
    }
  }

  protected async doSearch(): Promise<void> {
    this.state.searchSource = "button"
    super.doSearch()
  }

  protected doHandleSizeChange(newSize: number) {
    this.state.pagination.pageSize = newSize
    if (this.state.searchSource == "button") {
      this.search()
    } else {
      this.listByTree(this.state)
    }
  }

  protected doHandleCurrentChange(newCurrent: number) {
    if (newCurrent) {
      this.state.pagination.pageNo = newCurrent
      if (this.state.searchSource == "button") {
        this.search()
      } else {
        this.listByTree(this.state)
      }
    }
  }

  protected doResetSearchFields() {
    this.state.searchParams.module = null
    this.state.searchParams.dictType = null
    this.state.searchParams.dictName = null
    this.state.searchParams.itemCode = null
    this.state.searchParams.itemName = null
    this.state.pagination.pageNo = 1
  }

  protected getDeleteMessage(): string {
    return '将级联删除所有孩子结点（如果有的话），依然进行删除操作吗？'
  }

  protected doHandleEdit(row: any) {
    super.doHandleEdit(row);
    this.state.isDict = row.itemId == null
    this.state.rid = this.state.isDict ? row.dictId : row.itemId
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

  public loadTree: (node, resolve) => void

  private doLoadTree(node, resolve) {
    this.laodTreeNodes(this.state, node, resolve)
  }

  public expandTreeNode: (nodeData, node) => void

  private doExpandTreeNode(nodeData, node) {
    if (node.data) {
      this.resetSearchFields()
      this.state.searchParams.parentId = node.level === 1 ? node.data.code : node.data.id
      this.state.searchParams.firstLevel = node.level === 1
      this.listByTree(this.state)
    }
  }

  public clickTreeNode: (nodeData, node) => void

  private async doClickTreeNode(nodeData, node) {
    if (node.level === 1) {
      return
    }
    this.state.searchSource = "tree"
    this.resetSearchFields()
    const params = {
      id: nodeData.id,
      isDict: node.level === 2
    }
    // @ts-ignore
    const result = await ajax({url: "sysDict/get", params});
    this.state.tableData = [result.data]
    this.state.pagination.total = 1
  }

  public async updateActive(row) {
    const params = {
      searchPayload: {
        id: row.itemId
      },
      active: row.active
    }
    // @ts-ignore
    const result = await ajax({url: "sysDictItem/update", method: "put", params});
  }

  private createFilter(queryString) {
    return (item) => {
      return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }

  public async laodTreeNodes(state: any, node, resolve) {
    const params = {
      parentId: node.level === 0 ? null : (node.level === 1 ? node.data.code : node.data.id),
      firstLevel: node.level === 1,
      active: state.searchParams.active ? true : null
    }
    // @ts-ignore
    const result = await ajax({url: "sysDict/laodTreeNodes", method: "post", params});
    resolve(result.data)
  }

  public async listByTree(state: any) {
    this.state.searchSource = "tree"
    const params = {
      parentId: state.searchParams.parentId,
      firstLevel: state.searchParams.firstLevel,
      pageNo: state.pagination.pageNo,
      pageSize: state.pagination.pageSize,
      active: state.searchParams.active ? true : null
    }
    if (state.sort.orderProperty) {
      params["orders"] = [{
        property: state.sort.orderProperty,
        direction: state.sort.orderDirection,
      }]
    }
    // @ts-ignore
    const result = await ajax({url: "sysDict/listByTree", method: "post", params});
    state.tableData = result.data.first
    state.pagination.total = result.data.second
  }

  public async loadModules(state: any) {
    // @ts-ignore
    const result = await ajax({url: "sysDict/loadModules"})
    result.data.forEach((val) => {
      state.modules.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
    })
  }

  public async loadDictTypes(state: any) {
    // @ts-ignore
    const result = await ajax({url: "sysDict/loadDictTypes"})
    result.data.forEach((val) => {
      state.dictTypes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
    })
  }

  public async loadDictItemCodes(state: any) {
    // @ts-ignore
    const result = await ajax({url: "sysDictItem/loadDictItemCodes"})
    result.data.forEach((val) => {
      state.dictItemCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
    })
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
