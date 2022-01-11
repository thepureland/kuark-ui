<template>
  <el-dialog title="流程设计" v-model="visible" width="30%" center>
    <iframe src="/static/editor-app/modeler.html?modelId={{rid}}" scrolling="no" style="width: 100%;height: 500px;" frameborder="0"></iframe>
  </el-dialog>
</template>

<script lang='ts'>

import {computed, defineComponent, reactive, toRefs} from "vue";
import axios from "axios";

export default defineComponent({
  name: "~flowDesign",
  props: {
    modelValue: Boolean,
    rid: String
  },
  emits: ['update:modelValue', "response"],
  setup(props, context) {
    const baseUrl = axios.defaults.baseURL
    const rid = props.rid
    const visible = computed({
      get: () => props.modelValue,
      set: () => {
      }
    })
    return {
      rid,
      visible,
      baseUrl
    }
  }
})

</script>

<style lang='css' scoped>

</style>