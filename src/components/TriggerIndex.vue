<template>
  <div class="container">
    <div class="jumpBox">
      <el-link :underline="false">前往触发器页面<el-icon><Link /></el-icon></el-link>
      <div class="modalButtonBox">
        <el-button type="primary">添加任务</el-button>
        <el-button type="primary">挂载触发器</el-button>
      </div>
    </div>

    <div class="topbox">
      <p class="title">任务管理</p>
      <div class="Button3Box">
        <el-button type="success" @click="resumeAllJob()">恢复所有任务</el-button>
        <el-button type="warning"  @click="pauseAllJob()">停止所有任务</el-button>
        <el-button type="danger" @click="deleteAllJob()">删除所有任务</el-button>
      </div>
    </div>

    <div class="conterBox"> 
      <p class="selectedtitle">条件筛选</p>
      <div class="selectBox"> 
        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="select">
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="select">
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="select">
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="select">
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="select">
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>
        
        <div class="inputnox" >
          <el-input v-model="selected" class="input1" placeholder="Type something">
            <template #prefix>
              <el-icon class="el-input__icon"><search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary">
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>

      <div class="box"> 
        <el-table :data="Jobs" :border="parentBorder" max-height="750" class="JobBox">
          <el-table-column label="任务名" prop="jobname" min-width="90"/>
          <el-table-column label="任务分组" sortable prop="jobgroup" min-width="110" />
          <el-table-column label="任务类名" prop="jobclassname" min-width="100"/>
          <el-table-column label="优先级" sortable prop="priority" min-width="80" />
          <el-table-column label="触发器名" prop="triggername" min-width="90"/>
          <el-table-column label="触发器分组" sortable prop="triggergroup" min-width="120"/>
          <el-table-column label="触发器状态" sortable prop="triggers_state" min-width="120"/>
          <el-table-column label="任务状态" sortable prop="job_state" min-width="110"/>
          <el-table-column label="任务操作" min-width="151">
            <template #default="scope">
              <div>
                <div class="button3Box"> 
                  <el-button type="success" @click="resumeJob(scope.row)" circle>ON</el-button>
                <el-button type="warning" @click="pauseJob(scope.row)" circle>OFF</el-button>
                <el-button type="danger" :icon="Delete" circle @click="deleteJob(scope.row)">  
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
                </div>
                <div class="button2Box"> 
                  <el-button type="info" @click="replacetrigger(scope.row)">更改触发器参数</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">Resume Job Confirmation</slot>
            </div>

            <div class="modal-body">
              <!-- 动态插入子组件 -->
              <updateTrigger
                :jobinfo="selectedJob"
                v-if="showModal"
                @close="closeModal"
              ></updateTrigger>
            </div>

            <div class="modal-footer">
              <button class="modal-default-button" @click="closeModal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>
    
  <script>
import axios from "axios";
import updateTrigger from "../components/updateTrigger.vue";
export default {
  components: { updateTrigger },
  data() {
    return {
      Jobs: [
        {
          jobname: 'Job1',
          jobgroup: 'GroupA',
          jobclassname: 'ClassName1',
          priority: 5,
          triggername: 'Trigger1',
          triggergroup: 'TriggerGroupA',
          triggers_state: 'PAUSED',
          job_state: 'PAUSED'
        },
        {
          jobname: 'Job2',
          jobgroup: 'GroupB',
          jobclassname: 'ClassName2',
          priority: 3,
          triggername: 'Trigger2',
          triggergroup: 'TriggerGroupB',
          triggers_state: 'ACTIVE',
          job_state: 'ACTIVE'
        },
        {
          jobname: 'Job1',
          jobgroup: 'GroupA',
          jobclassname: 'ClassName1',
          priority: 5,
          triggername: 'Trigger1',
          triggergroup: 'TriggerGroupA',
          triggers_state: 'PAUSED',
          job_state: 'PAUSED'
        },
        {
          jobname: 'Job2',
          jobgroup: 'GroupB',
          jobclassname: 'ClassName2',
          priority: 3,
          triggername: 'Trigger2',
          triggergroup: 'TriggerGroupB',
          triggers_state: 'ACTIVE',
          job_state: 'ACTIVE'
        },
        {
          jobname: 'Job1',
          jobgroup: 'GroupA',
          jobclassname: 'ClassName1',
          priority: 5,
          triggername: 'Trigger1',
          triggergroup: 'TriggerGroupA',
          triggers_state: 'PAUSED',
          job_state: 'PAUSED'
        },
        {
          jobname: 'Job2',
          jobgroup: 'GroupB',
          jobclassname: 'ClassName2',
          priority: 3,
          triggername: 'Trigger2',
          triggergroup: 'TriggerGroupB',
          triggers_state: 'ACTIVE',
          job_state: 'ACTIVE'
        },
        {
          jobname: 'Job1',
          jobgroup: 'GroupA',
          jobclassname: 'ClassName1',
          priority: 5,
          triggername: 'Trigger1',
          triggergroup: 'TriggerGroupA',
          triggers_state: 'PAUSED',
          job_state: 'PAUSED'
        },
        {
          jobname: 'Job2',
          jobgroup: 'GroupB',
          jobclassname: 'ClassName2',
          priority: 3,
          triggername: 'Trigger2',
          triggergroup: 'TriggerGroupB',
          triggers_state: 'ACTIVE',
          job_state: 'ACTIVE'
        },
        {
          jobname: 'Job1',
          jobgroup: 'GroupA',
          jobclassname: 'ClassName1',
          priority: 5,
          triggername: 'Trigger1',
          triggergroup: 'TriggerGroupA',
          triggers_state: 'PAUSED',
          job_state: 'PAUSED'
        },
        {
          jobname: 'Job2',
          jobgroup: 'GroupB',
          jobclassname: 'ClassName2',
          priority: 3,
          triggername: 'Trigger2',
          triggergroup: 'TriggerGroupB',
          triggers_state: 'ACTIVE',
          job_state: 'ACTIVE'
        },
        // 添加更多条目以充分测试样式
      ],
      groups: ['ALL', 'GroupA', 'GroupB', 'GroupC'],
      selectedJob: {},
      selectGroup: "ALL",
      selectedJObName: "",
      showModal: false,
    };
  },

  computed: {
    // 计算属性：根据 selectGroup 的值过滤 Jobs 数组
    filteredJobs() {
      if (this.selectGroup === "ALL") {
        return this.Jobs;
      } else {
        return this.Jobs.filter((job) => job.jobgroup === this.selectGroup);
      }
    },
  },
  methods: {
    async getUsedJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Select/jobs"
        );
        console.log(response);
        this.Jobs = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async getGroups() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Select/jobgroupall"
        );
        console.log(response);
        this.groups = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    async resumeAllJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Start/resumeall"
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },
    async pauseAllJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Pause/alljob"
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },
    async deleteAllJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Delete/alljob"
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },

    async resumeJob(index) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Start/resumetri?triname=" +
            this.Jobs[index].triggername +
            "&trigroup=" +
            this.Jobs[index].triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },
    async pauseJob(index) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Pause/trigger?triname=" +
            this.Jobs[index].triggername +
            "&trigroup=" +
            this.Jobs[index].triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },
    async deleteJob(index) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Delete/jobUNtri?triggername=" +
            this.Jobs[index].triggername +
            "&triggergroup=" +
            this.Jobs[index].triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedJob();
    },

    replacetrigger(row) {
      // 设置要恢复的作业信息
      this.selectedJob = row;
      this.showModal = true;
    },
    closeModal() {
      // 关闭弹窗
      this.showModal = false;
    },

  },
  created() {
    this.getUsedJob();
    this.getGroups();
  },
};
</script>
  
  <style scoped>
