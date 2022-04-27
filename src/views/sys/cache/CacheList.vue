<!--
 * 缓存列表
 *
 * @author: K
 * @since 1.0.0
 -->


<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>缓存列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="2">
          <el-input v-model="searchParams.name" placeholder="缓存名称" @change="search" clearable/>
        </el-col>
        <el-col :span="2">
          <el-select v-model="searchParams.subSysDictCode" placeholder="子系统" clearable>
            <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                       :key="item.first" :value="item.first" :label="item.second"/>
          </el-select>
        </el-col>

        <el-col :span="15">
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
        <el-table-column label="缓存名称" prop="name" sortable="custom" width="350"/>
        <el-table-column label="子系统" prop="subSysDictCode" width="150">
          <template #default="scope">
            {{ transDict("kuark:sys", "sub_sys", scope.row.subSysDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="缓存策略" prop="strategyDictCode" width="150">
          <template #default="scope">
            {{ transDict("kuark:sys", "cache_strategy", scope.row.strategyDictCode) }}
          </template>
        </el-table-column>
        <el-table-column label="启动时写缓存" prop="writeOnBoot" width="150">
          <template #default="scope">
            {{ scope.row.writeOnBoot ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="及时回写缓存" prop="writeInTime" width="150">
          <template #default="scope">
            {{ scope.row.writeInTime ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="TTL(秒)" prop="ttl" width="100"/>
        <el-table-column label="备注" prop="remark"/>
        <el-table-column label="启用" width="80">
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
            <el-dropdown split-button size="small" type="primary" @command="operateCache">
              管理
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="commandValue(1,scope.row)">重载</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(2,scope.row)">重载所有</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(3,scope.row)">踢除</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(4,scope.row)">清除所有</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(5,scope.row)">检测key是否存在</el-dropdown-item>
                  <el-dropdown-item :command="commandValue(6,scope.row)">获取value情况</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.pageNo" :page-size="pagination.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"/>

      <el-dialog v-model="keyDialogVisible" title="请输入缓存key" width="20%">
        <el-input v-model="cacheKey"/>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="keyDialogVisible = false; cacheKey = null">取消</el-button>
            <el-button type="primary" @click="commitCacheOperation(cacheKey)">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <cache-add-edit v-if="addDialogVisible" v-model="addDialogVisible" @response="afterAdd"/>
      <cache-add-edit v-if="editDialogVisible" v-model="editDialogVisible" @response="afterEdit" :rid="rid"/>
      <cache-detail v-if="detailDialogVisible" v-model="detailDialogVisible" :rid="rid"/>

    </el-card>
  </div>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue";
import CacheAddEdit from './CacheAddEdit.vue';
import CacheDetail from './CacheDetail.vue';
import {BaseListPage} from "../../../base/page/BaseListPage.ts";
import {Pair} from "../../../base/Pair.ts";
import {ElMessage} from "element-plus";

class ListPage extends BaseListPage {

  public commandValue: any

  constructor(props, context) {
    super(props, context)
    this.commandValue = (item, row) => {
      return {
        item: item,
        row: row
      }
    }
    this.loadDicts([
      new Pair("kuark:sys", "sub_sys"),
      new Pair("kuark:sys", "cache_strategy")
    ])
  }

  protected initState(): any {
    return {
      searchParams: {
        name: null,
        subSysDictCode: null
      },
      keyDialogVisible: false,
      cacheKey: null,
      cacheOperation: null,
      currentRow: null
    }
  }

  protected getRootActionPath(): String {
    return "sys/cache"
  }

  public commandValue: (item, row) => any

  public operateCache: (commandValue) => void

  private doOperateCache(commandValue) {
    const {item, row} = commandValue
    if (item == 1) {
      this.reload(row)
    } else if (item == 2) {
      this.reloadAll(row)
    } else if (item == 3) {
      this.evict(row)
    } else if (item == 4) {
      this.clear(row)
    } else if (item == 5) {
      this.isExists(row)
    } else if (item == 6) {
      this.valueInfo(row)
    }
  }

  public commitCacheOperation: (key) => any

  private async doCommitCacheOperation(key) {
    this.state.keyDialogVisible = false
    const row = this.state.currentRow
    const operation = this.state.cacheOperation
    const params = {
      cacheName: row.name,
    }
    if (operation != "reloadAll" && operation != "clear") {
      params["key"] = key
    }
    const url = "sys/cache/management/" + operation

    // @ts-ignore
    const result = await ajax({url: url, params})
    if (result.code == 200) {
      ElMessage.info(result.data)
    } else {
      ElMessage.error('请求操作失败！')
    }
  }

  private reload(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "reload"
    this.state.keyDialogVisible = true
  }

  private reloadAll(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "reloadAll"
    this.commitCacheOperation(null)
  }

  private evict(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "evict"
    this.state.keyDialogVisible = true
  }

  private clear(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "clear"
    this.commitCacheOperation(null)
  }

  private isExists(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "isExists"
    this.state.keyDialogVisible = true
  }

  private valueInfo(row) {
    this.state.currentRow = row
    this.state.cacheOperation = "valueInfo"
    this.state.keyDialogVisible = true
  }

  protected async doUpdateActive(row: any): Promise<void> {
    ElMessage.info("更改启用状态仅在重启应用后才生效！")
    await super.doUpdateActive(row)
  }

  protected convertThis() {
    super.convertThis()
    this.operateCache = (commandValue) => {
      this.doOperateCache(commandValue)
    }
    this.commitCacheOperation = (key) => {
      this.doCommitCacheOperation(key)
    }
  }

}

export default defineComponent({
  name: "~index",
  components: {CacheAddEdit, CacheDetail},
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
