<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>触发器挂载</h2>
      <!-- 表单内容 -->
      <div class="form-group">
        <label>任务分组</label>
        <select v-model="jobgroup" @change="select(jobgroup)">
          <option v-for="(group, index) in jobgroups" :key="index">
            {{ group }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>任务名</label>
        <select v-model="job">
          <option v-for="(job, index) in jobs" :key="index" :value="job">
            {{ job.jobname }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>触发器类型</label>
        <select v-model="selecttrigger">
          <option>SimpleTrigger</option>
          <option>CronTrigger</option>
          <option>DailyTimeIntervalTrigger</option>
          <option>CalendarIntervalTrigger</option>
        </select>
      </div>
      <div class="form-group">
        <label>任务优先级</label>
        <input type="number" v-model="priority" />
      </div>
      <div class="form-group">
        <label>自定义触发器</label>
        <select v-model="isCustomTrigger">
          <option>false</option>
          <option>true</option>
        </select>
      </div>
      <div v-if="this.isCustomTrigger === 'true'" class="form-group">
        <label>自定义触发器</label>
        <select v-model="this.trigger">
          <option v-for="(trigger, index) in triggers" :key="index">
            {{ trigger }}
          </option>
        </select>
      </div>

      <div v-if="isCustomTrigger === 'false'" class="form-group">
        <label>触发器名称</label>
        <input v-model="triggername" />
      </div>
      <div v-if="isCustomTrigger === 'false'" class="form-group">
        <label>触发器分组</label>
        <input v-model="triggergroup" />
      </div>
      <button @click="replace">挂载触发器</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isVisible: false,
      jobgroups: [],
      jobgroup: "group1",
      jobs: [],
      job: "",
      priority: "",
      selecttrigger: "",
      isCustomTrigger: "false",
      triggername: "",
      triggergroup: "",
      triggers: []
    };
  },
  methods: {
    onloadModal() {
      this.isVisible = true;
    },
    closeModal() {
      this.isVisible = false;
    },
    async getjobgroups() {
      try {
        const response = await axios.post("http://114.132.71.250:8002/task/Select/jobgroupall");
        this.jobgroups = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async select(jobgroup) {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Select/FINDjobBYgroup?group=" + jobgroup
        );
        this.jobs = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getTrigger() {
      try {
        const response = await axios.post("http://114.132.71.250:8002/task/Reflect/triggerclass");
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async replace() {
      // 处理挂载触发器逻辑
      console.log("挂载触发器");
    }
  },
  created() {
    this.getTrigger();
    this.getjobgroups();
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  height: 500px;
  max-width: 600px;
  z-index: 10001;
  border-radius: 14px;

}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

h2 {
  margin-top: 0;
  font-size: 18px;
  color: #333;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-group label {
  min-width: 120px; /* 确保标签有足够的宽度 */
  margin-right: 10px;
  text-align: right; /* 标签右对齐 */
}

select,
input {
  flex: 1; /* 让输入框占据剩余空间 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); 
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); 
}
</style>