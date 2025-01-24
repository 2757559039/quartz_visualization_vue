<template>
  <div class="container">
    <div class="jumpBox">
      <el-link :underline="false">前往触发器页面<el-icon><Link /></el-icon></el-link>
      <div class="modalButtonBox">
        <el-button @click="jobModal" type="primary" class="addbtn">添加任务</el-button>
        <el-button @click="onloadModal" type="primary" class="addbtn">挂载触发器</el-button>
      </div>
    </div>

    <div class="topbox">
      <p class="title">任务管理</p>
      <div class="Button3Box">
        <el-button type="success" @click="resumeAllJob()" class="jobbtn">恢复所有任务</el-button>
        <el-button type="warning"  @click="pauseAllJob()" class="jobbtn">停止所有任务</el-button>
        <el-button type="danger" @click="deleteAllJob()" class="jobbtn">删除所有任务</el-button>
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
        <el-table :data="Jobs" :border="parentBorder" max-height="800" class="JobBox">
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="[props.row]" :border="childBorder" class="detail">
                <el-table-column label="任务ID" prop="id" />
                <el-table-column label="任务名" prop="jobname" />
                <el-table-column label="任务分组" prop="jobgroup" />
                <el-table-column label="任务类名" prop="jobclassname" />
                <el-table-column label="任务描述" prop="description" />
                <el-table-column label="任务类型" prop="type" />
                <el-table-column label="优先级" prop="priority" />
                <el-table-column label="开始时间" prop="startime" />
                <el-table-column label="结束时间" prop="endtime" />
                <el-table-column label="触发器名" prop="triggername" />
                <el-table-column label="触发器分组" prop="triggergroup" />
                <el-table-column label="触发器状态" prop="triggers_state" />
                <el-table-column label="任务状态" prop="job_state" />
              </el-table>  
            </template>
          </el-table-column>
          <el-table-column label="ID" sortable prop="id" min-width="60" />
          <el-table-column label="任务名" prop="jobname" min-width="90"/>
          <el-table-column label="任务分组" sortable prop="jobgroup" min-width="110" />
          <el-table-column label="任务类名" prop="jobclassname" min-width="100"/>
          <el-table-column label="任务描述" prop="description" min-width="100"/>
          <el-table-column label="任务类型" prop="type" min-width="100"/>
          <el-table-column label="优先级" sortable prop="priority" min-width="80" />
          <el-table-column label="开始时间" sortable prop="startime" min-width="110"/>
          <el-table-column label="结束时间" sortable prop="endtime" min-width="110"/>
          <el-table-column label="触发器名" prop="triggername" min-width="90"/>
          <el-table-column label="触发器分组" sortable prop="triggergroup" min-width="120"/>
          <el-table-column label="触发器状态" sortable prop="triggers_state" min-width="120"/>
          <el-table-column label="任务状态" sortable prop="job_state" min-width="110"/>
          <el-table-column label="任务操作" min-width="151">
            <template #default="scope">
              <div>
                <div class="button3Box"> 
                  <el-button type="success" @click="resumeJob(scope.row.id)" circle>ON</el-button>
                <el-button type="warning" @click="pauseJob(scope.row.id)" circle>OFF</el-button>
                <el-button type="danger" :icon="Delete" circle @click="deleteJob(scope.row.id)">  
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
                </div>
                <div class="button2Box"> 
                  <el-button type="info" @click="replacetrigger(scope.row.id)">替换触发器</el-button>
                </div>
                <div class="button2Box"> 
                  <el-button type="info" @click="updatejob(scope.row.id)">修改任务详情</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <TriggerModal ref="triggerModal" />
    <JobModal ref="jobModal" />
    <transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">Resume Job Confirmation</slot>
            </div>

            <div class="modal-body">
              <ReplaceTrigger
                :jobinfo="selectedJob"
                v-if="showModal"
                @close="closeModal"
              ></ReplaceTrigger>
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
    <transition name="modal">
      <div v-if="showjobDetail" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">JobDetail</slot>
            </div>

            <div class="modal-body">
              <JobDetail
                :jobinfo="selectedJob"
                v-if="showjobDetail"
                @close="closeshowjobDetail"
              ></JobDetail>
            </div>

            <div class="modal-footer">
              <button class="modal-default-button" @click="closeshowjobDetail">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
    
  <script>
