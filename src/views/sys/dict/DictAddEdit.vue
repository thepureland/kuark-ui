<template>
  <el-dialog title="添加字典信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="上级" prop="parent">
        <el-cascader v-model="formModel.parent" :props="cascaderProps"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="formModel.code"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="排序" prop="seqNo">
        <el-input-number v-model="formModel.seqNo" :min="1" :max="999999999"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.remark"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage} from 'element-plus';
import {BaseAddEditPage} from "../../../base/BaseAddEditPage.ts";

class AddEditPage extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.convertThis()
  }

  protected initState(): any {
    const _self = this
    return {
      formModel: {
        parent: null,
        code: null,
        name: null,
        seqNo: undefined,
        remark: null
      },
      cascaderProps: {
        lazy: true,
        value: "id",
        label: "code",
        multiple: false,
        checkStrictly: true,
        expandTrigger: "hover",
        lazyLoad(node, resolve) {
          _self.loadTreeNodes(node, resolve)
        },
      },
      parentCache: {}
    }
  }

  protected getRootActionPath(): String {
    return "sys/dict";
  }

  protected getRowObjectLoadUrl(): String {
    return this.getRootActionPath() + "/getDict"
  }

  protected createSubmitParams(): any {
    return {
      id: this.props.rid,
      isDict: this.props["isDict"],
      module: this.state.formModel.parent[0],
      parentId: this.state.formModel.parent.length === 1 ? null : this.state.formModel.parent[this.state.formModel.parent.length - 1],
      dictId: this.state.formModel.parent.length === 1 ? null : this.state.formModel.parent[1],
      dictType: this.state.formModel.parent.length === 1 ? null : this.state.parentCache[this.state.formModel.parent[1]],
      code: this.state.formModel.code,
      name: this.state.formModel.name,
      seqNo: this.state.formModel.seqNo,
      remark: this.state.formModel.remark
    }
  }

  protected doSubmit() {
    if (!this.state.formModel.parent || this.state.formModel.parent.length == 0) {
      return ElMessage.error('上级必须指定')
    }
    return super.doSubmit()
  }

  protected createRowObjectLoadParams(): any {
    const params = super.createRowObjectLoadParams()
    params["isDict"] = this.props["isDict"]
    params["fetchAllParentIds"] = true
    return params
  }

  protected fillForm(rowObject: any) {
    const isDict = this.props["isDict"]
    this.state.formModel.module = rowObject.module
    this.state.formModel.parentId = rowObject.parentId
    this.state.formModel.dictId = rowObject.dictId
    this.state.formModel.code = isDict ? rowObject.dictType : rowObject.itemCode
    this.state.formModel.name = isDict ? rowObject.dictName : rowObject.itemName
    this.state.formModel.seqNo = rowObject.seqNo
    this.state.formModel.remark = rowObject.remark
    const parents = [rowObject.module]
    if (!isDict) {
      const parentIds = rowObject.parentIds
      if (parentIds) {
        for(let parentId of parentIds) {
          parents.push(parentId)
        }
      }
    }
    this.state.formModel.parent = parents
  }

  public loadTreeNodes: (node, resolve) => void

  private async doLoadTreeNodes(node, resolve) {
    const params = {
      parentId: node.level === 0 ? null : (node.level === 1 ? node.data.code : node.data.id),
      firstLevel: node.level === 1,
      active: true
    }
    // @ts-ignore
    const result = await ajax({url: "sys/dict/loadTreeNodes", method: "post", params});
    if (result.data) {
      for (let item of result.data) {
        this.state.parentCache[item["id"]] = item["code"]
      }
      resolve(result.data)
    } else {
      ElMessage.error('字典树加载失败！')
    }
  }

  /**
   * 为了解决恶心的this问题，不要写任何业务逻辑代码
   */
  private convertThis() {
    this.loadTreeNodes = (node, resolve) => {
      this.doLoadTreeNodes(node, resolve)
    }
  }

}

export default defineComponent({
  name: "~DictAddEdit",
  props: {
    modelValue: Boolean,
    rid: String,
    isDict: Boolean
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new AddEditPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>