<template>
  <!-- 虚拟类管理页面 -->
  <div class="main-container">
    <div style="display: flex; justify-content: flex-end; padding-right: 20px;">
       <el-button id="tour-virtual-docs-btn" type="primary" plain @click="openDocs">文档</el-button>
       <el-button id="tour-virtual-guide-btn" type="info" @click="startTour">新手引导</el-button>
    </div>
      <el-link id="tour-virtual-backend" class="title" :underline="false" @click="Go('uploadIP')">当前后端地址--{{ baseURL }}</el-link>
    <!-- 顶部标签页 -->
    <el-tabs
      id="tour-virtual-tabs"
      v-model="activeTab"
      class="custom-tabs"
      stretch
      @tab-click="handleTabClick"
    >
      <el-tab-pane name="虚拟类">
        <template #label>
          <span id="tour-tab-virtual">虚拟类</span>
        </template>
        <!-- 虚拟类的内容 -->
        <div id="tour-content-virtual" class="content">
          <InstalledList :showTable="activeTab === '虚拟类'" ref="InstalledList"/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="脚本" name="脚本">
        <template #label>
          <span id="tour-tab-script">脚本</span>
        </template>
        <!-- 脚本的内容 -->
        <div id="tour-content-script" class="content">
          <UnerectedList :showTable="activeTab === '脚本'" ref="UnerectedList"/>
        </div>
      </el-tab-pane>

      <el-tab-pane name="编辑">
        <template #label>
          <span id="tour-tab-edit">编辑</span>
        </template>
        <!-- 编辑类的内容 -->
        <div class="content">
          <div class="edit">
            <!-- 下拉框、配置文件/上传类切换、按钮 -->
            <div id="tour-edit-header" class="edit-header">
              <el-select
                id="tour-edit-select"
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
              <div id="tour-edit-switch" class="config-upload-switch">
                <el-radio-group v-model="editType" fill="#333">
                  <el-radio-button label="config">配置文件</el-radio-button>
                  <el-radio-button label="upload">上传类</el-radio-button>
                </el-radio-group>
              </div>
              <div id="tour-edit-actions" class="edit-buttons">
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
    <HelpDrawer ref="helpDrawer" />
    <div id="tour-virtual-nav-btns" class="bottom-buttons">
      <el-button type="primary" @click="Go('JobIndex')">任务管理<el-icon><Link /></el-icon></el-button>
      <el-button type="danger" @click="Go('TriggerIndex')">触发器管理<el-icon><Link /></el-icon></el-button>
      <el-button type="danger" @click="Go('sseListener')">监控平台<el-icon><Link /></el-icon></el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import UnerectedList from '../components/UnerectedList.vue';
import InstalledList from '../components/InstalledList.vue';
import UpLoad from '../components/upload.vue';
import CodeEditor from '../components/CodeEditor.vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import HelpDrawer from '../components/HelpDrawer.vue';

