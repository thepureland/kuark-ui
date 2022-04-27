<!--
 * 字典详情
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="字典信息详情" v-model="visible" width="44%" center @close="close">
    <el-row :gutter="10">
      <el-col :span="3">字典ID：</el-col>
      <el-col :span="9">{{detail.id}}</el-col>
      <el-col :span="3">字典类型：</el-col>
      <el-col :span="9">{{detail.dictType}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">字典名：</el-col>
      <el-col :span="9">{{detail.dictName}}</el-col>
      <el-col :span="3">模块：</el-col>
      <el-col :span="9">{{transDict("kuark:sys", "module", detail.module)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">创建时间：</el-col>
      <el-col :span="9">{{formatDate(detail.createTime)}}</el-col>
      <el-col :span="3">最近更新时间：</el-col>
      <el-col :span="9">{{formatDate(detail.updateTime)}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">创建用户：</el-col>
      <el-col :span="9">{{detail.createUser}}</el-col>
      <el-col :span="3">最近更新用户：</el-col>
      <el-col :span="9">{{detail.updateUser}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">是否内置：</el-col>
      <el-col :span="9">{{detail.builtIn ? '是' : '否'}}</el-col>
      <el-col :span="3">备注：</el-col>
      <el-col :span="9">{{detail.remark}}</el-col>
    </el-row>

    <el-table border stripe :data="tableData" height="500" wigth="1000" :header-cell-style="{textAlign: 'center'}">
      <el-table-column type="index" width="50"/>
      <el-table-column label="字典项编码" prop="itemCode" width="150"/>
      <el-table-column label="字典项名称" prop="itemName" width="150"/>
      <el-table-column label="顺序" prop="seqNo" width="50"/>
      <el-table-column label="启用" prop="active" width="50">
        <template #default="scope">
          {{ formatBool(scope.row.active) }}
        </template>
      </el-table-column>
      <el-table-column label="内置" prop="builtIn" width="50">
        <template #default="scope">
          {{ formatBool(scope.row.builtIn) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="155">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" width="155">
        <template #default="scope">
          {{ formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="创建用户" prop="createUser" width="150"/>
      <el-table-column label="更新用户" prop="updateUser" width="150"/>
      <el-table-column label="字典项ID" prop="id" width="290"/>
      <el-table-column label="父项ID" prop="parentId" width="290"/>
      <el-table-column label="备注" prop="remark" width="300"/>
    </el-table>

  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseDetailPage} from "../../../base/page/BaseDetailPage.ts"
import {ElMessage} from "element-plus";

class DetailPage extends BaseDetailPage {

  constructor(props, context) {
    super(props, context)
  }

  protected initState(): any {
    return {
      tableData: []
    }
  }

  protected async preLoad(): Promise<void> {
    await this.loadDict("kuark:sys", "module")
  }

  protected getRootActionPath(): String {
    return "sys/dict"
  }

  protected async loadOthers(): Promise<void> {
    const params = {
      dictId: this.props.rid
    }
    // @ts-ignore
    const result = await ajax({url: "sys/dictItem/getDictItemsByDictId", params});
    if (result.code == 200) {
      this.state.tableData = result.data
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

}

export default defineComponent({
  name: "~DictDetail",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const page = reactive(new DetailPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col-3 {
  text-align: right;
  font-weight: bold;
}
</style>