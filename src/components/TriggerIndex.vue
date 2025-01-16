<template>
  <div class="container">
    <div>
      <input v-model="selectedJObName" placeholder="请输入触发器名" />
      <button>搜索</button>
    </div>
    <router-link to="/Job">前往任务页面</router-link>
    <div>
      <select v-model="selectGroup" @change="select(selectGroup)">
        <option>ALL</option>
        <option v-for="(group, index) in groups" :key="index">
          {{ group }}
        </option>
      </select>
    </div>
    <div class="JobBox">
      <table>
        <thead>
          <tr>
            <th>任务名</th>
            <th>任务分组</th>
            <th>任务类名</th>
            <th>触发器名</th>
            <th>触发器分组</th>
            <th>触发器状态</th>
            <th>任务状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in filteredJobs" :key="index">
            <td>{{ job.jobname }}</td>
            <td>{{ job.jobgroup }}</td>
            <td>{{ job.jobclassname }}</td>
            <td>{{ job.triggername }}</td>
            <td>{{ job.triggergroup }}</td>
            <td>{{ job.triggers_state }}</td>
            <td class="buttonBox">
              <!-- 增删改查启停 -->
              <button @click="resumeJob(index)">恢复触发器</button>
              <button @click="pauseJob(index)">停止触发器</button>
              <button @click="deleteJob(index)">删除触发器</button>
              <button @click="replacetrigger(index)">更改触发器参数</button>
            </td>
          </tr>
        </tbody>
      </table>
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
</template>
    
  <script>
import axios from "axios";
import updateTrigger from "../components/updateTrigger.vue";
export default {
  components: { updateTrigger },
  data() {
    return {
      Jobs: [],
      groups: [],
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

    async select(selectGroup) {
      // if(selectGroup === "ALL"){
      //   this.getUsedJob();
      //   return;
      // }
      // try {
      //   const response = await axios.post(
      //     "http://114.132.71.250:8002/task/Select/FINDjobBYgroup?group="+selectGroup
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

    replacetrigger(index) {
      // 设置要恢复的作业信息
      this.selectedJob = this.Jobs[index];
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
  width: 100%;
  overflow: auto;
}

.JobBox {
  width: 100%;
  max-width: 1200px; /* 根据实际情况调整 */
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 固定表格布局 */
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  /* width: 20%; */
  word-wrap: break-word; /* 长单词或URL地址将自动换行到下一行 */
  white-space: normal; /* 允许文本自动换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 当内容超出时显示省略号 */
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td.buttonBox {
  white-space: normal; /* 按钮需要可以换行 */
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
</style>