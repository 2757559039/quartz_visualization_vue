<template>
  <el-dialog
    v-model="isVisible"
    title="代码编辑器"
    @close="back"
    :before-close="back"
  >
    <div>
      <CodeEditor :modelValue="editorContent" language="java" @update:modelValue="onCodeChange" />
      <div class="buttonbox"> 
        <el-button type="primary" @click="update">上传类</el-button>
        <el-button  @click="back">返回</el-button>
      </div>
    </div>
  </el-dialog>
  </template>
  
  <script>
  import CodeEditor from './CodeEditor.vue';
  
  export default {
    components: {
      CodeEditor,
    },
    data() {
      return {
        editorContent: '',
        isVisible: false,
      };
    },
    methods: {
      onCodeChange(newVal) {
        console.log('Updated code:', newVal);
        this.editorContent = newVal;
      },
      back(){
        this.isVisible = false;
        this.$emit('close');
      },
      uploadModal(){
        this.isVisible = true;
      }
    }
  };
  </script>
  
  <style>
  
  .buttonbox{
    margin-top: 20px;
    gap: 20px;
    text-align: center;
  }
  
  .buttonbox button{
    font-size: 24px;
    width: 128px;
    height: 60px;
  }
  /* 全局修正对话框行号对齐问题 */
.el-dialog .CodeMirror-gutters {
  left: 0 !important;
  z-index: 1;
  width: 30px;
}

.el-dialog .CodeMirror-lines {
  padding-left: 30px !important;
}
.CodeMirror-gutter-elt{
  left:-30px !important;
}
  </style>