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
        :check-strictly="checkStrictly"
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
import {BasePage} from "../../../base/page/BasePage.ts";

class Page extends BasePage {

  public defaultProps: any
  public tree: any

  constructor(props, context) {
    super(props, context)
    this.tree = ref<InstanceType<typeof ElTree>>()
    this.defaultProps = {
      children: 'children',
      label: 'title',
    }
    this.loadData()
  }

  protected initBaseState(): any {
    return {
      rid: '',
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

  private async loadData() {
    const params = {
      roleId: this.props.rid
    }
    const url = this.getRootActionPath() + "/getMenuPermissions"
    // @ts-ignore
    const result = await ajax({url: url, params})
    if (result.code == 200) {
      this.state.menuData = result.data.first

      // 勾选已经为角色分配的菜单，这里注意几个问题：
      // 1. el-tree在check-strictly设置为false时，父子互相关联
      // 2. 在1的情况下，已勾选的项在回显时，如果父节点是选中的，将造成子节点全部选中
      // 3. 为解决2的问题，想通过在设置勾选项前把check-strictly先设置为true，勾选后再设置为false的做法，是行不通的，会报错
      // 4. 想通过树节点来判断是否为叶子节点，会发现找不到它已经渲染完的时间点，所以这里直接从候选数据判断
      const checkKeys = result.data.second // 要勾选的结点key（有包括非叶子结点的）
      let checkLeafKeys = [] // 要勾选的叶子结点key
      for (let data of this.state.menuData) {
        this.filterLeaf(data, checkLeafKeys, checkKeys)
      }
      this.state.defaultCheckedKeys = checkLeafKeys

      this.render()
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  private filterLeaf(nodeData, checkLeafKeys, checkKeys) {
    if (nodeData.children) {
      for(let childNode of nodeData.children) {
        this.filterLeaf(childNode, checkLeafKeys, checkKeys)
      }
    } else {
      if (checkKeys.indexOf(nodeData.id) != -1) {
        checkLeafKeys.push(nodeData.id)
      }
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
    if (result.code == 200) {
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