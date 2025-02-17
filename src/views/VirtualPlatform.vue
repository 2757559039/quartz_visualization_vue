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
            <!-- 配置文件/上传类切换 -->
            <div class="config-upload-switch">
              <el-radio-group v-model="editType" fill="#333">
                <el-radio-button label="config">配置文件</el-radio-button>
                <el-radio-button label="upload">上传类</el-radio-button>
              </el-radio-group>
            </div>

            <!-- 配置文件内容 -->
            <div v-if="editType === 'config'" class="config-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-row>
                    <el-button @click="handleClick">triggerListener</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">threadPoolProperties</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">schedulerProperties</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">saveQuartzProperties</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">refresh</el-button>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-button @click="handleClick">pluginProperties</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">jobStoreProperties</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">jobListener</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">getgroup</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">dataSourceProperties</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>

            <!-- 上传类内容 -->
            <div v-if="editType === 'upload'" class="upload-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-row>
                    <el-button @click="handleClick">按钮1</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">按钮2</el-button>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-button @click="handleClick">按钮3</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="handleClick">按钮4</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <UpLoad ref="uploadModal" class="uploadmod" />
    <div class="bottom-buttons">
      <el-button type="primary" @click="Go('JobIndex')">任务管理<el-icon><Link /></el-icon></el-button>
      <el-button type="danger" @click="Go('TriggerIndex')">触发器管理<el-icon><Link /></el-icon></el-button>
    </div>
  </div>
</template>

<script>
import UnerectedList from '../components/UnerectedList.vue';
import InstalledList from '../components/InstalledList.vue';
import UpLoad from '../components/upload.vue';

export default {
  name: 'MainPage',
  components: {
    UnerectedList,
    InstalledList,
    UpLoad,
  },
  data() {
    return {
      // 默认选中的标签
      activeTab: '已安装',

      // 编辑类型
      editType: 'config', // 默认为配置文件
    };
  },
  methods: {
    Go(address){
      this.$router.push({ path: '/'+address });
    },
    uploadModal() {
      this.$refs.uploadModal.uploadModal();
    },

    editConfig() {
      console.log('开始编辑配置文件');
    },

    handleTabClick(tab) {
      console.log('切换到标签:', tab.label);
    },

    handleClick() {
      console.log('按钮点击事件');
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
  height: 700px;
  margin: 0 auto;
}

/* 配置文件/上传类切换样式 */
.config-upload-switch {
  margin-bottom: 20px;
}
:deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled)+.el-radio-button__inner){
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182));
  border-color:rgb(220, 223, 230) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5) !important;
}

/* 按钮样式 */
.el-button {
  background: linear-gradient(to left, rgb(53, 204, 255), rgb(4, 114, 182));
  color: #ffffff;
  border: none;
}
/* 配置文件 */
.config-content .el-button{
  margin: 10px auto 10px auto;
  width: 400px;
  height: 70px;
  font-size: 20px;
}
/* 上传类 */
.upload-content .el-button{
  margin: 10px auto 10px auto;
  width: 300px;
  height: 200px;
}

/* 其他样式 */
.content {
  padding: 20px;
  text-align: center;
  border-radius: 0 0 20px 20px;
}

/* 页面底部按钮样式 */
.bottom-buttons {
  display: flex;
  gap: 20px;
  padding-top:30px;
  justify-content: center;
}

.bottom-buttons .el-button {
  background: linear-gradient(to left, rgb(53, 204, 255), rgb(4, 114, 182));
  color: #ffffff;
  border: none;
  width: 180px;
  height: 60px;
  font-size: 24px;
}

.el-dialog.uploadmod {
  background-color: #fefefe;
  border: 1px solid #888;
  width: 1440px;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}
</style>