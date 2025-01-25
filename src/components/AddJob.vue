<template>
  <el-dialog v-model="isVisible" title="任务配置" width="50%" :before-close="closeModal">
    <el-form label-width="120px">
      <el-form-item label="任务名">
        <el-input v-model="jobName" />
      </el-form-item>
      <el-form-item label="任务分组">
        <el-input v-model="jobGroup" />
      </el-form-item>
      <el-form-item label="任务类名">
        <el-select v-model="jobClassName">
          <el-option
            v-for="(name, index) in jobClassNameGroup"
            :key="index"
            :label="name"
            :value="name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input v-model="jobDescription" />
      </el-form-item>
      <el-form-item label="选择触发器">
        <el-select v-model="trigger">
          <el-option label="SimpleTrigger" value="SimpleTrigger" />
          <el-option label="CronTrigger" value="CronTrigger" />
          <el-option label="DailyTimeIntervalTrigger" value="DailyTimeIntervalTrigger" />
          <el-option label="CalendarIntervalTrigger" value="CalendarIntervalTrigger" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始任务时间">
        <el-date-picker
          v-model="startTime"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="选择开始日期"
        />
      </el-form-item>
      <el-form-item label="结束任务时间">
        <el-date-picker
          v-model="endTime"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="选择结束日期"
        />
      </el-form-item>
      <el-form-item label="任务优先级">
        <el-input-number v-model="priority" :min="0" :max="999" />
      </el-form-item>
      <el-form-item label="JobDetail">
        <el-switch
          v-model="isCustomJobDetail"
          active-value="true"
          inactive-value="false"
          style="position: absolute;left: -120px"
        />
        <el-select
          v-model="jobDetail"
          :disabled="isCustomJobDetail === 'false'"
          style="flex: 1"
        >
          <el-option
            v-for="(JobDetail, index) in JobDetails"
            :key="index"
            :label="JobDetail"
            :value="JobDetail"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="自定义触发器">
        <el-select v-model="isCustomTrigger">
          <el-option label="true" value="true" />
          <el-option label="false" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'true'" label="触发器实现类">
        <el-select v-model="selecttrigger">
          <el-option
            v-for="(trigger, index) in triggers"
            :key="index"
            :label="trigger"
            :value="trigger"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'false'" label="触发器名">
        <el-input v-model="triggername" />
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'false'" label="触发器名组">
        <el-input v-model="triggergroup" />
      </el-form-item>
      <el-form-item
        v-if="trigger === 'SimpleTrigger' && isCustomTrigger === 'false'"
        label="触发时间间隔"
      >
        <el-input v-model="simpletimesecond" placeholder="单位为秒" />
      </el-form-item>
      <el-form-item
        v-else-if="trigger === 'CronTrigger' && isCustomTrigger === 'false'"
        label="cron字段"
      >
        <el-input v-model="cronexpression" placeholder="请输入cron格式字段" />
      </el-form-item>
      <el-form-item
        v-else-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
        label="触发器时间间隔单位"
      >
        <el-select v-model="calendartime">
          <el-option label="second" value="second" />
          <el-option label="minute" value="minute" />
          <el-option label="hour" value="hour" />
          <el-option label="day" value="day" />
          <el-option label="month" value="month" />
          <el-option label="year" value="year" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-else-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
        label="触发器时间间隔单位"
      >
        <el-select v-model="dailytime">
          <el-option label="second" value="second" />
          <el-option label="minute" value="minute" />
          <el-option label="hour" value="hour" />
          <el-option label="day" value="day" />
          <el-option label="month" value="month" />
          <el-option label="year" value="year" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addjob">增加任务</el-button>
      <el-button @click="addfreejob">增加空闲任务</el-button>
    </template>
  </el-dialog>
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
      startTime: "",
      endTime: "",
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
        const response = await axios.post("http://114.132.71.250:8002/task/Reflect/triggerclass");
        console.log(response);
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJob() {
      try {
        const response = await axios.post("http://114.132.71.250:8002/task/Reflect/jobclass");
        console.log(response);
        this.jobClassNameGroup = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJobDetail() {
      try {
        const response = await axios.post("http://114.132.71.250:8002/task/Reflect/jobdetailclass");
        console.log(response);
        this.JobDetails = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
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
      if (this.startTime === "" || this.endTime === "") {
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
      return tip === "" ? "true" : tip;
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
      return 'true';
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
      if (this.checkBaseInfo() === 'true' && this.checkTrigger() === 'true') {
        this.builInfo();
        console.log(this.Info);
        const response = await axios.post("http://114.132.71.250:8002/task/Add/job", this.Info);
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
:deep(.el-dialog),
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 426px;
  /* height: 650px; */
  max-width: 800px;
  border-radius: 14px;
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

:deep(.el-input),
:deep(.el-select),
:deep(.el-date-editor){
  width:300px;
}
</style>