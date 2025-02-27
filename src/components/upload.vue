<template>
  <el-dialog
    v-model="isVisible"
    title="类编辑器"
    @close="back"
    :before-close="back"
  >
    <div>
      <CodeEditor :modelValue="editorContent" language="java" @update:modelValue="onCodeChange" />
      <div class="buttonbox"> 
        <el-button type="primary" @click="confirmUpload">更新</el-button>
        <el-button  @click="back" class="back-btn">返回</el-button>
      </div>
    </div>
  </el-dialog>
  </template>
  
  <script>
  import CodeEditor from './CodeEditor.vue';
  import axios from 'axios';
  import { ElMessage, ElMessageBox } from 'element-plus';
  
  export default {
    components: {
      CodeEditor,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
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
      },
      confirmUpload() {
        ElMessageBox.confirm(
          `确定要更新吗？`,
          '确认更新',
          {
            confirmButtonText: '更新',
            cancelButtonText: '取消',
          },
        )
          .then(() => {
            this.handleUpload();
          })
          .catch(() => {
            // 取消上传
          });
      },
      // handleUpload() {
      //   // 根据 uploadType 确定接口地址
      //   // const urlMap = {
      //   //   job: '/scriptBuilder/saveJobToDB',
      //   //   trigger: '/scriptBuilder/saveTriggerToDB',
      //   //   jobDetail: '/scriptBuilder/saveJobDetailToDB',
      //   //   updateTrigger: '/scriptBuilder/saveUpdateTriggerToDB',
      //   // };

      //   // const url = urlMap[this.uploadType];
      //   // if (!url) {
      //   //   ElMessage.error('未知的上传类型');
      //   //   return;
      //   // }

      //   axios.post('/scriptBuilder/updateScript', {
      //     script: this.editorContent,
      //   })
      //   .then(response => {
      //     if (response.data.code === '200') {
      //       ElMessage({
      //         message: `${this.uploadType}代码更新成功`,
      //         type: 'success',
      //       });
      //       this.editorContent = ''; // 清空输入框
      //       this.back(); // 关闭弹窗
      //     } else {
      //       ElMessage({
      //         message: '代码更新失败',
      //         type: 'error',
      //       });
      //     }
      //   })
      //   .catch(error => {
      //     console.error('代码更新失败:', error);
      //     ElMessage({
      //       message: '代码更新失败',
      //       type: 'error',
      //     });
      //   });
      // },
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
  /* .el-dialog .CodeMirror-gutters {
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
  } */


</style>