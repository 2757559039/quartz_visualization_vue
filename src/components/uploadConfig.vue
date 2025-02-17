<template>
  <el-dialog
    v-model="isVisible"
    title="配置文件编辑器"
    @close="back"
    :before-close="back"
  >
    <div>
      <CodeEditor :modelValue="editorContent" language="json" @update:modelValue="onCodeChange" />
      <div class="buttonbox"> 
        <el-button type="primary" @click="update">上传配置</el-button>
        <el-button  @click="back" class="back-btn">返回</el-button>
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
      uploadConfigModal(){
        this.isVisible = true;
      }
    }
  };
  </script>
  
  <style>
  
  .buttonbox {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}
  
  .buttonbox .el-button {
  color: white !important;
  border: none !important;
  border-radius: 4px;
  font-size: 24px;
  width: 128px;
  height: 60px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 上传按钮保持原有蓝色渐变 */
.buttonbox .el-button {
  background: linear-gradient(to left, #35ccff, #0472b6) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px;
  font-size: 24px;
  width: 128px;
  height: 60px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.buttonbox .el-button:hover {
  background: linear-gradient(to right, #35ccff, #0472b6) !important;
}

/* 返回按钮新样式 */
.buttonbox .back-btn {
  background: linear-gradient(to left, #ffa940, #ffd591) !important;
}

.buttonbox .back-btn:hover {
  background: linear-gradient(to right, #ffa940, #ffd591) !important;
  box-shadow: 0 2px 8px rgba(255, 169, 64, 0.3);
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
  }.CodeMirror-hints{
    z-index: 10111;
  }


</style>