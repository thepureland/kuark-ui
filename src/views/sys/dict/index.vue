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
          <el-tree :props="dictTreeProps" :load="loadTree" :expand-on-click-node="false" @node-expand="expandTreeNode"
                   @node-click="(nodeData,node)=>clickTreeNode(nodeData,node)" accordion lazy/>
        </el-col>
        <el-col :span="22">
          <el-row :gutter="20" class="toolbar">
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.module" placeholder="所属模块" @change="handleSearch"
                               @select="handleSearch" :fetch-suggestions="filterModule" clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.dictType" placeholder="字典类型" @change="handleSearch"
                               @select="handleSearch" :fetch-suggestions="filterDictType" :trigger-on-focus="false"
                               clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.dictName" placeholder="字典名称" @change="handleSearch" clearable></el-input>
            </el-col>
            <el-col :span="2">
              <el-autocomplete v-model="searchParams.itemCode" placeholder="字典项编码" @change="handleSearch"
                               @select="handleSearch" :fetch-suggestions="filterDictItemCode" :trigger-on-focus="false"
                               clearable></el-autocomplete>
            </el-col>
            <el-col :span="2">
              <el-input v-model="searchParams.itemName" placeholder="字典项名称" @change="handleSearch" clearable></el-input>
            </el-col>

            <el-col :span="1">
              <el-checkbox v-model="searchParams.active" label="仅启用" class="el-input" checked></el-checkbox>
            </el-col>

            <el-col :span="1">
              <el-button type="primary" round @click="handleSearch">搜索</el-button>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" round @click="resetSearch">重置</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="success" @click="DialogVisible = true">添加</el-button>
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
                <el-button @click="handleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit"
                           v-if="scope.row.itemCode">编辑
                </el-button>
                <el-button @click="handleDelete(scope.row)" type="danger" size="mini" icon="el-icon-delete"
                           v-if="scope.row.itemCode">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="listPage.handleSizeChange" @current-change="listPage.handleCurrentChange"
                         :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>
        </el-col>
      </el-row>

      <add-dict v-model="DialogVisible" @response="response"></add-dict>
      <!--      <edit-dict v-if="editDialogVisible" v-model="editDialogVisible" @response="response" :rid="rid"></edit-dict>-->
    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs, unref, onMounted} from "vue";
import {ElMessageBox, ElMessage} from 'element-plus'
import addDict from './addDict.vue';
// import editDict from './editDict.vue';

import {BaseListPage} from "../../../base/BaseListPage.ts";

class ListPage extends BaseListPage {

  constructor() {
    super();
    this.handleSizeChange = (newSize: number) => { // 为了解决恶心的this问题
      this.state.pagination.pageSize = newSize
      if (this.state.searchMode == "button") {
        this.loadData()
      } else {
        listByTree(this.state)
      }
    }
    this.handleCurrentChange = (newCurrent: number) => { // 为了解决恶心的this问题
      if (newCurrent) {
        this.state.pagination.pageNo = newCurrent
        if (this.state.searchMode == "button") {
          this.loadData()
        } else {
          listByTree(this.state)
        }
      }
    }

  }

