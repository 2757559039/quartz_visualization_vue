<template>
    <div>
      <CodeEditor :modelValue="editorContent" language="java" @update:modelValue="onCodeChange" />
      <div class="buttonbox"> 
        <el-button type="primary" @click="update">上传类</el-button>
        <el-button  @click="back">返回</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import CodeEditor from './CodeEditor.vue';
  
  export default {
    components: {
      CodeEditor,
    },
    data() {
      return {
        editorContent: ''
      };
    },
    methods: {
      onCodeChange(newVal) {
        console.log('Updated code:', newVal);
        this.editorContent = newVal;
      },
      back(){
        this.$emit('close');
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
  </style>