export default {
  name: 'MainPage',
  components: {
    UnerectedList,
    InstalledList,
    UpLoad,
    CodeEditor,
    HelpDrawer,
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
            { label: 'SimpleTrigger', value: 'SimpleTrigger' },
            { label: 'CalendarIntervalTrigger', value: 'CalendarIntervalTrigger' },
            { label: 'DailyTimeIntervalTrigger', value: 'DailyTimeIntervalTrigger' },
            { label: 'CronTrigger', value: 'CronTrigger' },
            { label: 'SimpleUpdateTrigger', value: 'SimpleUpdateTrigger' },
            { label: 'CalendarUpdateIntervalTrigger', value: 'CalendarUpdateIntervalTrigger' },
            { label: 'DailyUpdateTimeIntervalTrigger', value: 'DailyUpdateTimeIntervalTrigger' },
            { label: 'CronUpdateTrigger', value: 'CronUpdateTrigger' },
          ];
          this.selectedButton = 'Job'; // 上传类的默认值
          this.editorContent = '';
        }
      },
    },
  },
  data() {
    return {
      // 默认选中的标签
      activeTab: '虚拟类',
      // 编辑类型
      editType: 'upload', // 默认为上传类，但是点击编辑会切换成config，解决输入框问题
      // 上传类型
      uploadType: '',
      selectedButton: '', // 默认值
      buttonOptions: [], // 动态按钮选项
      editorContent: '',
    };
  },
  computed: {
        ...mapState(['baseURL']),
    },
  methods: {
    //修改文件类型
    onCodeChange(newVal) {
        this.editorContent = newVal;
      },

      //跳转页面
    Go(address) {
      this.$router.push({ path: '/' + address });
    },

    //代码编辑器可见性及数据传递
    uploadModal(type) {
      this.uploadType = type;
      this.$refs.uploadModal.uploadModal();
    },

    //标签切换
    handleTabClick(tab) {
      if (tab.props.name === '虚拟类') { // 切换到 虚拟类 标签
        this.$nextTick(() => {
          this.$refs.InstalledList.fetchData(); // 调用 InstalledList 的 fetchData 方法
        });
      } else if (tab.props.name === '脚本') { // 切换到 脚本 标签
        this.$nextTick(() => {
          this.$refs.UnerectedList.fetchData(); // 调用 UnerectedList 的 fetchData 方法
        });
      }else if (tab.props.name === '编辑') {
        // 延迟 0 秒后切换 editType
        setTimeout(() => {
          this.editType = 'config';
        }, 0);
      }
    },

    //数据获取与格式化
    fetchConfigData() {
      if (this.editType !== 'config') {
        return;
      }

      const configUrlMap = {
        triggerListener: '/quartzConfig/triggerListener',
        threadPoolProperties: '/quartzConfig/threadPoolProperties',
        schedulerProperties: '/quartzConfig/schedulerProperties',
        saveQuartzProperties: '/quartzConfig/saveQuartzProperties',
        refresh: '/quartzConfig/refresh',
        pluginProperties: '/quartzConfig/pluginProperties',
        jobStoreProperties: '/quartzConfig/jobStoreProperties',
        jobListener: '/quartzConfig/jobListener',
        getgroup: '/quartzConfig/getgroup',
        dataSourceProperties: '/quartzConfig/dataSourceProperties',
      };

      const selectedUrl = configUrlMap[this.selectedButton];
      if (!selectedUrl) {
        ElMessage.error('请选择有效类型后提交');
        return;
      }

      return axios.get(this.baseURL + selectedUrl) // 返回 axios.get 的 Promise
        .then(response => {
          // 如果响应数据是 JSON 格式，将其转换为字符串
          if (typeof response.data === 'object') {
            this.editorContent = JSON.stringify(response.data, null, 2); // 格式化 JSON
          } else {
            this.editorContent = response.data; // 直接赋值
          }
          return Promise.resolve(); // 返回一个成功的 Promise
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          ElMessage({
            message: '获取数据失败',
            type: 'error',
          });
          return Promise.reject(); // 返回一个失败的 Promise
        });
    },

    // 提交文件
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
            Job: '/scriptBuilder/saveJobToDB',
            JobDetail: '/scriptBuilder/saveJobDetailToDB',
            SimpleTrigger: '/scriptBuilder/saveTriggerToDB?Type=SimpleTrigger',
            CalendarIntervalTrigger: '/scriptBuilder/saveTriggerToDB?Type=CalendarIntervalTrigger',
            DailyTimeIntervalTrigger: '/scriptBuilder/saveTriggerToDB?Type=DailyTimeIntervalTrigger',
            CronTrigger: '/scriptBuilder/saveTriggerToDB?Type=CronTrigger',
            SimpleUpdateTrigger: '/scriptBuilder/saveUpdateTriggerToDB?Type=SimpleUpdateTrigger',
            CalendarUpdateIntervalTrigger: '/scriptBuilder/saveUpdateTriggerToDB?Type=CalendarUpdateIntervalTrigger',
            DailyUpdateTimeIntervalTrigger: '/scriptBuilder/saveUpdateTriggerToDB?Type=DailyUpdateTimeIntervalTrigger',
            CronUpdateTrigger: '/scriptBuilder/saveUpdateTriggerToDB?Type=CronUpdateTrigger',
          };
          const selectedUrl = urlMap[this.selectedButton];
          if (!selectedUrl) {
            ElMessage.error('请选择有效类型后提交');
            return;
          }
          axios.post(this.baseURL + selectedUrl, {
            code: this.editorContent,
          })
            .then(response => {
              if (response.data.code === '200') {
                ElMessage({
                  message: '提交成功',
                  type: 'success',
                });
                if(this.editType === 'upload'){
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

    //重置文件
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
    },

    //清空
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
    // 打开文档
    openDocs() {
      this.$refs.helpDrawer.open();
    },
    // 新手引导
    startTour() {
      const driverObj = driver({
        showProgress: true,
        allowClose: false, // 不允许点击空白关闭
        allowKeyboardControl: false, // 自定义键盘控制
        overlayClickNext: false,
        doneBtnText: '完成',
        nextBtnText: '下一步',
        prevBtnText: '上一步',
        steps: [
          { element: '#tour-virtual-backend', popover: { title: '后端地址', description: '显示当前连接的后端服务器地址。' } },
          { element: '#tour-virtual-tabs', popover: { title: '功能切换', description: '虚拟管理平台核心功能分为三个模块：虚拟类管理、脚本管理和编辑模块。' } },
          
          // 编辑模块引导
          {
            element: '#tour-tab-edit',
            popover: { title: '编辑模块', description: '点击进入编辑模块，可以查看和更改配置文件，或上传新的类。' },
            onHighlightStarted: () => { this.activeTab = '编辑'; this.editType = 'config';}
          },
          {
            element: '#tour-edit-select',
            popover: { title: '类型选择', description: '点击下拉框选择具体的配置文件或类类型。' },
             onHighlightStarted: () => {
               // 模拟展示下拉框效果（仅提示）
             }
          },
          {
             element: '#tour-edit-switch',
             popover: { title: '模式切换', description: '配置文件模式：查看和修改系统配置。\n上传类模式：上传Job、Trigger等类代码。' }
          },
          {
             element: '#tour-edit-actions',
             popover: { title: '操作按钮', description: '提交：保存更改。\n重置/清空：恢复默认或清空输入框。' }
          },

          // 脚本模块引导
          {
            element: '#tour-tab-script',
            popover: { title: '脚本模块', description: '管理已上传的脚本文件。' },
            onHighlightStarted: () => { this.activeTab = '脚本'; this.$nextTick(() => { this.$refs.UnerectedList.fetchData(); }); }
          },
          {
            element: '#tour-content-script',
            popover: { title: '脚本管理功能', description: '1. 搜索：快速查找脚本。\n2. 修改：在线编辑脚本内容。\n3. 删除：删除不需要的脚本。\n4. 安装：将脚本安装为虚拟类，供任务使用。' }
          },

          // 虚拟类模块引导
          {
            element: '#tour-tab-virtual',
            popover: { title: '虚拟类模块', description: '管理已安装的虚拟类（Job, Trigger等）。' },
            onHighlightStarted: () => { this.activeTab = '虚拟类'; this.$nextTick(() => { this.$refs.InstalledList.fetchData(); }); }
          },
          {
            element: '#tour-content-virtual',
            popover: { title: '虚拟类管理功能', description: '1. 搜索：查找已安装的类。\n2. 卸载：卸载虚拟类（卸载后需在脚本页面重新安装才能使用）。\n注意：删除的脚本会自动从虚拟类中卸载。' }
          },

          { element: '#tour-virtual-nav-btns', popover: { title: '快速导航', description: '快速跳转到其他管理页面。' } },
          { element: '#tour-virtual-docs-btn', popover: { title: '文档', description: '点击查看详细使用文档。' } },
          { element: '#tour-virtual-guide-btn', popover: { title: '新手引导', description: '点击这里可以再次查看本指引。' } },
        ],
        onDestroyed: () => {
           localStorage.setItem('hasSeenVirtualTour', 'true');
           document.removeEventListener('keydown', keyHandler);
        }
      });

      const keyHandler = (e) => {
        if (!driverObj.isActive()) return;
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          driverObj.moveNext();
        } else if (e.key === 'ArrowLeft') {
          driverObj.movePrevious();
        } else if (e.key === 'Escape') {
          // 允许 Esc 退出吗？题目说点击空白不允许退出，通常 Esc 允许，但为了严格防误触，可以屏蔽或弹窗确认。这里暂时保留 Esc 退出。
          driverObj.destroy();
        }
      };
      
      document.addEventListener('keydown', keyHandler);
      driverObj.drive();
    }
  },
  mounted() {
      // 检查是否需要启动新手引导
     this.$nextTick(() => {
        const hasSeenTour = localStorage.getItem('hasSeenVirtualTour');
        if (!hasSeenTour) {
          this.startTour();
        }
      });
  }
};
</script>

<style scoped>
.main-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 90vh;
}

.title {
  display: flex;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 0;
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
  width: 100%; /* 修改宽度为100% */
  padding: 0 20px; /* 两侧留白 */
  justify-content: space-between;
  box-sizing: border-box; /* 确保padding不撑大宽度 */
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

:deep(.el-link__inner){
  color:rgb(0,119,194);
}
</style>