  protected getSearchParams() {
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

}

const listPage = new ListPage()


async function laodTreeNodes(state: any, node, resolve) {
  const params = {
    parentId: node.level === 0 ? null : (node.level === 1 ? node.data.code : node.data.id),
    firstLevel: node.level === 1,
    active: state.searchParams.active ? true : null
  }
  // @ts-ignore
  const result = await ajax({url: "sysDict/laodTreeNodes", method: "post", params});
  resolve(result.data)
}

function doResetSearch(state: any) {
  state.searchParams.module = null
  state.searchParams.dictType = null
  state.searchParams.dictName = null
  state.searchParams.itemCode = null
  state.searchParams.itemName = null
  state.pagination.pageNo = 1
}

async function listByTree(state: any) {
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

function treeOperation(state: any) {

  const loadTree = (node, resolve) => {
    laodTreeNodes(state, node, resolve)
  }

  const expandTreeNode = (nodeData, node) => {
    if (node.data) {
      doResetSearch(state)
      state.searchMode = "tree"
      state.searchParams.parentId = node.level === 1 ? node.data.code : node.data.id
      state.searchParams.firstLevel = node.level === 1
      listByTree(state)
    }
  }

  const clickTreeNode = async (nodeData, node) => {
    if (node.level === 1) {
      return
    }
    state.searchMode = "tree"
    doResetSearch(state)
    const params = {
      id: nodeData.id,
      isDict: node.level === 2
    }
    // @ts-ignore
    const result = await ajax({url: "sysDict/get", params});
    state.tableData = [result.data]
    state.pagination.total = 1
  }

  return {
    loadTree,
    clickTreeNode,
    expandTreeNode
  }

}

// function paginationChange() { //TODO 怎么用Typescript直接暴露handleSizeChange和handleCurrentChange给vue组件
//
//   const handleSizeChange = (newSize: number) => {
//     listPage.handleSizeChange(newSize)
//   }
//   const handleCurrentChange = (newCurrent: number) => {
//     listPage.handleSizeChange(newCurrent)
//   }
//
//   return {
//     handleSizeChange,
//     handleCurrentChange,
//   }
// }

function useSearch(state: any) {
  const handleSearch = async () => {
    state.searchMode = "button"
    listPage.loadData()
  }
  const handleSortChange = async (column) => {
    state.sort.orderProperty = column.prop
    state.sort.orderDirection = column.order == "ascending" ? "ASC" : "DESC"
    if (state.searchMode == "button") {
      listPage.loadData()
    } else {
      listByTree(state)
    }
  }
  const handleFilter = async (value, row, column) => {
    const property = column['property']
    return row[property] === value
  }
  const resetSearch = () => {
    doResetSearch(state)
  }
  return {
    handleSearch,
    handleSortChange,
    handleFilter,
    resetSearch,
  }
}

const loadModules = async (state: any) => {
  // @ts-ignore
  const result = await ajax({url: "sysDict/loadModules"})
  result.data.forEach((val) => {
    state.modules.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
  })
}
const loadDictTypes = async (state: any) => {
  // @ts-ignore
  const result = await ajax({url: "sysDict/loadDictTypes"})
  result.data.forEach((val) => {
    state.dictTypes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
  })
}
const loadDictItemCodes = async (state: any) => {
  // @ts-ignore
  const result = await ajax({url: "sysDictItem/loadDictItemCodes"})
  result.data.forEach((val) => {
    state.dictItemCodes.push({"value": val}) // el-autocomplete要求数据项一定要有value属性, 否则下拉列表出不来
  })
}

function filterSuggestions(state: any) {
  const filterModule = (queryString: string, cb) => {
    cb(queryString ? state.modules.filter(createFilter(queryString)) : state.modules)
  }
  const filterDictType = (queryString: string, cb) => {
    cb(queryString ? state.dictTypes.filter(createFilter(queryString)) : state.dictTypes)
  }
  const filterDictItemCode = (queryString: string, cb) => {
    cb(queryString ? state.dictItemCodes.filter(createFilter(queryString)) : state.dictItemCodes)
  }
  const createFilter = (queryString) => {
    return (item) => {
      return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }
  return {
    filterModule,
    filterDictType,
    filterDictItemCode
  }
}

function persistence(state: any) {
  const updateActive = async (row) => {
    const params = {
      searchPayload: {
        id: row.itemId
      },
      active: row.active
    }
    // @ts-ignore
    const result = await ajax({url: "sysDictItem/update", method: "put", params});

  }

  return {
    updateActive
  }

}



export default defineComponent({
  name: "~index",
  components: {addDict},
  setup(props, {emit, slots}) {
    let state = reactive(Object.assign(listPage.state, {
      searchMode: "",
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
      DialogVisible: false,
      editDialogVisible: false,
      rid: '',
      response() {
        // useSearch(state);
      },
      handleEdit(row: any) {
        state.editDialogVisible = true;
        state.rid = row.id
      },
      async handleDelete(row: any) {
        const confirmResult = await ElMessageBox.confirm('确定要删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return ElMessage.info('取消删除！');
        //@ts-ignore
        const {code} = await ajax({url: "user/delete", method: "delete", params: {id: row.id}});
        if (code === "ok") ElMessage.success('删除成功！');
        useSearch(state);
      }
    }));

    onMounted(() => {
      loadModules(state)
      loadDictTypes(state)
      loadDictItemCodes(state)
    });

    // state = state + listPage.getState()


    return {
      listPage,
      ...toRefs(state),
      // ...paginationChange(),
      ...useSearch(state),
      ...filterSuggestions(state),
      ...persistence(state),
      ...treeOperation(state)
    };

  }
})
;
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

/*.el-checkbox {*/
/*  margin-bottom: 0px;*/
/*}*/
</style>
