<!--
 * 缓存新增/编辑
 *
 * @author: K
 * @since 1.0.0
 -->

<template>
  <el-dialog title="添加缓存信息" v-model="visible" width="33%" center @close="close">
    <el-form ref="form" :model="formModel" label-width="160px" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="缓存名称" prop="name" class="is-required">
        <el-col :span="8">
          <el-input v-model="formModel.name"/>
        </el-col>
        <el-col :span="16" v-if="props.rid">
          <span style="color: red">&nbsp;&nbsp;更改后仅当重启应用才生效！</span>
        </el-col>
      </el-form-item>
      <el-form-item label="子系统" prop="subSysDictCode" class="is-required">
        <el-select v-model="formModel.subSysDictCode" placeholder="请选择子系统" clearable>
          <el-option v-for="item in getDictItems('kuark:sys', 'sub_sys')"
                     :key="item.first" :value="item.first" :label="item.second"/>
        </el-select>
      </el-form-item>
      <el-form-item label="缓存策略" prop="strategyDictCode" class="is-required">
        <el-col :span="8">
          <el-select v-model="formModel.strategyDictCode" placeholder="请选择缓存策略" clearable>
            <el-option v-for="item in getDictItems('kuark:sys', 'cache_strategy')"
                       :key="item.first" :value="item.first" :label="item.second"/>
          </el-select>
        </el-col>
        <el-col :span="16" v-if="props.rid">
          <span style="color: red">&nbsp;&nbsp;更改后仅当重启应用才生效！</span>
        </el-col>
      </el-form-item>
      <el-form-item label="是否启动时写缓存" prop="writeOnBoot">
        <el-switch v-model="formModel.writeOnBoot" :active-value=true :inactive-value=false></el-switch>
      </el-form-item>
      <el-form-item label="是否及时回写缓存" prop="writeInTime">
        <el-switch v-model="formModel.writeInTime" :active-value=true :inactive-value=false></el-switch>
      </el-form-item>
      <el-form-item label="TTL(秒)" prop="ttl">
        <el-col :span="8">
          <el-input v-model="formModel.ttl"/>
        </el-col>
        <el-col :span="16" v-if="props.rid">
          <span style="color: red">&nbsp;&nbsp;更改后仅当重启应用且重载缓存才生效！</span>
        </el-col>
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
import {BaseAddEditPage} from "../../../base/page/BaseAddEditPage.ts";

class AddEditPage extends BaseAddEditPage {

  constructor(props, context, nameInput) {
    super(props, context)
  }

  protected initState(): any {
    return {
      formModel: {
        name: null,
        subSysDictCode: null,
        strategyDictCode: null,
        writeOnBoot: false,
        writeInTime: false,
        ttl: null,
        managementBeanName: null,
        remark: null
      },
    }
  }

  protected getRootActionPath(): String {
    return "sys/cache"
  }

}

export default defineComponent({
  name: "~CacheAddEdit",
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