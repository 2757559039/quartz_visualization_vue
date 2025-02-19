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
            <!-- 下拉框、配置文件/上传类切换、按钮 -->
            <div class="edit-header">
              <el-select
                v-model="selectedButton"
                placeholder="选择类型"
                @change="fetchConfigData"
              >
                <el-option
                  v-for="option in buttonOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <div class="config-upload-switch">
                <el-radio-group v-model="editType" fill="#333">
                  <el-radio-button label="config">配置文件</el-radio-button>
                  <el-radio-button label="upload">上传类</el-radio-button>
                </el-radio-group>
              </div>
              <div class="edit-buttons">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button
                  v-if="editType === 'config'"
                  @click="reset"
                >
                  重置
                </el-button>
                <el-button
                  v-else
                  @click="clear"
                >
                  清空
                </el-button>
              </div>
            </div>

            <!-- 配置文件内容 -->
            <div v-if="editType === 'config'" class="config-content">
              <CodeEditor :modelValue="editorContent" language="json" @update:modelValue="onCodeChange"/>
            </div>

            <!-- 上传类内容 -->
            <div v-if="editType === 'upload'" class="upload-content">
              <CodeEditor :modelValue="editorContent" language="java" @update:modelValue="onCodeChange"/>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <UpLoad ref="uploadModal" class="uploadmod" :uploadType="uploadType"/>
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
import CodeEditor from '../components/CodeEditor.vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'MainPage',
  components: {
    UnerectedList,
    InstalledList,
    UpLoad,
    CodeEditor,
  },
  watch: {
    editType: {
      immediate: true, // 立即执行一次
      handler(newVal) {
        // 根据编辑类型动态设置按钮选项
        if (newVal === 'config') {
          this.buttonOptions = [
            { label: 'triggerListener', value: 'triggerListener' },
            { label: 'threadPoolProperties', value: 'threadPoolProperties' },
            { label: 'schedulerProperties', value: 'schedulerProperties' },
            { label: 'saveQuartzProperties', value: 'saveQuartzProperties' },
            { label: 'refresh', value: 'refresh' },
            { label: 'pluginProperties', value: 'pluginProperties' },
            { label: 'jobStoreProperties', value: 'jobStoreProperties' },
            { label: 'jobListener', value: 'jobListener' },
            { label: 'getgroup', value: 'getgroup' },
            { label: 'dataSourceProperties', value: 'dataSourceProperties' },
          ];
          this.selectedButton = 'triggerListener'; // 配置文件的默认值
          this.fetchConfigData(); 
        } else if (newVal === 'upload') {
          this.buttonOptions = [
            { label: 'Job', value: 'Job' },
            { label: 'JobDetail', value: 'JobDetail' },
            { label: 'Trigger', value: 'Trigger' },
            { label: 'UpdateTrigger', value: 'UpdateTrigger' },
          ];
          this.selectedButton = 'Job'; // 上传类的默认值
        }
      },
    },
  },
  data() {
    return {
      // 默认选中的标签
      activeTab: '已安装',
      // 编辑类型
      editType: 'upload', // 默认为上传类，但是点击编辑会切换成config，解决输入框问题
      // 上传类型
      uploadType: '',
      selectedButton: '', // 默认值
      buttonOptions: [], // 动态按钮选项
      editorContent: '',
    };
  },
  methods: {
    onCodeChange(newVal) {
        this.editorContent = newVal;
      },
    Go(address) {
      this.$router.push({ path: '/' + address });
    },
    uploadModal(type) {
      this.uploadType = type;
      this.$refs.uploadModal.uploadModal();
    },
    handleClick() {
      console.log('按钮点击事件');
    },
    handleTabClick(tab) {
      console.log('切换到标签:', tab.props.name);
      if (tab.props.name === '编辑') {
        // 延迟 0 秒后切换 editType
        setTimeout(() => {
          this.editType = 'config';
        }, 0);
      }
    },
    fetchConfigData() {
      if (this.editType !== 'config') {
        return;
      }

      const configUrlMap = {
        triggerListener: 'http://114.132.71.250:8002/QuartzProperties/triggerListener',
        threadPoolProperties: 'http://114.132.71.250:8002/QuartzProperties/threadPoolProperties',
        schedulerProperties: 'http://114.132.71.250:8002/QuartzProperties/schedulerProperties',
        saveQuartzProperties: 'http://114.132.71.250:8002/QuartzProperties/saveQuartzProperties',
        refresh: 'http://114.132.71.250:8002/QuartzProperties/refresh',
        pluginProperties: 'http://114.132.71.250:8002/QuartzProperties/pluginProperties',
        jobStoreProperties: 'http://114.132.71.250:8002/QuartzProperties/jobStoreProperties',
        jobListener: 'http://114.132.71.250:8002/QuartzProperties/jobListener',
        getgroup: 'http://114.132.71.250:8002/QuartzProperties/getgroup',
        dataSourceProperties: 'http://114.132.71.250:8002/QuartzProperties/dataSourceProperties',
      };

      const selectedUrl = configUrlMap[this.selectedButton];
      if (!selectedUrl) {
        ElMessage.error('请选择有效类型后提交');
        return;
      }

      axios.get(selectedUrl)
        .then(response => {
          this.editorContent = response.data; // 假设接口返回的数据是字符串
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          ElMessage({
            message: '获取数据失败',
            type: 'error',
          });
        });
    },
    submit() {
      // 显示二级弹窗确认提交
      ElMessageBox.confirm(
        '确定要提交吗？',
        '确认提交',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // 获取选择的按钮对应的接口
          const urlMap = {
            Job: 'http://114.132.71.250:8002/scriptBuilder/saveJobToDB',
            JobDetail: 'http://114.132.71.250:8002/scriptBuilder/saveJobDetailToDB',
            Trigger: 'http://114.132.71.250:8002/scriptBuilder/saveTriggerToDB',
            UpdateTrigger: 'http://114.132.71.250:8002/scriptBuilder/saveUpdateTriggerToDB',
          };
          const selectedUrl = urlMap[this.selectedButton];
          if (!selectedUrl) {
            ElMessage.error('请选择有效类型后提交');
            return;
          }
          axios.post(selectedUrl, {
            code: this.editorContent,
          })
            .then(response => {
              if (response.data.code === '200') {
                ElMessage({
                  message: '提交成功',
                  type: 'success',
                });
                if(editType === 'upload'){
                  // 清空输入框
                  this.editorContent = '';
                }
              } else {
                ElMessage({
                  message: '提交失败',
                  type: 'error',
                });
              }
            })
            .catch(error => {
              console.error('提交失败:', error);
              ElMessage({
                message: '提交失败',
                type: 'error',
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消提交',
          });
        });
    },
    reset() {
    ElMessageBox.confirm(
      '确定要重置为最近一次提交的内容吗？',
      '确认重置',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        this.fetchConfigData()
          .then(() => {
            // 如果数据获取成功，显示成功消息
            ElMessage({
              message: '内容已重置为最近一次提交的内容',
              type: 'success',
            });
          })
          .catch(() => {
            // 如果数据获取失败，不显示成功消息
            console.error('重置失败, 数据获取失败');
          });
      })
      // .catch(() => {
      //   ElMessage({
      //     message: '已取消重置',
      //     type: 'info',
      //   });
      // });
    },
    clear() {
      ElMessageBox.confirm(
        '确定要清空输入框内容吗？',
        '确认清空',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // 用户点击“确认”按钮的逻辑
          this.editorContent = '';
          ElMessage({
            message: '内容已清空',
            type: 'success',
          });
        })
        .catch(() => {
          // 用户点击“取消”或关闭弹窗的逻辑
          ElMessage({
            message: '已取消清空',
            type: 'info',
          });
        });
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
  --el-tabs-tab-active-color: #333;
  --el-tabs-tab-font-size: 16px;
  --el-tabs-tab-line-height: 1;
  --el-tabs-tab-vertical-flex: flex-end;
  border-radius: 20px;
  background-color: #fff;
  width: 60%;
  height: 700px;
  margin: 0 auto;
  margin-top: 50px;
}

.edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 90%;
  padding-left: 5%;
  justify-content: space-between;
}

:deep(.edit-header .el-select) {
  flex: 1;
}

/* 配置文件/上传类切换样式 */
.config-upload-switch {
  flex: 1;
  display: flex;
  justify-content: center; 
}

:deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled)+.el-radio-button__inner){
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182));
  border-color: rgb(220, 223, 230) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5) !important;
}

:deep(.edit-buttons) {
  flex: 1;
}

:deep(.edit-buttons .el-button) {
  margin: 0px;
  width: 70px;
  margin-right: 30px;
}

/* 按钮样式 */
.el-button {
  background: linear-gradient(to left, rgb(53, 204, 255), rgb(4, 114, 182));
  color: #ffffff;
  border: none;
}

.config-content,
.upload-content{
  display: flex;
  justify-content: center;
}

.config-content .el-button {
  background: linear-gradient(to left, rgb(53, 204, 255), rgb(4, 114, 182));
  color: #ffffff;
  border: none;
  margin: 10px auto 10px auto;
  width: 400px;
  height: 70px;
  font-size: 20px;
}

.upload-content .el-button {
  margin: 10px auto 10px auto;
  width: 500px;
  height: 200px;
  font-size: 40px;
}

/* 其他样式 */
.content {
  padding: 20px;
  /* text-align: center; */
  border-radius: 0 0 20px 20px;
}

/* 页面底部按钮样式 */
.bottom-buttons {
  display: flex;
  gap: 20px;
  padding-top: 30px;
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

:deep(.el-dialog.uploadmod) {
  background-color: #fefefe;
  top: -100px;
  border: 1px solid #888;
  width: 1440px;
  height: 800px;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}

:deep(.el-overlay-dialog) {
  overflow: hidden;
}
</style>