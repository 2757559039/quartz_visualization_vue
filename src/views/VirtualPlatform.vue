<template>
    <div class="main-container">
      <!-- 顶部标签页 -->
      <el-tabs
        v-model="activeTab"
        class="custom-tabs"
        stretch
        @tab-click="handleTabClick"
      >
        <el-tab-pane name="已安装">
          <template #label>
            <span>已安装</span>
          </template>
          <!-- 已安装类的内容 -->
          <div class="content">
            <InstalledList :showTable="activeTab === '已安装'" />
          </div>
        </el-tab-pane>
  
        <el-tab-pane label="未安装" name="未安装">
          <template #label>
            <span>未安装</span>
          </template>
          <!-- 未安装类的内容 -->
          <div class="content">
            <UnerectedList :showTable="activeTab === '未安装'" />
          </div>
        </el-tab-pane>
  
        <el-tab-pane name="编辑">
          <template #label>
            <span>编辑</span>
          </template>
          <!-- 编辑类的内容 -->
          <div class="content">
            <div class="edit">
              <el-button @click="uploadModal" type="primary">上传类</el-button>
              <el-button @click="uploadConfigModal" type="success">上传配置文件</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <UpLoad ref="uploadModal" class="uploadmod"/>
      <UpLoadConfig ref="uploadConfigModal" class="configmod"/>
    </div>
  </template>
  
  <script>
  import UnerectedList from '../components/UnerectedList.vue';
  import InstalledList from '../components/InstalledList.vue';
  import UpLoad from "../components/upload.vue";
  import UpLoadConfig from "../components/uploadConfig.vue";
  export default {
    name: 'MainPage',
    components: {
      UnerectedList,
      InstalledList,
      UpLoad,
      UpLoadConfig,
    },
    data() {
      return {
        // 默认选中的标签
        activeTab: '已安装',
        showupload: false,
      };
    },
    methods: {
      uploadModal() {
        this.$refs.uploadModal.uploadModal();
      },
      uploadConfigModal() {
        this.$refs.uploadConfigModal.uploadConfigModal();
      },
      editConfig() {
        console.log('开始编辑配置文件');
        // 添加你的编辑配置文件逻辑
      },
      handleTabClick(tab) {
        console.log('切换到标签:', tab.label);
        // 可在此处处理标签切换逻辑
      },
    },
  };
  </script>
  
  <style scoped>
  .main-container {
    padding: 20px;
    background-color: #f0f2f5;
    min-height: 90vh;
  }
  
  .custom-tabs {
    --el-tabs-header-height: 56px;
    --el-tabs-header-padding: 0;
    --el-tabs-header-border-color: transparent;
    --el-tabs-tab-active-color: #333; /* 选中标签文字颜色 */
    --el-tabs-tab-font-size: 16px;
    --el-tabs-tab-line-height: 1;
    --el-tabs-tab-vertical-flex: flex-end;
    border-radius: 20px 20px 0 0;
    background-color: #fff;
    width: 60%; /* 增加宽度 */
    margin: 0 auto;
  }
  
  /* 调整标签样式 */
  .custom-tabs :deep(.el-tabs__item) {
    height: 100%;
    margin: 0;
    padding: 12px 20px;
    border: none;
    background-color: #f5f7fa;
    border-radius: 20px 20px 0 0;
    transition: background-color 0.3s;
  }
  
  .custom-tabs :deep(.el-tabs__item.is-active) {
    background-color: #fff;
    color: #333;
    font-weight: bold;
  }
  
  .custom-tabs :deep(.el-tabs__nav) {
    border-radius: 20px 20px 0 0;
    background-color: #f5f7fa;
  }
  
  .custom-tabs :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0;
  }
  
  /* 内容区域的样式 */
  .content {
    padding: 20px;
    text-align: center;
    border-radius: 0 0 20px 20px;
  }
  
  .el-button {
    margin: 0 10px;
  }
  
  /* 隐藏底部边框 */
  .custom-tabs :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  
  /* 调整标签切换动画 */
  .el-tabs__active-bar {
    height: 0 !important;
  }

  /* 编辑按钮 */
  :deep(.edit .el-button) {
    background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182));
    color:rgb(255,255,255);
    border:none;
  }

  :deep(.el-dialog.uploadmod),
  :deep(.el-dialog.configmod){
    background-color: #fefefe;
    border: 1px solid #888;
    width: 1440px;
    /* height: 650px; */
    border-radius: 14px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 4;
  }

  </style>