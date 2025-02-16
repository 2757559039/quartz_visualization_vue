<template>
  <div class="container">
    <div class="jumpBox">
      <el-link :underline="false" @click="Go('JobIndex')">前往任务管理页面<el-icon><Link /></el-icon></el-link>
      <div class="modalButtonBox">
        <el-button @click="jobModal" type="primary" class="addbtn">添加任务</el-button>
        <el-button @click="onloadModal" type="primary" class="addbtn">挂载触发器</el-button>
        <el-button type="primary" @click="uploadModal">上传类</el-button>
      </div>
    </div>

    <div class="topbox">
      <p class="title">触发器管理</p>
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
          <el-select v-model="selectGroup" class="select" @change="SelectGroup" placeholder="触发器分组:全部">
            <el-option :label="'触发器分组: 全部'" :value=null />
            <el-option v-for="item in groups" :key="item" :label="'触发器分组: ' + item" :value="item"/>
          </el-select>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"> 
          <el-select v-model="selectName" class="select" :placeholder="defaultName">
            <el-option :label="defaultName" :value=null />
            <el-option v-for="item in names" :key="item" :label="'触发器名: ' + item" :value="item"/>
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
              <div>
                <!-- <p>{{ props.row.triggerList }}</p> -->
                <div class="text">
                  <span class="left">是否使用自定义触发器:</span><span class="right">{{ props.row.triggerList.isConcurrentExectionDisallowed }}</span>
                </div>
                
                <div v-if="!props.row.triggerList.isConcurrentExectionDisallowed === 'false'" class="text">
                  <span class="left">自定义触发器:</span><span class="right">{{ props.row.triggerList.trigger }}</span>
                </div>
                <div v-if="props.row.triggerList.isConcurrentExectionDisallowed === 'false'">
                  <div v-if="props.row.type === 'SimpleTriggerImpl'">
                    <div class="text">
                      <span class="left">触发间隔时间:</span><span class="right">{{ props.row.triggerList.simpletimesecond }} 秒</span>
                    </div>
                    <div class="text">
                      <span class="left">触发器执行次数:</span><span class="right">{{ props.row.triggerList.repeatcount }} 次</span>
                    </div>
                  </div>
                  <div v-else-if="props.row.type === 'CronTriggerImpl'">
                    <div class="text">
                      <span class="left">cron表达式:</span><span class="right">{{ props.row.triggerList.cronexpression }}</span>
                    </div>
                  </div>
                  <div v-else-if="props.row.type === 'DailyTimeIntervalTriggerImpl'">
                    <div class="text"><span class="left">触发器时间间隔单位:</span><span class="right">{{ props.row.triggerList.dailytime }}</span></div>
                    <div class="text"><span class="left">触发器间隔数:</span><span class="right">{{ props.row.triggerList.dailytimenum }}</span></div>
                    <div class="text"><span class="left">触发器总执行次数:</span><span class="right">{{ props.row.triggerList.dailyrepeatcount }} 次</span></div>
                    <div class="text"><span class="left">执行日选择(星期):</span><span class="right">{{ props.row.triggerList.dailyworkday }}</span></div>
                  </div>
                  <div v-else-if="props.row.type === 'CalendarIntervalTriggerImpl'">
                    <div class="text"><span class="left">触发器时间间隔单位:</span><span class="right">{{ props.row.triggerList.calendartime }}</span></div>
                    <div class="text"><span class="left">触发器间隔数:</span><span class="right">{{ props.row.triggerList.calendarnum }}</span></div>
                    <div class="text"><span class="left">是否使用夏令时:</span><span class="right">{{ props.row.triggerList.preserveHourOfDayAcrossDaylightSavings }}</span></div>
                    <div class="text"><span class="left">是否设置当小时不存在时是否跳过这一天:</span><span class="right">{{ props.row.triggerList.skipDayIfHourDoesNotExist }}</span></div>
                  </div>
                  <div> 
                    <div class="text"></div>
                    <div class="text"></div>
                    <div class="text"></div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="触发器名" prop="triggername" min-width="90"/>
          <el-table-column label="触发器分组" sortable prop="triggergroup" min-width="120"/>
          <el-table-column label="触发器类型" sortable prop="type" min-width="120"/>
          <el-table-column label="优先级" sortable prop="priority" min-width="80" />
          <el-table-column label="触发器状态" sortable prop="triggers_state" min-width="120"/>
          <el-table-column label="开始时间" sortable prop="startime" min-width="120"/>
          <el-table-column label="结束时间" sortable prop="endtime" min-width="120"/>
          <el-table-column label="任务操作" min-width="151">
            <template #default="scope">
              <div class="buttonBox">
                <div class="button3Box"> 
                  <el-tooltip content="恢复任务" placement="top">
                    <el-button type="success" @click="showConfirm('startNow', scope.row)" size="large" circle>
                      <el-icon :size="24"><VideoPlay /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="暂停任务" placement="top">
                    <el-button type="warning" @click="showConfirm('pauseJob', scope.row)" size="large" circle>
                      <el-icon :size="24"><VideoPause /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除任务" placement="top">
                    <el-button type="danger" @click="showConfirm('deleteJob', scope.row)" size="large" circle>
                      <el-icon :size="24"><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
                <div class="button2Box"> 
                  <el-button type="info" @click="replacetrigger(scope.row)">更改触发器参数</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <TriggerModal ref="triggerModal" class="trmod"/>
    <JobModal ref="jobModal" class="jobmod"/>
    <UpLoad ref="uploadModal" class="uploadmod"/>
    <transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <!-- 动态插入子组件 -->
              <updateTrigger
                :jobinfo="selectedJob"
                v-if="showModal"
                @close="closeModal"
              ></updateTrigger>
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
  </div>
