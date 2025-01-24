<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>触发器挂载</h2>
      <!-- 表单内容 -->
      <div>
        <span>任务分组</span>
        <select v-model="jobgroup" @change="select(jobgroup)">
          <option v-for="(group, index) in jobgroups" :key="index">
            {{ group }}
          </option>
        </select>
        <span>任务名</span>
        <select v-model="job">
          <option v-for="(job, index) in jobs" :key="index" :value="job">
            {{ job.jobname }}
          </option>
        </select>
      </div>

      <div>
        <span>触发器类型</span>
        <select v-model="selecttrigger">
          <option>SimpleTrigger</option>
          <option>CronTrigger</option>
          <option>DailyTimeIntervalTrigger</option>
          <option>CalendarIntervalTrigger</option>
        </select>
        <br />
        <span>任务优先级</span>
        <input type="number" v-model="priority" />
        <br />
        <span>是否使用自定义触发器</span>
        <select v-model="isCustomTrigger">
          <option>false</option>
          <option>true</option>
        </select>
        <br />
        <div v-if="this.isCustomTrigger === 'true'">
          <span>自定义触发器</span>
          <select v-model="this.trigger">
            <option v-for="(trigger, index) in triggers" :key="index">
              {{ trigger }}
            </option>
          </select>
        </div>

        <div v-if="isCustomTrigger === 'false'">
          <span>触发器名称</span>
          <input v-model="triggername" />
          <br />
          <span>触发器分组</span>
          <input v-model="triggergroup" />
        </div>
        <button @click="replace">挂载触发器</button>
      </div>
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
  width: 80%;
  max-width: 600px;
  z-index: 10001;
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
</style>