<!--
 * 为角色授权菜单
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="菜单授权" v-model="visible" width="30%" center @close="close">
    <el-tree
        ref="tree"
        :data="menuData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
    />

    <el-row :gutter="20">
      <el-col :span="18"/>
      <el-col :span="3">
        <el-button type="primary" round @click="save">确定</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" round @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, ref, toRefs} from "vue"
import {ElMessage, ElTree} from "element-plus";
import {BaseDetailPage} from "../../../base/page/BaseDetailPage.ts";

class Page extends BaseDetailPage {

  public defaultProps: any
  public tree: any

  constructor(props, context) {
    super(props, context)
    this.tree = ref<InstanceType<typeof ElTree>>()
    this.defaultProps = {
      children: 'subs',
      label: 'title',
    }
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected initState(): any {
    return {
      menuData: [],
      defaultCheckedKeys: [],
    }
  }

  protected async loadData() {
    const params = {
      roleId: this.props.rid
    }
    const url = this.getRootActionPath() + "/getMenuPermissions"
    // @ts-ignore
    const result = await ajax({url: url, params})
    if (result.data) {
      this.state.menuData = result.data.first
      this.state.defaultCheckedKeys = result.data.second
      this.state.visible = true
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  public save: () => void

  private async doSave() {
    const params = {
      roleId: this.props.rid,
      resourceIds: this.tree.value!.getCheckedKeys(false)
    }
    const url = this.getRootActionPath() + "/setRolePermissions"
    // @ts-ignore
    const result = await ajax({url: url, method: 'post', params})
    if (result.data) {
      ElMessage.info('授权成功！')
      this.close()
    } else {
      ElMessage.info('授权失败！')
    }
  }

  protected convertThis() {
    super.convertThis()
    this.save = () => {
      this.doSave()
    }
  }

}

export default defineComponent({
  name: "~MenuAuthorization",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue'],
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