import axios from "axios";
import ReplaceTrigger from "../components/ReplaceTrigger.vue";
import JobDetail from "../components/JobDetail.vue";
import TriggerModal from './onloadtrigger.vue';
import JobModal from './AddJob.vue';
export default {
  components: {
    ReplaceTrigger,
    JobDetail,
    TriggerModal,
    JobModal,
  },
  data() {
  return {
    Jobs: [
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: 'abcsssd',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '1',
        jobname: 'Job-001',
        jobgroup: 'Group-A',
        jobclassname: 'Class-A',
        description: 'This is a description for Job-001.',
        type: 'Type-A',
        priority: 'High',
        startime: '2023-04-01T08:00:00Z',
        endtime: '2023-04-01T17:00:00Z',
        triggername: 'Trigger-001',
        triggergroup: 'TriggerGroup-A',
        triggers_state: 'PAUSED',
        job_state: 'PAUSED'
      },
      {
        id: '2',
        jobname: 'Job-002',
        jobgroup: 'Group-B',
        jobclassname: 'Class-B',
        description: 'This is a description for Job-002.',
        type: 'Type-B',
        priority: 'Medium',
        startime: '2023-04-02T09:00:00Z',
        endtime: '2023-04-02T18:00:00Z',
        triggername: 'Trigger-002',
        triggergroup: 'TriggerGroup-B',
        triggers_state: 'RUNNING',
        job_state: 'RUNNING'
      },
      // Add more job objects as needed...
    ],
    groups: ['Group-A', 'Group-B', 'Group-C'],
    selectedJob: {},
    selectGroup: "ALL",
    selected: "",
    showModal: false,
    showjobDetail: false,
  };
},
  computed: {
  },
  methods: {
    onloadModal() {
      this.$refs.triggerModal.onloadModal();
    },
    jobModal() {
      this.$refs.jobModal.jobModal();
    },

    async getUsedJob() {
      // try {
      //   const response = await axios.post(
      //     "http://114.132.71.250:8002/task/Select/jobs"
      //   );
      //   console.log(response);
      //   this.Jobs = response.data.data;

      //   // 重置表单
      // } catch (error) {
      //   // 处理网络错误或其他错误
      //   this.errorMessage = "请求失败，请检查网络连接";
      //   console.error;
      // }
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

    async select(selectGroup) {
    },

    async resumeJob(index) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Start/resume?name=" +
            this.Jobs[index].jobname +
            "&group=" +
            this.Jobs[index].jobgroup
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
          "http://114.132.71.250:8002/task/Pause/job?jobname=" +
            this.Jobs[index].jobname +
            "&jobgroup=" +
            this.Jobs[index].jobgroup
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
          "http://114.132.71.250:8002/task/Delete/job?name=" +
            this.Jobs[index].jobname +
            "&group=" +
            this.Jobs[index].jobgroup
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

    replacetrigger(index) {
      // 设置要恢复的作业信息
      this.selectedJob = this.Jobs[index];
      this.showModal = true;
    },
    closeModal() {
      // 关闭弹窗
      this.showModal = false;
    },

    updatejob(index) {
      // 设置要恢复的作业信息
      this.selectedJob = this.Jobs[index];
      this.showjobDetail = true;
    },
    closeshowjobDetail() {
      // 关闭弹窗
      this.showjobDetail = false;
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

:deep(.el-link__inner) {
  color: rgb(64, 158, 255);
  font-size: 24px;
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
  height: 750px;
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
  border-top: 0.5px solid #000;
  border-bottom: 0.5px solid #000;
}

:deep(.JobBox .el-scrollbar__view) {

  width: 1499px;
}

:deep(.JobBox .el-table__header-wrapper) {
  width: 1515px;
}

:deep(.JobBox .el-table__body) {
  width: 1513px;
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

.detail {
  width: 1499px;
  color: #000;
  margin: 0;
}

:deep(.detail .el-table__cell) {
  color: #000;
  font-size: 16px;
  border-top: 0px solid #000 !important;
}

:deep(.detail .el-scrollbar__view) {
  width: 1495px;
}

:deep(.detail .el-table__header-wrapper) {
  width: 1499px;
}

:deep(.detail .el-table__body) {
  width: 1497px;
}

:deep(.JobBox .el-table__empty-text) {
  color: #000;
  background: rgb(255, 255, 255);
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

tbody tr:hover {
  background-color: #f1f1f1;
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
/* 上2按钮 */
:deep(.modalButtonBox button){
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none;
  color: rgb(227,255,255);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-left:20px;
  margin-right:0;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影 */
}
:deep(.modalButtonBox button:hover) {
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 鼠标悬停时颜色反转 */
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 阴影加深 */
}
/* 下三按钮 */
:deep(.jobbtn){
  background-color: rgb(255,255,255);
  color: rgb(0,119,194);
  border: 1px solid rgb(0, 119, 194);
  border-radius: 8px;
}
:deep(.jobbtn:hover){
  background-color: rgb(233,245,255);
  color: rgb(0,0,0);
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 阴影加深 */
}
</style>