</template>
    
  <script>
import axios from "axios";
import updateTrigger from "../components/updateTrigger.vue";
import TriggerModal from '../components/onloadtrigger.vue';
import UpLoad from "../components/upload.vue";
import JobModal from '../components/AddJob.vue';
export default {
  components: { 
    updateTrigger,
    TriggerModal,
    JobModal,
    UpLoad,
   },
  data() {
    return {
      trigger: [
      ],
      groups: [],
      names: [],
      selectedJob: {},
      selectGroup: "",
      selectName: "",
      selected: "",
      defaultName: '请选择触发器分组',
      selectedJObName: "",
      expandedRows: [],
      showModal: false,
      showupload: false,
    };
  },

  computed: {
    Table() {
      if (this.selectName) {
      return this.trigger.filter(trigger => trigger.triggername === this.selectName);
      }
      return this.trigger;
    }
  },
  methods: {
    search() {
      if (this.selected !== "") {
        const searchTerm = this.selected.toLowerCase();
        this.trigger = this.trigger.filter(trigger => 
        trigger.triggername.toLowerCase().includes(searchTerm) ||
        trigger.triggergroup.toLowerCase().includes(searchTerm) ||
        trigger.priority.toLowerCase().includes(searchTerm) ||
        trigger.type.toLowerCase().includes(searchTerm)
        );
      } else {
        this.getUsedTrigger();
      }
    },

    handleExpandChange(row, expanded) {
      const rowKey = this.getRowKey(row);

      if (expanded) {
        // 如果行被展开，则将其加入到 expandedRows 数组中
        if (!this.expandedRows.includes(rowKey)) {
          this.expandedRows.push(rowKey);
        }
        else {
        console.log(this.expandedRows);
        // 如果行被折叠，则从 expandedRows 数组中移除
        this.expandedRows = this.expandedRows.filter(key => key !== rowKey);
        }
       }

      if (!row.loadDetails && expanded) {  // 根据loadDetails判定是否已经加载了数据，并且只有在展开时才加载数据
        this.load(row);
      }
    },
    getRowKey(row) {
      // 返回行的唯一标识，可以是任意唯一的字段
      return `${row.triggername}-${row.triggergroup}`;
    },
    load(row) {
    console.log('load');
    // 动态添加 triggerList 和 loadDetails 属性
    row.triggerList = row.triggerList || [];
    row.loadDetails = row.loadDetails !== undefined ? row.loadDetails : false;

    axios.post(`http://114.132.71.250:8002/task/Select/triggerDetail`, null, {
      params: {
        triggername: row.triggername,
        triggergroup: row.triggergroup
      }
    }).then(response => {
      console.log(response);
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
          type: 'success'
        });
    }).catch(error => {
      console.log("Error loading data:", error);
      this.$message({
        showClose: true,
        message: '数据加载失败',
        type: 'error'
      });
    });
    console.log(row)
  },

    onloadModal() {
      this.$refs.triggerModal.onloadModal();
    },
    jobModal() {
      this.$refs.jobModal.jobModal();
    },
    upload() {
      this.showupload = true;
    },
    closeshowupload() {
      // 关闭弹窗
      this.showupload = false;
    },
    uploadModal() {
      this.$refs.uploadModal.uploadModal();
    },
    Go(address) {
      this.$router.push({ path: '/'+address });
    },

    async SelectGroup() {
      console.log(this.selectGroup);
      if(this.selectGroup == null){
        this.getUsedTrigger();
        this.expandedRows = [];
        this.names = [];
        this.selectName = null;
        this.selected = "";
        this.defaultName = '请选择触发器分组';
        return;
      }
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Select/FINDtriggerBYgroup?triggergroup=" + this.selectGroup)
          this.trigger = response.data.data;
          this.expandedRows = [];

        this.selectName = null;
        const response1 = await axios.post(
          "http://114.132.71.250:8002/task/Select/Triggername?triggergroup=" + this.selectGroup);
          console.log(response1);
          this.names = response1.data.data;
          this.defaultName = '请选择触发器名';
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    async getUsedTrigger() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Select/triggers"
        );
        console.log(response);
        this.trigger = response.data.data;

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
          "http://114.132.71.250:8002/task/Select/triggergroupall"
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
    //二级弹窗
    async showConfirm(action, row = null) {
      const actionMap = {
        resumeJob: '立即执行一次',
        startNow: '恢复',
        pauseJob: '暂停',
        deleteJob: '删除',
        resumeAllJob: '恢复所有任务',
        pauseAllJob: '停止所有任务',
        deleteAllJob: '删除所有任务'
      };

      const isAllPaused = (await axios.post('http://114.132.71.250:8002/task/Select/isAllPaused')).data.data;
      if(isAllPaused && (action === 'startNow' || action === 'pauseJob')){
        const message = '所有任务已冻结,请先解冻再操作';
      ElMessageBox.confirm(message, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      return;
      }
      else{
        const message = row
        ? `确定要${actionMap[action]}触发器 "${row.triggername}" 吗？`
        : `确定要${actionMap[action]}吗？`;
      ElMessageBox.confirm(message, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 用户点击“确定”按钮
        if (action === 'startNow') {
          this.resumeJob(row);
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
      this.getUsedTrigger();
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
      this.getUsedTrigger();
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
      this.getUsedTrigger();
    },

    async resumeJob(row) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Start/resumetri?triname=" +
          row.triggername +
            "&trigroup=" +
            row.triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedTrigger();
    },
    async pauseJob(row) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Pause/trigger?triname=" +
          row.triggername +
            "&trigroup=" +
            row.triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedTrigger();
    },
    async deleteJob(row) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Delete/jobUNtri?triggername=" +
          row.triggername +
            "&triggergroup=" +
            row.triggergroup
        );
        console.log(response);

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
      this.getUsedTrigger();
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
    init() {
      this.getUsedTrigger();
      this.getGroups();
    },
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
  //   this.getUsedTrigger();
  //   this.getGroups();
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
  justify-content: flex-end;
  gap: 20px;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
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
  height: 750px;
  color: #000;
  margin: 0;
  border-radius: 5px;
}

.text{
  width: 400px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 0px;
  margin-bottom: 10px;
  margin-left: 40px;
}

/* .left {
  width: 200px;
  text-align: center;
  word-wrap: break-word;
}

.right {
  width: 200px;
  text-align: center;
  word-wrap: break-word;
} */

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
  margin-top: 10px;
}

.button2Box{
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.button2Box button{
  font-size: 18px;
  width: 144px;
  height: 40px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none; /* 去除边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.button2Box button:hover{
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
}


.buttonBox {
  width: 144px;
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
  /* display: table; */
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保与父元素高度一致 */
}

.modal-container {
  width: 850px;
  height: 600px;
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

:deep(.el-dialog.jobmod){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 750px;
  /* height: 650px; */
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}
:deep(.el-dialog.trmod ){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 390px;
  /* height: 650px; */
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
</style>