.container {
  width: 80%;
  height: auto;
  margin: 0;
  padding: 0;
  margin-left: 10%;
  /* display : flex;
    flex-direction: column;
    align-items: center; */
  overflow: auto;
  background: rgb(255, 255, 255);
}

.jumpBox {
  width: auto;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(255, 255, 255);
  margin-top: 20px;
  padding-left: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
}

:deep(.el-link__inner) {
  color: rgb(64, 158, 255);
  font-size: 24px;
}

.modalButtonBox{
    padding-top: 10px;
    display: flex;
    justify-content: flex-end; /* 将所有子元素对齐到右侧 */
}

.modalButtonBox button{
  width: 150px;
    height: 40px;
    margin-right: 10px;
    background-color: rgb(64, 158, 255);
    font-size: 20px;
}

.topbox{
  width: auto;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(255, 255, 255);
  margin-top: 20px;
  padding-left: 40px;
  /* padding-bottom: 10px; */
  margin-bottom: 50px;
}

.title{
    font-size: 36px;
    font-weight: bold;
    color: #000;
    margin: 0;
}

.Button3Box{
  display: flex;
  /* justify-content: flex-end; */
  gap: 10px;
  margin: 0;
}

.Button3Box button{
  width: 150px;
  height: 50px;
  padding: 0;
  font-size: 20px;
}

.conterBox{
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  border-radius: 5px;
  padding-top: 10px;
  margin-bottom: 30px;
}

.inputnox{
  display: flex; 
  justify-content: center;
}

.input1{
  width: 300px;
  height: 40px;
  font-size: 24px;
}

.inputnox button{
  margin-left: 10px;
  width: 80px;
  height: 40px;
}

.selectedtitle{
  font-size: 28px;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  margin-left: 40px;
}

.selectBox{
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.select{
  width: 200px;
  height: 40px;
}

:deep(.select .el-select__wrapper){
  height: 40px;
}


.box {
  /* width: 1517px; */
  width: auto;
  color: #000;
  margin: 0;
  border-radius: 5px;
  /* padding-left: 2px;
  padding-right: 2px; */
}

.JobBox {
  width: 1515px;
  /* height: 750px; */
  color: #000;
  margin: 0;
  border-radius: 5px;
}

:deep(.JobBox .cell) {
  height: auto;
  color: #000;
  font-size: 16px;
  padding: 0;
  display: flex;
  justify-content: center;
}

:deep(.JobBox .caret-wrapper){
  width: 0px;
  margin-top: 6px;
}

:deep(.JobBox .el-table__cell){
  border-top: 1px solid #000;
}

:deep(.JobBox .el-scrollbar__view) {

  width: 1499px;
}

:deep(.JobBox .el-table__header-wrapper) {
  width: 1499px;
}

:deep(.JobBox .el-table__body) {
  width: 1499px;
}

:deep(.JobBox .el-table__empty-text) {
  color: #000;
  background: rgb(255, 255, 255);
}

.button3Box{
}

.button2Box{
  width: 127px;
  margin-top: 8px;
}

.button2Box button{
  width: 127px;
  height: 40px;
}


.buttonBox {
  width: 200px;
  /* white-space: normal; */
}

.button-item {
  display: block;
  margin: 2px 0;
  min-width: 80px;
}


.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>