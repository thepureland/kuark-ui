<template>
  <el-dialog title="添加数据源信息" v-model="visible" width="25%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="140px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="名称" prop="name" class="is-required">
        <el-col :span="10">
          <el-input v-model="formModel.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="子系统/租户" prop="subSysDictCode" class="is-required">
        <el-col :span="10">
          <el-cascader :options="subSysOrTenants" v-model="formModel.subSysOrTenant"
                       :props="cascaderProps" placeholder="请选择子系统/租户"/>
        </el-col>
      </el-form-item>
      <el-form-item label="URL" prop="url" class="is-required">
        <el-col :span="10">
          <el-input v-model="formModel.url"/>
        </el-col>
      </el-form-item>
      <el-form-item label="用户名" prop="username" class="is-required">
        <el-col :span="10">
          <el-input v-model="formModel.username"/>
        </el-col>
      </el-form-item>
      <el-form-item label="初始连接数" prop="initialSize">
        <el-input-number v-model="formModel.initialSize"/>
      </el-form-item>
      <el-form-item label="最大连接数" prop="maxActive">
        <el-input-number v-model="formModel.maxActive"/>
      </el-form-item>
      <el-form-item label="最大空闲连接数" prop="maxIdle">
        <el-input-number v-model="formModel.maxIdle"/>
      </el-form-item>
      <el-form-item label="最小空闲连接数" prop="minIdle">
        <el-input-number v-model="formModel.minIdle"/>
      </el-form-item>
      <el-form-item label="出借最长期限(毫秒)" prop="maxWait">
        <el-input-number v-model="formModel.maxWait"/>
      </el-form-item>
      <el-form-item label="连接寿命(毫秒)" prop="maxAge">
        <el-input-number v-model="formModel.maxAge"/>
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
import {TenantSupportAddEditPage} from "../../../base/page/TenantSupportAddEditPage.ts";

class AddEditPage extends TenantSupportAddEditPage {

  constructor(props, context) {
    super(props, context)
  }

  protected initState(): any {
    return {
      formModel: {
        name: null,
        url: null,
        username: null,
        initialSize: undefined,
        maxActive: undefined,
        maxIdle: undefined,
        minIdle: undefined,
        maxWait: undefined,
        maxAge: undefined,
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "sys/dataSource"
  }

}

export default defineComponent({
  name: "~DataSourceAddEdit",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const page = reactive(new AddEditPage(props, context))
    return {
      ...toRefs(page),
      ...toRefs(page.state),
    }
  }
})
</script>

<style lang='css' scoped>

</style>