<template>
  <el-dialog title="添加组织信息" v-model="visible" width="30%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="80px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name"/>
      </el-form-item>
      <el-form-item label="简称" prop="abbrName">
        <el-input v-model="formModel.abbrName"/>
      </el-form-item>
      <el-form-item label="组织类型" prop="orgTypeDictCode">
        <el-select v-model="formModel.orgTypeDictCode" placeholder="请选择组织类型" clearable>
          <el-option v-for="item in getDictItems('kuark:user', 'organization_type')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上级" prop="parent">
        <el-cascader ref="parentCascader" v-model="formModel.parent" :props="cascaderProps"/>
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
import {defineComponent, reactive, ref, toRefs} from "vue";
import {BaseAddEditPage} from "../../../base/BaseAddEditPage.ts";
import {ElMessage} from "element-plus";

class AddEditPage extends BaseAddEditPage {

  private parentCascader: any

  constructor(props, context, parentCascader) {
    super(props, context)
    this.parentCascader = parentCascader
    this.convertThis()
  }

  protected initState(): any {
    const _self = this
    return {
      formModel: {
        name: null,
        abbrName: null,
        orgTypeDictCode: null,
        seqNo: 0,
        parent: [],
        remark: null
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
      },
    }
  }

  protected getRootActionPath(): String {
    return "user/organization"
  }

  protected createSubmitParams(): any {
    const params = super.createSubmitParams()
    const nodes = this.parentCascader.value.getCheckedNodes()
    params.tenantId = this.getTenantId(nodes[0])
    params.parentId = this.getParentId(nodes[0])
    params.subSysDictCode = this.state.formModel.parent[0]
    return params
  }

  protected fillForm(rowObject: any) {
    super.fillForm(rowObject)
    const parents = [rowObject.subSysDictCode]
    if (rowObject.tenantId) {
      parents.push(rowObject.tenantId)
    }
    if (rowObject.parentId) {
      parents.push(rowObject.parentId)
    }
    this.state.formModel.parent = parents
  }

  public loadTreeNodes: (node, resolve) => void

  private async doLoadTreeNodes(node, resolve) {
    if (node.level === 0) {
      const dictItems = this.getDictItems("kuark:sys", "sub_sys")
      const subSyses = []
      for (let item of dictItems) {
        subSyses.push({id: item.first, name: item.second})
      }
      resolve(subSyses)
    } else {
      const params = {
        subSysDictCode: this.getSubSysDictCode(node),
        tenantId: this.getTenantId(node),
        parentId: this.getParentId(node),
        active: true
    }
      // @ts-ignore
      const result = await ajax({url: this.getRootActionPath() + "/lazyLoadTree", method: "post", params})
      if (result.data) {
        resolve(result.data)
      } else {
        ElMessage.error('组织机构树加载失败！')
      }
    }
  }

  private getSubSysDictCode(node): String {
    while (node.parent) {
      node = node.parent
    }
    return node.data.id
  }

  private getTenantId(node): String {
    while (node.parent) {
      if (node.data.organization === false) {
        return node.data.id
      }
      node = node.parent
    }
    return null
  }

  private getParentId(node): String {
    if (node.data.organization === false || node.parent == undefined) {
      return null
    }
    return node.data.id
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
  name: "~OrganizationAddEdit",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const parentCascader = ref()
    const page = reactive(new AddEditPage(props, context, parentCascader))
    return {
      ...toRefs(page),
      ...toRefs(page.state),
      parentCascader
    }
  }
})
</script>

<style lang='css' scoped>

</style>