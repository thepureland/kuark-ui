<template>
  <el-dialog title="关联用户" v-model="visible" width="25%" center @close="close">
    <el-transfer
        v-model="assignedUsers"
        style="text-align: left; display: inline-block"
        filterable
        :titles="['未关联的用户', '已关联的用户']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="candidateUsers">
      <template #default="{ option }">
        <span>{{ option.label }}</span>
      </template>
    </el-transfer>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs} from "vue"
import {BaseDetailPage} from "../../../base/page/BaseDetailPage.ts"
import {ElMessage} from "element-plus";

class UserAssignmentDialog extends BaseDetailPage {

  constructor(props, context) {
    super(props, context)
  }

  protected getRootActionPath(): String {
    return "rbac/role"
  }

  protected initState(): any {
    return {
      candidateUsers: [],
      assignedUsers: []
    }
  }

  protected getDetailLoadUrl(): String {
    return this.getRootActionPath() + "/getUserAssignment"
  }

  protected createDetailLoadParams(): any {
    return {
      roleId: this.props.rid,
      subSysDictCode: this.props.subSysDictCode,
      tenantId: this.props.tenantId
    }
  }

  protected postLoadDataSuccessfully(data) {
    for (const elem of data) {
      const user = {key: elem.userId, label: elem.username}
      this.state.candidateUsers.push(user)
      if (elem.assigned) {
        this.state.assignedUsers.push(elem.userId)
      }
    }
    super.postLoadDataSuccessfully(data)
  }

  public handleChange() {

  }

  public submit: () => void

  protected async doSubmit() {
    const params = {
      roleId: this.props.rid,
      userIds: this.state.assignedUsers
    }
    // @ts-ignore
    const result = await ajax({url: this.getRootActionPath() + "/assignUser", method: "post", params})
    if (result.code == 200) {
      ElMessage.success('保存成功！')
      this.context.emit('update:modelValue', false)
    } else {
      ElMessage.error('保存失败！')
    }
  }

  protected convertThis() {
    super.convertThis()
    this.submit = () => {
      this.doSubmit()
    }
  }

}


export default defineComponent({
  name: "~UserAssignmentDialog",
  props: {
    modelValue: Boolean,
    rid: String,
    subSysDictCode: String,
    tenantId: String
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const dialog = reactive(new UserAssignmentDialog(props, context))
    return {
      ...toRefs(dialog),
      ...toRefs(dialog.state)
    }
  }
})
</script>

<style lang='css' scoped>

</style>