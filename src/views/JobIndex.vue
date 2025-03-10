<template>
  <div class="container">
    <div class="jumpBox">
      <el-link :underline="false" @click="Go('TriggerIndex')">前往触发器管理页面<el-icon><Link /></el-icon></el-link>
      <div class="modalButtonBox">
        <el-button @click="jobModal" type="primary" class="addbtn">添加任务</el-button>
        <el-button @click="onloadModal" type="primary" class="addbtn">挂载触发器</el-button>
        <el-button type="primary" @click="Go('VirtualPlatform')">虚拟管理平台</el-button>
        <el-button type="primary" @click="Go('sseListener')">监控平台</el-button>
      </div>
    </div>

    <div class="topbox">
      <p class="title">任务管理</p>
      <div class="Button3Box">
        <el-button type="success" @click="showConfirm('resumeAllJob')" class="jobbtn">恢复所有任务</el-button>
        <el-button type="warning" @click="showConfirm('pauseAllJob')" class="jobbtn">停止所有任务</el-button>
        <el-button type="danger" @click="showConfirm('deleteAllJob')" class="jobbtn">删除所有任务</el-button>
      </div>
    </div>

    <div class="conterBox"> 
      <p class="selectedtitle">条件筛选</p>
      <div class="selectBox"> 
        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectGroup" class="select" @change="SelectGroup" placeholder="任务分组: 全部" @focus="getGroups()">
            <el-option :label="'任务分组: 全部'" :value=null />
            <el-option v-for="item in groups" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectName" class="select" :placeholder="defaultName" @focus="getJobName()">
            <el-option :label="defaultName" :value=null />
            <el-option v-for="item in names" :key="item" :label="'任务分组: ' + item" :value="item"/>
          </el-select>
        </div>
        
        <div class="inputnox" >
          <el-input v-model="selected" class="input1" placeholder="请输入">
            <template #prefix>
              <el-icon class="el-input__icon"><search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="search()">
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>

      <div class="box"> 
        <el-table :data="Table" class="JobBox" @expand-change="handleExpandChange" :expand-row-keys="expandedRows" :row-key="getRowKey">
            <el-table-column type="expand">
            <template #default="props">                                                                                                                                                                                                                                                                                                                                                                
              <el-table :data="props.row.triggerList" class="c" empty-text="暂时无数据,请确认该任务是否有触发器" v-loading="!props.row.loadDetails" element-loading-text="加载中..."  element-loading-background="rgba(255, 255, 255)">
              <el-table-column label="触发器分组" sortable prop="triggergroup" min-width="16" align="center"/>
              <el-table-column label="触发器名" sortable prop="triggername" min-width="16" align="center"/>
              <el-table-column label="任务类型" sortable prop="type" min-width="16" align="center"/>
              <el-table-column label="开始时间" sortable prop="startime" min-width="16" align="center"/>
              <el-table-column label="结束时间" sortable prop="endtime" min-width="16" align="center"/>
              <el-table-column label="触发器状态" sortable prop="triggers_state" min-width="16" align="center"/>
              <el-table-column min-width="28">
                <template #default="triggerProps">
                <el-button type="primary" @click="goToTriggerIndex(triggerProps.row)">查看详情</el-button>
                </template>
              </el-table-column>
              </el-table>
            </template>
            </el-table-column>
          <el-table-column label="任务分组" sortable prop="jobgroup" min-width="1" align="center"/>
          <el-table-column label="任务名" sortable prop="jobname" min-width="1" align="center"/>
          <el-table-column label="任务类名" sortable prop="jobclassname" min-width="1" align="center"/>
          <el-table-column label="任务描述" prop="description" min-width="3.5" align="center"/>
          <el-table-column label="触发器数" sortable prop="triggersNumbers" min-width="1" align="center"/>
          <el-table-column label="任务操作" min-width="2.5" align="center">
            <template #default="scope">
              <div style="display: flex;justify-content: space-between;">
                <div> 
                  <div class="b4"> 
                    <el-tooltip content="立即执行一次" placement="top">
                      <el-button type="success" @click="showConfirm('resumeJob', scope.row)" size="large" circle :disabled="isAllPaused">
                        <el-icon :size="24"><Refresh /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="恢复任务" placement="top">
                      <el-button type="success" @click="showConfirm('startNow', scope.row)" size="large" circle>
                        <el-icon :size="24"><VideoPlay /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </div>

                  <div class="b4"> 
                    <el-tooltip content="暂停任务" placement="bottom">
                      <el-button type="warning" @click="showConfirm('pauseJob', scope.row)" size="large" circle>
                        <el-icon :size="24"><VideoPause /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除任务" placement="bottom">
                      <el-button type="danger" @click="showConfirm('deleteJob', scope.row)" size="large" circle>
                        <el-icon :size="18"><Delete /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
                <div class="b2"> 
                  <div class="button2Box"> 
                    <el-button type="info" @click="replacetrigger(scope.row)">替换触发器</el-button>
                  </div>
                  <div class="button2Box"> 
                    <el-button type="info" @click="updatejob(scope.row)">修改任务详情</el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <TriggerModal ref="triggerModal" class="trmod" @getWhenAdd="SelectGroup" />
    <JobModal ref="jobModal" class="jobmod" @getWhenAdd="SelectGroup"/>
    <UpLoad ref="uploadModal" class="uploadmod"/>
    <transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container2">
            <div class="modal-body2">
              <ReplaceTriggerFromJob
                :jobinfo="selectedJob"
                v-if="showModal"
                @close="closeModal"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showjobDetail" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <JobDetail
                :jobinfo="selectedJob"
                v-if="showjobDetail"
                @close="closeshowjobDetail"
              ></JobDetail>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showupload" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container1">

            <div class="modal-body1">
              <UpLoad v-if="showupload"
              @close="closeshowupload"></UpLoad>
          </div>
            </div>
          </div>
        </div>
    </transition>
  </div>
