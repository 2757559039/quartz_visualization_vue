<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>任务配置</h2>
      <div>
        <span>任务名</span>
        <input v-model="jobName" />
        <br />
        <span>任务分组</span>
        <input v-model="jobGroup" />
        <br />
        <span>任务类名</span>
        <select v-model="jobClassName">
          <option v-for="(name, index) in jobClassNameGroup" :key="index">
            {{ name }}
          </option>
        </select>
        <br />
        <span>任务描述</span>
        <input v-model="jobDescription" />
        <br />
        <span>选择触发器</span>
        <select v-model="trigger">
          <option>SimpleTrigger</option>
          <option>CronTrigger</option>
          <option>DailyTimeIntervalTrigger</option>
          <option>CalendarIntervalTrigger</option>
        </select>
        <br />
        <span>任务时间</span>
        <br />
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="getTimeRange"
        />
        <br />
        <span>任务优先级</span>
        <input type="number" v-model="priority" />
        <br />
        <span>是否使用自定义JobDetail </span>
        <select v-model="isCustomJobDetail">
          <option>true</option>
          <option>false</option>
        </select>
        <br />
        <p v-if="isCustomJobDetail === 'true'">
          <span>JobDetail</span>
          <select v-model="jobDetail">
            <option v-for="(JobDetail, index) in JobDetails" :key="index">
              {{ JobDetail }}
            </option>
          </select>
        </p>
        <div>
          <span>是否使用自定义触发器</span>
          <select v-model="isCustomTrigger">
            <option>true</option>
            <option>false</option>
          </select>
          <br />

          <div v-if="isCustomTrigger === 'true'">
            <span>选择触发器实现类</span>
            <select v-model="selecttrigger">
              <option v-for="(trigger, index) in triggers" :key="index">
                {{ trigger }}
              </option>
            </select>
          </div>
          <div v-if="isCustomTrigger === 'false'">
            <span>触发器名</span>
            <input v-model="triggername" />
            <br />
            <span>触发器名组</span>
            <input v-model="triggergroup" />
          </div>

          <div v-if="trigger === 'SimpleTrigger' && isCustomTrigger === 'false'">
            <span>触发时间间隔</span>
            <input v-model="simpletimesecond" placeholder="单位为秒" />
            <br />
            <span>触发器执行次数</span>
            <input v-model="repeatcount" />
          </div>

          <div v-else-if="trigger === 'CronTrigger' && isCustomTrigger === 'false'">
            <span>cron字段</span>
            <input v-model="cronexpression" placeholder="请输入cron格式字段" />
          </div>

          <div
            v-else-if="
              trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'
            "
          >
            <span>触发器时间间隔单位</span>
            <select v-model="calendartime">
              <option>second</option>
              <option>minute</option>
              <option>hour</option>
              <option>day</option>
              <option>month</option>
              <option>year</option>
            </select>
            <br />
            <span>触发器间隔次数</span>
            <input v-model="calendarnum" />
            <br />
            <span>是否使用夏令时</span>
            <select v-model="preserveHourOfDayAcrossDaylightSavings">
              <option>true</option>
              <option>false</option>
            </select>
            <span>设置当小时不存在时是否跳过这一天</span>
            <select v-model="skipDayIfHourDoesNotExist">
              <option>true</option>
              <option>false</option>
            </select>
            <br />
            <span>设置时区</span>
            <input v-model="timezone" />
          </div>

          <div
            v-else-if="
              trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'
            "
          >
            <span>触发器时间间隔单位</span>
            <select v-model="dailytime">
              <option>second</option>
              <option>minute</option>
              <option>hour</option>
              <option>day</option>
              <option>month</option>
              <option>year</option>
            </select>
            <br />
            <span>触发器间隔次数</span>
            <input v-model="dailynum" />
            <br />
            <span>总执行次数</span>
            <input v-model="dailyrepeatcount" />
            <br />
            <label v-for="(option, index) in options" :key="index">
              <input type="checkbox" :value="option" v-model="dailyworkday" />
              {{ option }}
            </label>
          </div>
        </div>
        <button @click="addjob">增加任务</button>
        <button @click="addfreejob">增加空闲任务</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  data() {
    return {
      triggers: [],
      jobName: "",
      jobGroup: "",
      jobClassName: "",
      jobClassNameGroup: [],
      jobDescription: "",
      timeRange: [],
      startTime: ref(""),
      endTime: ref(""),
      priority: 5,
      selecttrigger: "",
      trigger: "",
      isCustomJobDetail: "false",
      JobDetails: [],
      jobDetail: "",
      isCustomTrigger: "false",
      triggername: "",
      triggergroup: "",
      simpletimesecond: "",
      repeatcount: "",
      cronexpression: "",
      calendartime: "second",
      calendarnum: "",
      preserveHourOfDayAcrossDaylightSavings: "false",
      skipDayIfHourDoesNotExist: "false",
      timezone: "Asia/Shanghai",
      dailytime: "second",
      dailynum: "",
      dailyrepeatcount: "",
      dailyworkday: [],
      options: ["1", "2", "3", "4", "5", "6", "7", "workday", "weekend", "all"],
      Info: {},
      isVisible: false,
    };
  },
  methods: {
    async getTrigger() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/triggerclass"
        );
        console.log(response);
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/jobclass"
        );
        console.log(response);
        this.jobClassNameGroup = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJobDetail() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/jobdetailclass"
        );
        console.log(response);
        this.JobDetails = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    getTimeRange() {
      if (this.timeRange !== null) {
        this.startTime = this.timeRange[0];
        this.endTime = this.timeRange[1];
      }
    },
    checkBaseInfo() {
      let tip = "";
      if (this.jobName === "" || this.jobGroup === "") {
        tip = tip + "任务名或任务组不能为空\n";
      }
      if (this.jobClassName === "") {
        tip = tip + "任务类名不能为空\n";
      }
      if (this.priority > 999 || this.priority < 0) {
        tip = tip + "优先级范围为0~999\n";
      }
      if (this.timeRange === null || this.startTime === "" || this.endTime === "") {
        tip = tip + "任务时间不能为空\n";
      }
      if (this.trigger === "") {
        tip = tip + "触发器类型不能为空\n";
      }
      if (this.isCustomJobDetail === "true" && this.jobDetail === "") {
        tip = tip + "你已开启自定义的jobdetail,请选择你的自定义jobdetail\n";
      }
      if (this.isCustomTrigger === "true" && this.selecttrigger === "") {
        tip = tip + "你已开启自定义的触发器,请选择你的自定义触发器\n";
      }
      if (
        this.isCustomTrigger === "false" &&
        (this.triggername === "" || this.triggergroup === "")
      ) {
        tip = tip + "你未开启自定义的触发器,请选择输入触发器名及触发器分组\n";
      }
      if (tip !== "") alert(tip);
      return tip === "";
    },
    async checkTrigger() {
      if (this.isCustomTrigger === "true") {
        return true;
      } else if (this.trigger === "SimpleTrigger") {
        if (
          !(
            (this.simpletimesecond === "" && this.repeatcount === "") ||
            (this.simpletimesecond !== "" && this.repeatcount !== "")
          )
        ) {
          alert("请输入完整参数或请清空输入使用默认参数");
          return false;
        }
      } else if (this.trigger === "CronTrigger") {
        if (this.cronexpression !== "") {
          const response = await axios.post(
            "http://114.132.71.250:8002/task/Util/cron-check?cron=" + this.cronexpression
          );
          if (response.data.message === "cron表达式格式错误！") {
            alert("cron表达式不合法");
            return false;
          }
        }
      } else if (this.trigger === "CalendarIntervalTrigger") {
        if (
          !(
            (this.calendarnum === "" && this.timezone === "") ||
            (this.calendarnum !== "" && this.timezone !== "")
          )
        ) {
          alert("请输入完整参数或请清空输入使用默认参数");
          return false;
        }
      } else if (this.trigger === "DailyTimeIntervalTrigger") {
        if (
          !(
            (this.dailynum === "" &&
              this.dailyrepeatcount === "" &&
              this.dailyworkday.length === 0) ||
            (this.dailynum !== "" &&
              this.dailyrepeatcount !== "" &&
              this.dailyworkday.length !== 0)
          )
        ) {
          alert("请输入完整参数或请清空输入使用默认参数");
          return false;
        }
      }
      return true;
    },
    builInfo() {
      this.Info.jobname = this.jobName;
      this.Info.jobgroup = this.jobGroup;
      this.Info.jobclassname = this.jobClassName;
      this.Info.description = this.jobDescription;
      this.Info.type = this.trigger;
      this.Info.startime = this.startTime;
      this.Info.endtime = this.endTime;
      this.Info.priority = this.priority;
      this.Info.isCustomJobDetail = this.isCustomJobDetail;
      if (this.isCustomJobDetail === "true") {
        this.Info.jobDetail = this.jobDetail;
      }
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if (this.isCustomTrigger === "true") {
        this.Info.trigger = this.selecttrigger;
      } else {
        this.Info.triggername = this.triggername;
        this.Info.triggergroup = this.triggergroup;
        if (
          this.trigger === "SimpleTrigger" &&
          this.simpletimesecond !== "" &&
          this.repeatcount !== ""
        ) {
          this.Info.simpletimesecond = this.simpletimesecond;
          this.Info.repeatcount = this.repeatcount;
        } else if (
          this.trigger === "CronTrigger" &&
          this.cronexpression !== ""
        ) {
          this.Info.cronexpression = this.cronexpression;
        } else if (
          this.trigger === "CalendarIntervalTrigger" &&
          this.calendarnum !== "" &&
          this.timezone !== ""
        ) {
          this.Info.calendartime = this.calendartime;
          this.Info.calendarnum = this.calendarnum;
          this.Info.preserveHourOfDayAcrossDaylightSavings =
            this.preserveHourOfDayAcrossDaylightSavings;
          this.Info.skipDayIfHourDoesNotExist = this.skipDayIfHourDoesNotExist;
          this.Info.timezone = this.timezone;
        } else if (
          this.trigger === "DailyTimeIntervalTrigger" &&
          this.dailynum !== "" &&
          this.dailyrepeatcount !== "" &&
          this.dailyworkday.length !== 0
        ) {
          this.Info.dailytime = this.dailytime;
          this.Info.dailynum = this.dailynum;
          this.Info.dailyrepeatcount = this.dailyrepeatcount;
          this.Info.dailyworkday = this.dailyworkday;
        }
      }
    },
    async addjob() {
      if (this.checkBaseInfo() && this.checkTrigger()) {
        this.builInfo();
        console.log(this.Info);
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Add/job",
          this.Info
        );
        console.log(response);
        this.Info = {};
        this.closeModal();
      }
    },
    async addfreejob() {
      if (
        this.jobName !== "" &&
        this.jobGroup !== "" &&
        this.jobClassName !== ""
      ) {
        if (this.isCustomJobDetail === "true" && this.jobDetail === "") {
          alert("你已开启自定义的jobdetail,请选择你的自定义jobdetail");
          return;
        } else {
          this.Info.jobname = this.jobName;
          this.Info.jobgroup = this.jobGroup;
          this.Info.jobclassname = this.jobClassName;
          this.Info.description = this.jobDescription;
          this.Info.isCustomJobDetail = this.isCustomJobDetail;
          this.Info.jobDetail = this.jobDetail;
          const response = await axios.post(
            "http://114.132.71.250:8002/task/Add/jobdetail",
            null,
            {
              params: this.Info,
            }
          );
          console.log(response);
          this.Info = {};
          this.closeModal();
        }
      } else {
        alert("任务名、任务分组、任务类名不能为空");
      }
    },
    jobModal() {
      this.isVisible = true;
    },
    closeModal() {
      this.isVisible = false;
    },
  },
  created() {
    this.getTrigger();
    this.getJob();
    this.getJobDetail();
  },
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
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

h2 {
  margin-top: 0;
  font-size: 18px;
  color: #333;
}

select,
input {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>