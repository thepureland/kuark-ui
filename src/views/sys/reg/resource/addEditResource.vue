<template>
  <el-dialog title="添加资源信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="上级" prop="parent">
        <el-cascader v-model="formModel.parent" :props="cascaderProps"/>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="formModel.url"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon`">
        <el-input v-model="formModel.icon"/>
      </el-form-item>
      <el-form-item label="排序" prop="seqNo">
        <el-input-number v-model="formModel.seqNo"/>
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
import {defineComponent, reactive, toRefs} from "vue";
import {ElMessage} from 'element-plus';
import {BaseAddEditPage} from "../../../../base/BaseAddEditPage.ts";

class Page extends BaseAddEditPage {

  constructor(props, context) {
    super(props, context)
    this.convertThis()
  }

  protected initState(): any {
    const _self = this
    return {
      formModel: {
        parent: [],
        name: null,
        url: null,
        icon: null,
        seqNo: undefined,
        remark:null
      },
      cascaderProps: {
        lazy: true,
        value: "id",
        label: "name",
        multiple: false,
        checkStrictly: true,
        expandTrigger: "hover",
        lazyLoad(node, resolve) {
          _self.loadTreeNodes(node, resolve)
        },
      }
    }
  }

  protected getRootActionPath(): String {
    return "regResource"
  }

  protected createSubmitParams(): any {
    const length = this.state.formModel.parent.length
    return {
      id: this.props.rid,
      parentId: length == 1 || length == 2 ? null : this.state.formModel.parent[length - 1],
      resourceTypeDictCode: this.state.formModel.parent[0],
      subSysDictCode: this.state.formModel.parent[1],
      name: this.state.formModel.name,
      url: this.state.formModel.url,
      icon: this.state.formModel.icon,
      seqNo: this.state.formModel.seqNo,
      remark: this.state.formModel.remark
    }
  }

  protected doSubmit() {
    const length = this.state.formModel.parent.length
    if (!length || length == 0) {
      return ElMessage.error('上级中的资源类型必须指定！')
    } else if(length == 1) {
      return ElMessage.error('上级中的子系统必须指定！')
    }
    return super.doSubmit()
  }

  protected createRowObjectLoadParams(): any {
    const params = super.createRowObjectLoadParams()
    params["fetchAllParentIds"] = true
    return params
  }

  protected fillForm(rowObject: any) {
    this.state.formModel.name = rowObject.name
    this.state.formModel.url = rowObject.url
    this.state.formModel.icon = rowObject.icon
    this.state.formModel.seqNo = rowObject.seqNo
    this.state.formModel.remark = rowObject.remark
    this.state.formModel.parent = rowObject.parentIds
  }

  public loadTreeNodes: (node, resolve) => void

  private async doLoadTreeNodes(node, resolve) {
    const params = {
      level: node.level,
      parentId: node.level <= 2 ? null : node.data.id,
      active: true
    }
    // @ts-ignore
    const result = await ajax({url: "regResource/loadTreeNodes", method: "post", params})
    if (result.data) {
      resolve(result.data)
    } else {
      ElMessage.error('资源树加载失败！')
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
  name: "~addEditResource",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new Page(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>