</template>
    
  <script>
  // 回调
import axios from "axios";
import ReplaceTriggerFromJob from "../components/ReplaceTriggerFromJob.vue";
import JobDetail from "../components/JobDetail.vue";
import UpLoad from "../components/upload.vue";
import TriggerModal from '../components/onloadtrigger.vue';
import JobModal from '../components/AddJob.vue';
export default {
  components: {
    ReplaceTriggerFromJob,
    JobDetail,
    UpLoad,
    TriggerModal,
    JobModal,
  },
  data() {
  return {
    Jobs: [],
    expandedRows: [], // 用于存储当前展开的行的唯一标识
    groups: [],
    names: [],
    selectedJob: {},
    selectGroup: "",
    defaultName:'请先选择任务分组',
    selectName: null,
    selected: "",
    showModal: false,
    showjobDetail: false,
    showupload: false,
    isAllPaused: null,
  };
},
  computed: {
    Table() {
      if (this.selectName) {
      return this.Jobs.filter(job => job.jobname === this.selectName);
      }
      return this.Jobs;
    }
  },
  methods: {

    async goToTriggerIndex(row) {
      console.log(row);
      this.$router.push({ 
        path: '/TriggerIndex', 
        query: { nameForJob: row.triggername, groupForJob: row.triggergroup } 
      });
    },

    async search() {
      this.SelectGroup();
      if (this.selected !== "") {
        const searchTerm = this.selected.toLowerCase();
        this.jobs = this.Jobs.filter(job => 
          job.jobname.toLowerCase().includes(searchTerm) ||
          job.jobgroup.toLowerCase().includes(searchTerm) ||
          job.jobclassname.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
        // let url;
        // if (this.selectGroup) {
        //   url =  "/task/Select/FINDjobBYgroup?group=" + this.selectGroup;
        // }
        // else{
        //   url =  "/task/Select/jobs";
        // }
        // this.Jobs = (await axios.post(url)).data.data.filter(job => 
        //   job.jobname.toLowerCase().includes(searchTerm) ||
        //   job.jobgroup.toLowerCase().includes(searchTerm) ||
        //   job.jobclassname.toLowerCase().includes(searchTerm) ||
        //   job.description.toLowerCase().includes(searchTerm)
        // );
      }
    },
    handleExpandChange(row, expanded) {
      const rowKey = this.getRowKey(row);

      if (expanded) {
        // 如果行被展开，则将其加入到 expandedRows 数组中
        if (!this.expandedRows.includes(rowKey)) {
          this.expandedRows.push(rowKey);
          this.load(row);
        }
        else {
        console.log(this.expandedRows);
        // 如果行被折叠，则从 expandedRows 数组中移除
        this.expandedRows = this.expandedRows.filter(key => key !== rowKey);
        }
       }

      // if (expanded) {  // 根据loadDetails判定是否已经加载了数据，并且只有在展开时才加载数据
      //   this.load(row);
      // }
    },
    getRowKey(row) {
      // 返回行的唯一标识，可以是任意唯一的字段
      return `${row.jobname}-${row.jobgroup}`;
    },
    load(row) {
      console.log('load')
      // 动态添加 triggerList 和 loadDetails 属性
      row.triggerList = row.triggerList || [];
      row.loadDetails = false;

      axios.post(`/task/Select/FINDtriBYjob`, null, {
        params: {
          jobname: row.jobname,
          jobgroup: row.jobgroup
        }
      }).then(response => {
        console.log(response)
        row.triggerList = response.data.data;
        row.loadDetails = true; // 加载成功之后更新标识

        // 自动展开当前行
        const rowKey = this.getRowKey(row);
        if (!this.expandedRows.includes(rowKey)) {
          this.expandedRows.push(rowKey);
        }

        this.$message({
          showClose: true,
          message: '数据加载成功',
          grouping: true,
          type: 'success'
        });
      }).catch(error => {
        console.error("Error loading data:", error);
        this.$message({
          showClose: true,
          message: '数据加载失败',
          grouping: true,
          type: 'error'
        });
      });
    },

    Go(address){
      this.$router.push({ path: '/'+address });
    },
    onloadModal() {
      this.$refs.triggerModal.onloadModal();
    },
    jobModal() {
      this.$refs.jobModal.jobModal();
    },
    uploadModal() {
      this.$refs.uploadModal.uploadModal();
    },
    async getUsedJob() {
      try {
        const response = await axios.post(
          "/task/Select/jobs"
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
          "/task/Select/jobgroupall"
        );
        console.log(response)
        this.groups = response.data.data;
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    async SelectGroup() {
      console.log(this.selectGroup);
      if(this.selectGroup == null || this.selectGroup == "" || this.selectGroup == undefined){
        this.getUsedJob();
        this.expandedRows = [];
        this.names = [];
        this.selectName = null;
        this.selected = "";
        this.defaultName = '请先选择任务分组';
        return;
      }
      try {
        const response = await axios.post(
          "/task/Select/FINDjobBYgroup?group=" + this.selectGroup)
          this.Jobs = response.data.data;
          this.expandedRows = [];

        this.selectName = null;
        await this.getJobName();
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    async getJobName(){
      const response = await axios.post(
          "/task/Select/jobDetailname?jobgroup=" + this.selectGroup);
          console.log(response)
          this.names = response.data.data;
          this.defaultName = '请选择任务名';
    },

    async resumeJob(row) {
      try {
        const response = await axios.post(
          "/task/Start/resumeNow?name=" +
          row.jobname +
            "&group=" +
          row.jobgroup
        ).then(response => {
          console.log(response);
          if(response.data.data == 'success'){
            this.$message({
              showClose: true,
              message: '任务已执行',
              grouping: true,
              type: 'success'
            });
          }else{
            this.$message({
              showClose: true,
              message: '执行任务失败',
              grouping: true,
              type: 'error'
            });
          }
        })
        
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async startNow(row) {
      try {
        const response = await axios.post(
          "/task/Start/resume?name=" +
          row.jobname +
            "&group=" +
          row.jobgroup
        ).then(response => {
          console.log(response);
          if(response.data.data == 'success'){
          this.$message({
            showClose: true,
            message: '任务已恢复',
            grouping: true,
            type: 'success'
          });
        }else{
          this.$message({
            showClose: true,
            message: '恢复任务失败',
            grouping: true,
            type: 'error'
          });
        }
        const rowKey = this.getRowKey(row);
        if (this.expandedRows.includes(rowKey)) {
          this.load(row);
        }
        });



        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async pauseJob(row) {
      try {
        const response = await axios.post(
          "/task/Pause/job?jobname=" +
          row.jobname +
            "&jobgroup=" +
          row.jobgroup
        ).then(response => {
          console.log(response);

          if(response.data.data == 'success'){
            this.$message({
              showClose: true,
              message: '任务已停止',
              grouping: true,
              type: 'success'
            });
          }else{
            this.$message({
              showClose: true,
              message: '停止任务失败',
              grouping: true,
              type: 'error'
            });
          }
          const rowKey = this.getRowKey(row);
        if (this.expandedRows.includes(rowKey)) {
          this.load(row);
        }
          // 重置表单
        })
        
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async deleteJob(row) {
      try {
        const response = await axios.post(
          "/task/Delete/job?name=" +
          row.jobname +
            "&group=" +
          row.jobgroup
        );
        console.log(response);
        if(response.data.data == 'success'){
          this.$message({
            showClose: true,
            message: '任务已删除',
            grouping: true,
            type: 'success'
          });
          this.SelectGroup();
        }else{
          this.$message({
            showClose: true,
            message: '删除任务失败',
            grouping: true,
            type: 'error'
          });
        }
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    replacetrigger(row) {
      // 设置要恢复的作业信息
      this.selectedJob = row;
      this.showModal = true;
    },
    closeModal() {
      this.SelectGroup();
      // 关闭弹窗
      this.showModal = false;
    },

    updatejob(row) {
      // 设置要恢复的作业信息
      this.selectedJob = row;
      this.showjobDetail = true;
    },
    closeshowjobDetail() {
      // 关闭弹窗
      this.SelectGroup();
      this.showjobDetail = false;
    },

    upload() {
      this.showupload = true;
    },

    closeshowupload() {
      // 关闭弹窗
      this.showupload = false;
    },
    //二级弹窗
    showConfirm(action, row = null) {
      const actionMap = {
        resumeJob: '立即执行一次',
        startNow: '恢复',
        pauseJob: '暂停',
        deleteJob: '删除',
        resumeAllJob: '恢复所有任务',
        pauseAllJob: '停止所有任务',
        deleteAllJob: '删除所有任务'
      };
      const message = row
        ? `确定要${actionMap[action]}任务 "${row.jobname}" 吗？`
        : `确定要${actionMap[action]}吗？`;
      ElMessageBox.confirm(message, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 用户点击“确定”按钮
        if (action === 'resumeJob') {
          this.resumeJob(row);
        } else if (action === 'startNow') {
          this.startNow(row);
        } else if (action === 'pauseJob') {
          this.pauseJob(row);
        } else if (action === 'deleteJob') {
          this.deleteJob(row);
        } else if (action === 'resumeAllJob') {
          this.resumeAllJob();
        } else if (action === 'pauseAllJob') {
          this.pauseAllJob();
        } else if (action === 'deleteAllJob') {
          this.deleteAllJob();
        }
      }).catch(() => {
        // 用户点击“取消”按钮
        console.log('取消操作');
      });
    },
    async resumeAllJob() {
      try {
        const response = await axios.post(
          "/task/Start/resumeall"
        );
        console.log(response);
        //this.getUsedJob();
        this.expandedRows = [];
        this.resumeall = [];
        this.checkAllPaused()
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async pauseAllJob() {
      try {
        const response = await axios.post(
          "/task/Pause/alljob"
        );
        console.log(response);
        //this.getUsedJob();
        this.expandedRows = [];
        this.resumeall = [];
        this.checkAllPaused()
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async deleteAllJob() {
      try {
        const response = await axios.post(
          "/task/Delete/alljob"
        );
        console.log(response);
        this.getUsedJob();
        this.resumeall = [];
        this.checkAllPaused()
        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async checkAllPaused() {
  try {
    const response = await axios.post(
      "/task/Select/isAllPaused"
    );
    console.log(response);
    this.isAllPaused = response.data.data; 
  } catch (error) {
    console.error("请求失败，请检查网络连接", error);
    this.isAllPaused = false; 
  }
},
watch: {
  showModal(newVal) {
    if (!newVal) {
      this.SelectGroup();
    }
  },
  showjobDetail(newVal) {
    if (!newVal) {
      this.SelectGroup();
    }
  },
},

  init(){
    this.getUsedJob();
    this.expandedRows = [];
    this.getGroups();
    this.checkAllPaused();
  }
  },
  beforeRouteEnter(to, from, next) {
    // 注意：在 beforeRouteEnter 守卫中，组件实例还未被创建，
    // 因此你不能直接访问 this。但是，你可以通过 next 函数的回调来访问实例。
    next(vm => {
      // vm 是组件实例
      vm.init();
    });
  }
  // mounted() {
  //   this.getUsedJob();
  //   this.expandedRows = [];
  //   this.getGroups();
  //   this.checkAllPaused();
  // },
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
  background:linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
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
  justify-content: right;
  gap: 20px;
  padding-right: 20px;
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
  justify-content: center;
  align-content: center;
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
  /* display: flex;
  justify-content: center; */
}

.c{
  width: 1483px;
  min-height: 120px;
}

:deep(.c .cell){
  height: auto;
  color: #000;
  font-size: 16px;
  padding: 3;
  /* display: flex;
  justify-content: center; */
}



:deep(.JobBox .caret-wrapper){
  width: 0px;
  margin-top: 0px;
}

:deep(.c .caret-wrapper){
  width: 0px;
  margin-top: 6px;
}

:deep(.JobBox .el-table__cell){
  border-top: 1px solid #000;
  padding: 10px;
}

:deep(.c .el-table__cell){
  border-top: 0px solid #000;
  padding: 5px;
}

:deep(.JobBox .el-scrollbar__view) {
  width: 1499px;
}

:deep(.c .el-scrollbar__view) {
  width: 1483px;
}

:deep(.JobBox .el-table__header-wrapper) {
  width: 1483px;
}

:deep(.c .el-table__header-wrapper) {
  width: 1483px;
}

:deep(.JobBox .el-table__body) {
  width: 1513px;
}

:deep(.JobBox .el-table__empty-text) {
  color: #000;
  background: rgb(255, 255, 255);
}

.b4{
  display: flex;
  margin-top: 8px;
  padding-left: 20px;
  margin-right: 12px;
}

.button2Box{
  margin-top: 8px;
  padding-right: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.button2Box button{
  font-size: 18px;
  width: 184px;
  height: 40px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none; /* 去除边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.button2Box button:hover{
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
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


.modal-mask {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保与父元素高度一致 */
}

.modal-container {
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-container1 {
  width: 1440px; /* 根据需要调整 */
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}


.modal-container2 {
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-body {
  width: 400px;
  height: 500px;
  margin: 20px 0;
}

.modal-body1 {
  width: 1440px;
  margin: 20px 0;
}

.modal-body2 {
  width: 950px;
  height: 740px;
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

/* .modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
} */

:deep(.el-dialog.jobmod){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 864px;
  height: 920px;
  border-radius: 14px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}
:deep(.el-dialog.trmod ){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 460px;
  height: 928px;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  z-index: 4;
}
:deep(.el-dialog.uploadmod ){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 1440px;
  /* height: 650px; */
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}
 /* 上三按钮 */
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
/* 下三按钮 */
:deep(.modalButtonBox button:hover) {
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 鼠标悬停时颜色反转 */
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 阴影加深 */
}

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

:deep(.el-link__inner){
  color:rgb(0,119,194);
}


:deep(.b4 .el-button--success) {
  background: linear-gradient(to left, rgb(72, 236, 121), rgb(1, 158, 48)); 
  color: #ffffff !important;
  border: none;
}
:deep(.b4 .el-button--success:hover) {
  background: linear-gradient(to right, rgb(72, 236, 121), rgb(1, 158, 48)); 
}
:deep(.b4 .el-button--success:disabled) {
  background: linear-gradient(to left, rgb(179, 179, 179), rgb(68, 68, 68)); 
  cursor: not-allowed; /* 鼠标样式 */
}
:deep(.b4 .el-button--warning) {
  background: linear-gradient(to left, rgb(240, 207, 154), rgb(252, 172, 43));
  color: #ffffff !important;
  border: none;
}
:deep(.b4 .el-button--warning:hover) {
  background: linear-gradient(to right, rgb(240, 207, 154), rgb(252, 172, 43)); 
}
:deep(.b4 .el-button--danger) {
  background: linear-gradient(to left, rgb(236, 124, 124), rgb(235, 18, 18)); 
  color: #ffffff !important;
  border: none;
}
:deep(.b4 .el-button--danger:hover) {
  background: linear-gradient(to right, rgb(236, 124, 124), rgb(235, 18, 18)); 
}
</style>