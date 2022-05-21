<!--
 * 菜单-角色关联对话框
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="设置菜单所属角色" v-model="visible" width="20%" center @close="close">
    <el-checkbox-group v-model="checkedRoles">
      <el-checkbox v-for="item in roles" :label="item.id" :key="item.id" style="display:block;">
        {{ item.roleName }}
      </el-checkbox>
    </el-checkbox-group>

    <el-row :gutter="20">
      <el-col :span="16"/>
      <el-col :span="4">
        <el-button type="primary" round @click="save">确定</el-button>
      </el-col>
      <el-col :span="4">
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

  constructor(props, context) {
    super(props, context)
    this.loadData()
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected initState(): any {
    return {
      roles: null,
      checkedRoles: []
    }
  }

  private async loadData() {
    const params = {
      resourceId: this.props.rid,
      subSysDictCode: this.props.subSysDictCode,
      tenantId: this.props.tenantId
    }
    const url = this.getRootActionPath() + "/getResourceRoles"
    // @ts-ignore
    const result = await ajax({url: url, method: "post", params})
    if (result.code == 200) {
      this.state.roles = result.data.first
      this.state.checkedRoles = result.data.second
    } else {
      ElMessage.error('数据加载失败！')
    }
  }

  public save: () => void

  private async doSave() {
    const params = {
      resourceId: this.props.rid,
      subSysDictCode: this.props.subSysDictCode,
      tenantId: this.props.tenantId,
      roleIds: this.state.checkedRoles
    }
    const url = this.getRootActionPath() + "/reassignRolesForResource"
    // @ts-ignore
    const result = await ajax({url: url, method: "post", params})
    if (result.code == 200) {
      ElMessage.info('授权成功！')
      this.close()
      this.context.emit('response')
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
  name: "~MenuRoleAssignDialog",
  props: {
    modelValue: Boolean,
    rid: String,
    subSysDictCode: String,
    tenantId: String
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