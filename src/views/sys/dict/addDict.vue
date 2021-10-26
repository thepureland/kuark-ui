<template>
  <el-dialog title="添加字典信息" v-model="bool" width="30%" center @close="closeDialog">
    <el-form ref="FORM" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="上级" prop="parent">
        <el-cascader ref="cascader" v-model="form.parent" :props="cascaderProps" @change="clickTreeNode"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="排序" prop="seqNo">
        <el-input-number v-model="form.seqNo" :min="1" :max="2147483647"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
import {defineComponent, reactive, toRefs, ref, computed} from "vue";
import {ElMessage} from 'element-plus';

function useAdd({form}, FORM, cascader, emit) {
  const submit = () => {
    FORM.value.validate(async valid => {
      if (!valid) return ElMessage.error('验证未通过');
      const params = {
        module: form.parent[0],
        parent: form.parent.length === 1 ? null : form.parent[form.parent.length - 1],
        code: form.code,
        name: form.name,
        seqNo: form.seqNo,
        remark: form.remark
      };
      // @ts-ignore
      const result = await ajax({url: "sysDict/add", method: "post", params})
      FORM.value.resetFields();

      emit('response');
      emit('update:modelValue', false);
    });

  };

  return {submit}
}

async function laodTreeNodes(state: any, node, resolve) {
  const params = {
    parentId: node.level === 0 ? null : (node.level === 1 ? node.data.code : node.data.id),
    firstLevel: node.level === 1,
    active: true
  }
  // @ts-ignore
  const result = await ajax({url: "sysDict/laodTreeNodes", method: "post", params});
  // if (node.level === 2) {
  //   result.data.forEach((val) => {
  //     val.leaf = false
  //   })
  // }
  resolve(result.data)
}

function treeOperation(state: any) {

  const loadTree = (node, resolve) => {
    laodTreeNodes(state, node, resolve)
  }

  const expandTreeNode = (nodeData, node) => {
    console.info(nodeData)
  }

  const clickTreeNode = async (nodeData, node) => {
    ++state.isResouceShow
    // node.cascader.computePresentText()
  }

  return {
    loadTree,
    clickTreeNode,
    expandTreeNode
  }

}


export default defineComponent({
  name: "~addDict",
  // components: { QuillEditor, },
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue', "response"],
  setup(props, {emit, slots, attr}) {
    const state = reactive({
      isResouceShow: 1,
      cascaderProps: {
        lazy: true,
        label: "code",
        value: "id",
        multiple: false,
        checkStrictly: true,
        expandTrigger: "hover",
        lazyLoad(node, resolve) {
          laodTreeNodes(state, node, resolve)
        },
      }
    })
    const FORM = ref();
    const cascader = ref()
    const bool = computed(() => props.modelValue);
    const Dialog = reactive({
      form: {
        parent: "",
        code: "",
        name: "",
        seqNo: undefined,
        remark: ""
      },
      rules: {
        parent: [{required: true, trigger: 'blur', message: '请选择上级'}],
        code: [{required: true, trigger: 'commit', message: '请输入编码'}],
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
      },
      upload: {},
      closeDialog() {
        Dialog.upload.imageUrl = '';
        emit('update:modelValue', !bool);
      }
    });
    return {
      FORM,
      cascader,
      bool,
      ...toRefs(state),
      ...toRefs(Dialog),
      ...useAdd(Dialog, FORM, cascader, emit),
      ...treeOperation(state),
    };
  }
});
</script>

<style lang='css' scoped>

</style>