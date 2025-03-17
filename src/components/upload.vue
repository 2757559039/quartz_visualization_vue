<template>
  <!-- 虚拟管理平台  文件编写-->
  <el-dialog
    v-model="isVisible"
    title="类编辑器"
    @close="back"
    :before-close="back"
  >
    <div>
      <!-- 代码编辑器导入 -->
      <CodeEditor v-if="killbug !== '0'" :modelValue="editorContent" language="java" @update:modelValue="onCodeChange"  class="bjnr"/>
      <!-- 底部按钮 -->
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
  import { mapState } from 'vuex';
  import { ElMessage, ElMessageBox } from 'element-plus';
  
  export default {
    components: {
      CodeEditor,
    },
    props: {
      row: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        editorContent: '',
        isVisible: false,
        killbug:'0',
        id:'0',
      };
    },
    computed: {
    ...mapState(['baseURL']),
  },
    methods: {
      //数据接收
      onCodeChange(newVal) {
        this.editorContent = newVal;
      },

      //关闭弹窗
      back(){
        this.isVisible = false;
        this.$emit('close');
      },

      //弹窗展示
      uploadModal(row){
        this.isVisible = true;
        setTimeout(() => {
          this.killbug = '1';
        }, 1);
        this.id=row.id;
        this.editorContent=row.script;
      },

      //更新文件
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

      //上传文件
      handleUpload() {
        axios.post(this.baseURL + '/scriptBuilder/updateScript', {
          id: this.id,
          script: this.editorContent,
        })
        .then(response => {
          if (response.data.code === '200') {
            ElMessage({
              message: `代码更新成功`,
              type: 'success',
            });
            this.editorContent = ''; // 清空输入框
            this.back(); // 关闭弹窗
            this.$emit('update-success'); // 触发自定义事件，通知父组件更新数据
          } else {
            ElMessage({
              message: '代码更新失败',
              type: 'error',
            });
          }
        })
        .catch(error => {
          console.error('代码更新失败:', error);
          ElMessage({
            message: '代码更新失败',
            type: 'error',
          });
        });
      },
    },
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

.CodeMirror-hints{
    z-index: 10111;
  } 

  .bjnr{
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-top:20px;
  }
</style>