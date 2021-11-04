
<template>
  <el-dialog title="修改用户" v-model="bool" width="35%" center @close="closeDialog">
    <el-form :model="form" :rules="rules" ref="FORM" label-width="70px" status-icon>
      <el-form-item label="用户名" prop="username"><el-input type="text" v-model="form.username"></el-input></el-form-item>
      <el-form-item label="密码" prop="password"><el-input type="password" v-model="form.password"></el-input></el-form-item>
      <el-form-item label="邮箱" prop="mail"><el-input type="email" v-model="form.mail"></el-input></el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button type="danger" @click="closeDialog">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
  import { defineComponent, reactive, toRefs, computed, ref, Ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus';
  function userCheckMail() {
    const checkMail = (rule: any, value: any, cb: any) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) return cb();
      cb(new Error("请输入合法邮箱！"))
    }
    return { checkMail }
  }
  async function useLoadData(state: any, props: any) {
    // @ts-ignore
    const data = await ajax({url: 'users/get', params: {userid: props.rid}})
    state.form = Object.assign({userId: props.rid}, data)
  }
  function useEdit(state: any, ref: any, emit: any) {
    const submit = () => {
      ref.value.validate(async (valid: any) => {
        if (!valid) return ElMessage.error('验证未通过');
        // @ts-ignore
        const {} = await ajax({url: 'users/edit', method: "post", params: ref.value.model})
        ref.value.resetFields();
        emit('response');
        emit("update:modelValue", false);
      })
    }
    return { submit }
  }
  export default defineComponent({
    name: '~addUser',
    props: {
      modelValue: Boolean,
      rid: Number
    },
    setup(props, {emit, slots}) {
      const bool = computed(() => props.modelValue);
      const FORM = ref();
      const state = reactive({
        form: { userId: props.rid, username: '', password: '', mail: "" },
        rules: { username: [{ required: true, message: '请输入用户名', trigger: 'blur'}, {min: 3, max: 10, message: 'min is 3, max is 10!', trigger: 'blur'}], password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 10, message: "min is 6, max is 10", trigger: "blur" }], mail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: userCheckMail().checkMail, trigger: 'blur'}] },
        closeDialog() {
          FORM.value.resetFields();
          emit('response');
          emit("update:modelValue", false);
        }
      });

      onMounted(() => {
        useLoadData(state, props)
      })

     return {
        ...toRefs(state),
        bool,
        FORM,
        ...useEdit(state, FORM, emit)
      }
     }
  })

</script>

<style lang='css' scoped>

</style>
