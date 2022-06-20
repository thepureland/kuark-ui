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
          <el-tree ref="tree" :props="resourceTreeProps" :load="loadTree" :expand-on-click-node="false" node-key="id"
                   @node-expand="expandTreeNode"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion lazy/>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20" class="toolbar">
            <el-col :span="2">
              <el-select v-model="searchParams.resourceTypeDictCode" placeholder="资源类型" clearable>
                <el-option v-for="item in getDictItems('kuark:sys', 'resource_type')"
                           :key="item.first" :value="item.first" :label="item.second"/>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-select v-model="searchParams.subSysDictCode" placeholder="子系统" clearable>
                <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                           :key="item.first" :value="item.first" :label="item.second"/>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.name" placeholder="资源名称" @change="search" clearable/>
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
            <el-table-column label="子系统" prop="subSysDictCode">
              <template #default="scope">
                {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
              </template>
            </el-table-column>
            <el-table-column label="资源类型" prop="resourceTypeDictCode">
              <template #default="scope">
                {{ transDict("kuark:sys", "resource_type", scope.row.resourceTypeDictCode) }}
              </template>
            </el-table-column>
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

      <resource-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <resource-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <resource-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>

  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs, ref} from "vue"
import ResourceAddEdit from './ResourceAddEdit.vue'
import ResourceDetail from './ResourceDetail.vue'
import {BaseListPage} from "../../../base/page/BaseListPage.ts"
import {ElMessage} from "element-plus"
import {Pair} from "../../../base/Pair.ts"

class ListPage extends BaseListPage {

  private tree: any

  constructor(props, context, tree) {
    super(props, context)
    this.tree = tree
    this.loadDicts([
      new Pair("kuark:sys", "sub_sys"),
      new Pair("kuark:sys", "resource_type"),
    ])
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
        name: null,
        active: true,
        level: null
      },
      resourceTypes: [],
      searchSource: null,
      rootNode: null,
      rootResolve: null
    }
  }

  protected getRootActionPath(): String {
    return "sys/resource"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params.parentId = this.state.searchSource == "button" ? null : this.state.searchParams.parentId
    params.active = this.state.searchParams.active ? true : null
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

  public loadTree: (node, resolve) => void

  private async doLoadTree(node, resolve) {
    if (node.level === 0) {
      this.state.rootNode = node
      this.state.rootResolve = resolve
    }
    this.setParamsForTree(node, true)
    const params = this.createSearchParams()
    // @ts-ignore
    const result = await ajax({url: "sys/resource/loadTreeNodes", method: "post", params});
    if (result.code == 200) {
      resolve(result.data)
    } else {
      ElMessage.error('资源树加载失败！')
    }
  }

  public expandTreeNode: (nodeData, node) => void

  private doExpandTreeNode(nodeData, node) {
    if (node.level == 0 || node.level == 1) return
    this.resetSearchFields()
    this.setParamsForTree(node, true)
    this.searchByTree()
  }

  public clickTreeNode: (nodeData, node) => void

  private async doClickTreeNode(nodeData, node) {
    if (node.level === 1 || node.level === 2) {
      return
    }
    this.resetSearchFields()
    this.setParamsForTree(node, false)
    // const params = {
    //   id: nodeData.id,
    //   resourceTypeDictCode: this.getResourceTypeByNode(node),
    // }
    const params = this.createSearchParams()
    params.id = nodeData.id
    params.resourceTypeDictCode = this.getResourceTypeByNode(node)
    // @ts-ignore
    const result = await ajax({url: "sys/resource/searchOnClick", method: "post", params});
    if (result.code == 200) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private setParamsForTree(node, expand: Boolean) {
    this.state.searchSource = "tree"
    this.state.searchParams.level = node.level
    if (node.level != 0) {
      if (node.level == 1) {
        this.state.searchParams.resourceTypeDictCode = node.data.id
        this.state.searchParams.subSysDictCode = null
        this.state.searchParams.parentId = null
        this.state.searchParams.name = null
      } else if (node.level == 2) {
        this.state.searchParams.resourceTypeDictCode = node.parent.data.id
        this.state.searchParams.subSysDictCode = node.data.id
        this.state.searchParams.parentId = null
        this.state.searchParams.name = null
      } else {
        this.state.searchParams.resourceTypeDictCode = this.getResourceTypeByNode(node)
        this.state.searchParams.subSysDictCode = this.getSubSysByNode(node)
        this.state.searchParams.parentId = node.data.id
        if (!expand) {
          this.state.searchParams.name = node.data.name
        }
      }
    }
  }

  private getResourceTypeByNode(node) {
    while (node.level != 1) {
      node = node.parent
    }
    return node.data.id
  }

  private getSubSysByNode(node) {
    while (node.level != 2) {
      node = node.parent
    }
    return node.data.id
  }

  private async searchByTree() {
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
    const result = await ajax({url: "sys/resource/searchByTree", method: "post", params})
    if (result.code == 200) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  protected convertThis() {
    super.convertThis()
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
  components: {ResourceAddEdit, ResourceDetail},
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
