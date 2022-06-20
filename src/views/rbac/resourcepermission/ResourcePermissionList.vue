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

    <el-row :gutter="20" class="toolbar">
      <el-col :span="2">
        <el-cascader :options="subSysOrTenants" v-model="searchParams.subSysOrTenant"
                     :props="cascaderProps" placeholder="子系统/租户" class="border_red"/>
      </el-col>
      <el-col :span="2">
        <el-select v-model="searchParams.resourceTypeDictCode" placeholder="资源类型" clearable class="border_red">
          <el-option v-for="item in getDictItems('kuark:sys', 'resource_type')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-input v-model="searchParams.name" placeholder="资源名称" @change="search" clearable/>
      </el-col>

      <el-col :span="14">
        <el-button type="primary" round @click="search">搜索</el-button>
        <el-button type="primary" round @click="resetSearchFields">重置</el-button>
      </el-col>
    </el-row>

    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-scrollbar>
          <el-tree ref="tree" :props="resourceTreeProps" :data="menus"
                   :expand-on-click-node="false" node-key="id"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion/>
        </el-scrollbar>
      </el-aside>

      <el-main>
        <el-table border stripe :data="tableData" height="750" @selection-change="handleSelectionChange"
                  :header-cell-style="{textAlign: 'center'}" @sort-change="handleSortChange">
          <el-table-column type="index" width="50"/>
          <el-table-column label="资源名称" prop="name" sortable="custom"/>
          <el-table-column label="URL" prop="url" sortable="custom"/>
          <el-table-column label="关联的角色" prop="roleNames"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <edit @click="handleEdit(scope.row)" class="operate-column-icon"/>
              <tickets @click="handleDetail(scope.row)" class="operate-column-icon"/>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>


  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs, ref} from "vue"
import {ElMessage} from "element-plus"
import {Pair} from "../../../base/Pair.ts"
import {TenantSupportListPage} from "../../../base/page/TenantSupportListPage.ts";

class ListPage extends TenantSupportListPage {

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
        label: 'title'
      },
      searchParams: {
        parentId: null,
        subSysDictCode: null,
        resourceTypeDictCode: null,
        name: null,
        level: null
      },
      resourceTypes: [],
      searchSource: null,
      menus: []
    }
  }

  protected getRootActionPath(): String {
    return "rbac/resourcepermission"
  }

  protected createSearchParams() {
    const params = super.createSearchParams()
    params.parentId = this.state.searchSource == "button" ? null : this.state.searchParams.parentId
    return params
  }

  protected async doSearch(): Promise<void> {
    this.state.searchSource = "button"
    const subSysOrTenant = super.parseSubSysOrTenant()
    if (!this.state.searchParams.resourceTypeDictCode) {
      ElMessage.error('请先选择资源类型！')
      return null
    }
    if (subSysOrTenant) {
      await this.loadMenus(subSysOrTenant.first)
      await super.doSearch()
    }
  }

  protected doAfterEdit(params: any) {

  }

  protected doAfterDelete(ids: Array<any>) {
    super.doAfterDelete(ids)
    for (let id of ids) {
      this.tree.value.remove({"id": id})
    }
  }

  private async loadMenus(subSysDictCode) {
    const params = {
      subSysDictCode: subSysDictCode
    }
    // @ts-ignore
    const result = await ajax({url: "sys/resource/getSimpleMenus", params})
    if (result.code == 200) {
      this.state.menus = result.data
    } else {
      ElMessage.error('资源树加载失败！')
    }
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
    const result = await ajax({url: "rbac/resourcepermission/searchTree", method: "post", params})
    if (result.code == 200) {
      this.state.tableData = result.data.first
      this.state.pagination.total = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  protected isCheckStrictly(): boolean {
    return false
  }

  protected convertThis() {
    super.convertThis()
    this.clickTreeNode = (nodeData, node) => {
      this.doClickTreeNode(nodeData, node)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {},
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
