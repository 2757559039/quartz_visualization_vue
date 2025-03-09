<template>
  <el-dialog v-model="isVisible" title="任务配置" :before-close="closeModal">
    <el-form label-width="30%" class="two-column-form">
      <div class="title">
        <div class="left">
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

          <el-form-item class="zdycfq">
            <el-switch
              v-model="isCustomJobDetail"
              active-value="true"
              inactive-value="false"
              inline-prompt
              style="
                --el-switch-on-color: linear-gradient(to left, #35ccff, #0472b6);
                --el-switch-off-color: linear-gradient(to right, #35ccff, #0472b6);
              "
              active-text="自定义JobDetail"
              inactive-text="自定义JobDetail"
              class="custom-switch"
            />
          </el-form-item>
          <el-form-item label="JobDetail">
            <el-select v-model="jobDetail" :disabled="isCustomJobDetail === 'false'">
              <el-option
                v-for="(JobDetail, index) in JobDetails"
                :key="index"
                :label="JobDetail"
                :value="JobDetail"
              />
            </el-select>
          </el-form-item>
          

        </div>
        <div class="right">
          <el-form-item label="选择触发器">
            <el-select v-model="trigger" @change="getTrigger()">
              <el-option label="SimpleTrigger" value="SimpleTrigger" />
              <el-option label="CronTrigger" value="CronTrigger" />
              <el-option label="DailyTimeIntervalTrigger" value="DailyTimeIntervalTrigger" />
              <el-option label="CalendarIntervalTrigger" value="CalendarIntervalTrigger" />
            </el-select>
          </el-form-item>
          
          <el-form-item class="zdycfq1">
            <el-switch
              v-model="isCustomTrigger"
              active-value="true"
              inactive-value="false"
              inline-prompt
              style="
                --el-switch-on-color: linear-gradient(to left, #35ccff, #0472b6);
                --el-switch-off-color: linear-gradient(to right, #35ccff, #0472b6);
              "
              active-text="自定义触发器"
              inactive-text="自定义触发器"
              class="custom-switch"
            />
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

            <el-form-item label="任务优先级" v-if="isCustomTrigger === 'false'">
            <el-input-number v-model="priority" :min="1" :max="999"/>
            </el-form-item>

          <el-form-item label="开始任务时间" v-if="isCustomTrigger === 'false'">
            <el-date-picker
              v-model="startTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择开始日期"
              :disabled-date="disabledStartDate"
            />
          </el-form-item>
          <el-form-item label="结束任务时间" v-if="isCustomTrigger === 'false'">
            <el-date-picker
            :disabled="startTime === ''"
              v-model="endTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
              :disabled-date="disabledEndDate"
            />
          </el-form-item>

          <el-form-item v-if="isCustomTrigger === 'false'" label="设置时区">
            <el-input v-model="timezone" placeholder="请设置时区" />
          </el-form-item>

          <!-- SimpleTrigger -->
          <el-form-item
            v-if="trigger === 'SimpleTrigger' && isCustomTrigger === 'false'"
            label="触发时间间隔"
          >
            <el-input v-model="simpletimesecond" placeholder="单位为秒" />
          </el-form-item>
          <el-form-item
            v-if="trigger === 'SimpleTrigger' && isCustomTrigger === 'false'"
            label="触发器执行次数"
          >
            <el-input v-model="repeatcount" placeholder="请输入执行次数" />
          </el-form-item>

          <!-- CronTrigger -->
          <el-form-item
            v-if="trigger === 'CronTrigger' && isCustomTrigger === 'false'"
            label="cron字段"
          >
            <el-input
              v-model="cronexpression"
              placeholder="请输入cron格式字段"
              @click="openCronDialog"
              :clearable="true"
            />
            <el-dialog v-model="showCronDialog" title="Cron表达式选择器">
              <Vue3CronPlusPicker @hide="closeCronDialog" @fill="fillCronValue" :expression="cronexpression" />
            </el-dialog>
          </el-form-item>

          <!-- DailyTimeIntervalTrigger -->
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="触发器时间间隔单位"
          >
            <el-select v-model="dailytime">
              <el-option label="second" value="second" />
              <el-option label="minute" value="minute" />
              <el-option label="hour" value="hour" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="请输入间隔次数"
          >
            <el-input v-model="dailynum" placeholder="请输入间隔次数" />
          </el-form-item>
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="总执行次数"
          >
            <el-input v-model="dailyrepeatcount" placeholder="请输入总执行次数" />
          </el-form-item>
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="当天开始时间"
          >
            <el-time-picker v-model="DayStartTime" placeholder="Arbitrary time" format="HH:mm:ss" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="当天结束时间"
          >
          <el-time-picker v-model="DayEndTime" placeholder="Arbitrary time" format="HH:mm:ss" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item
            v-if="trigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
            label="执行日选择(星期)"
          >
            <el-checkbox-group v-model="dailyworkday" @change="checkday">
              <el-checkbox label="1">星期一</el-checkbox>
              <el-checkbox label="2">星期二</el-checkbox>
              <el-checkbox label="3">星期三</el-checkbox>
              <el-checkbox label="4">星期四</el-checkbox>
              <el-checkbox label="5">星期五</el-checkbox>
              <el-checkbox label="6">星期六</el-checkbox>
              <el-checkbox label="7">星期日</el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-model="all" label="每一天" @change="setAllDays" />
            <el-checkbox v-model="workday" label="工作日" @change="setWorkDays" />
            <el-checkbox v-model="weekend" label="周末" @change="setWeekendDays" />
          </el-form-item>

          <!-- CalendarIntervalTrigger -->
          <el-form-item
            v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
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
            v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
            label="触发器间隔次数"
          >
            <el-input v-model="calendarnum" placeholder="请输入间隔次数" />
          </el-form-item>
          <el-form-item class="zdycfq1" v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'">
            <el-switch
              v-model="preserveHourOfDayAcrossDaylightSavings"
              active-value="true"
              inactive-value="false"
              inline-prompt
              style="
                --el-switch-on-color: linear-gradient(to left, #35ccff, #0472b6);
                --el-switch-off-color: linear-gradient(to right, #35ccff, #0472b6);
              "
              active-text="是否使用夏令时"
              inactive-text="是否使用夏令时"
              class="custom-switch"
            />
          </el-form-item>
          <el-form-item class="zdycfq1" v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'">
            <el-switch
              v-model="skipDayIfHourDoesNotExist"
              active-value="true"
              inactive-value="false"
              inline-prompt
              style="
                --el-switch-on-color: linear-gradient(to left, #35ccff, #0472b6);
                --el-switch-off-color: linear-gradient(to right, #35ccff, #0472b6);
              "
              active-text="设置当小时不存在时是否跳过这一天"
              inactive-text="设置当小时不存在时是否跳过这一天"
              class="custom-switch"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="button-container">
        <el-button @click="addjob">增加任务</el-button>
        <el-button @click="addfreejob">增加空闲任务</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';
import 'vue3-cron-plus-picker/style.css';

export default {
  components: {
    Vue3CronPlusPicker
  },
  data() {
    return {
      jobName: "",
      jobGroup: "",
      jobClassName: "",
      jobClassNameGroup: [],
      jobDescription: "",
      isCustomJobDetail: "false",
      JobDetails: [],
      jobDetail: "",

      trigger: "SimpleTrigger",

      isCustomTrigger: "false",
      triggers: [],
      selecttrigger: "",

      startTime: "",
      endTime: "",
      priority: 5,
      timezone: "Asia/Shanghai",
      triggername: "",
      triggergroup: "",
      
      simpletimesecond: "",
      repeatcount: "",

      cronexpression: "",

      calendartime: "second",
      calendarnum: "",
      preserveHourOfDayAcrossDaylightSavings: false,
      skipDayIfHourDoesNotExist: false,
      
      dailytime: "second",
      dailynum: "",
      dailyrepeatcount: "",
      DayStartTime: "", // 当天开始时间
      DayEndTime: "", // 当天结束时间
      dailyworkday: [],
      workday: false,
      weekend: false,
      all: false,
      options: ["1", "2", "3", "4", "5", "6", "7", "workday", "weekend", "all"],

      Info: {},

      isVisible: false,
      showCronDialog: false
    };
  },
  methods: {
    async getTrigger() {
      try {
        const response = await axios.post("/task/Reflect/triggerclass",null, {
          params: {
            type: this.trigger,
          },
        });
        console.log(response);
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJob() {
      try {
        const response = await axios.post("/task/Reflect/jobclass");
        console.log(response);
        this.jobClassNameGroup = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getJobDetail() {
      try {
        const response = await axios.post("/task/Reflect/jobdetailclass");
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

      if (this.trigger === "") {
        tip = tip + "触发器类型不能为空\n";
      }
      if (this.isCustomJobDetail === "true" && this.jobDetail === "") {
        tip = tip + "你已开启自定义的jobdetail,请选择你的自定义jobdetail\n";
      }
      if (tip !== "") {
        alert(tip);
        return 'false';
      };
      console.log('yes');
      return "true";
    },



    async checkTrigger() {
      let tip = "";
      if (this.isCustomTrigger === "true") {
        if(this.selecttrigger === ""){
          tip = tip + "请选择触发器实现类\n";
          alert(tip);
          return "false";
        }
      return "true";
      } else {
      if (this.triggername === "" || this.triggergroup === "") {
        tip = tip + "触发器名或触发器组不能为空\n";
      }
      if (this.startTime === "") {
        tip = tip + "开始时间不能为空\n";
      }
      if(this.priority >= 999 || this.priority < 0){
        tip = tip + "优先级范围为1~999\n";
      }
      
      if (this.trigger === "SimpleTrigger") {
        if ( this.simpletimesecond === "" || this.repeatcount === "") {
        tip = tip + "请输入完整参数\n";
        }
      } else if (this.trigger === "CronTrigger") {
        if (this.cronexpression !== "") {
        const response = await axios.post(
          "/task/Util/cron-check?cron=" + this.cronexpression
        );
        if (response.data.message === "cron表达式格式错误！") {
          tip = tip + "cron表达式不合法\n";
        }
        }
      } else if (this.trigger === "CalendarIntervalTrigger") {
        if ( this.calendarnum === "" || this.calendartime === "") {
        tip = tip + "请输入完整参数\n";
        }
      } else if (this.trigger === "DailyTimeIntervalTrigger") {
        if ( this.dailytime === "" || this.dailynum === "" || this.dailyrepeatcount === "" || this.dailyworkday.length === 0 || this.DayStartTime === "") {
        tip = tip + "请输入完整参数或请清空输入使用默认参数\n";
        }
      }
      }
      if (tip !== "") {
      alert(tip);
      return "false";
      }
      console.log('yes');
      return "true";
    },
    disabledStartDate(time) {
    // 获取当前日期
    const today = new Date();
    // 设置时间的时分秒为0，表示当天的开始
    today.setHours(0, 0, 0, 0);
    // 返回一个布尔值，表示是否禁用该日期
    return time.getTime() < today.getTime();
  },
  disabledEndDate(time) {
      // 获取开始时间
      const startTime = new Date(this.startTime);
      // 设置时间的时分秒为0，表示当天的开始
      startTime.setHours(0, 0, 0, 0);
      // 返回一个布尔值，表示是否禁用该日期
      return time.getTime() <= startTime.getTime();
    },
  disabledEndDate(time) {
      if (!this.startTime) {
        return false; // 如果开始时间未设置，则不进行限制
      }
      const start = new Date(this.startTime);
      start.setHours(0, 0, 0, 0); // 将开始时间的时分秒设置为0
      return time.getTime() < start.getTime();
    },
    builInfo() {
      this.Info.jobname = this.jobName;
      this.Info.jobgroup = this.jobGroup;
      this.Info.jobclassname = this.jobClassName;
      this.Info.description = this.jobDescription;
      this.Info.type = this.trigger;

      this.Info.isCustomJobDetail = this.isCustomJobDetail;
      if (this.isCustomJobDetail === "true") {
        this.Info.jobDetail = this.jobDetail;
      }
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if (this.isCustomTrigger === "true") {
        this.Info.trigger = this.selecttrigger;
      } else {
        this.Info.startime = this.startTime;
        if (this.endTime !== "") {
          this.Info.endtime = this.endTime;
        }
        this.Info.priority = this.priority;
        this.Info.timezone = this.timezone;
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
          this.calendarnum !== ""
        ) {
          this.Info.calendartime = this.calendartime;
          this.Info.calendarnum = this.calendarnum;
          this.Info.preserveHourOfDayAcrossDaylightSavings =
            this.preserveHourOfDayAcrossDaylightSavings;
          this.Info.skipDayIfHourDoesNotExist = this.skipDayIfHourDoesNotExist;

        } else if (
          this.trigger === "DailyTimeIntervalTrigger" &&
          this.dailynum !== "" &&
          this.dailyrepeatcount !== "" &&
          this.dailyworkday.length !== 0 &&
          this.DayStartTime !==""
        ) {
          this.Info.dailytime = this.dailytime;
          this.Info.dailynum = this.dailynum;
          this.Info.dailyrepeatcount = this.dailyrepeatcount;
          this.Info.dailyworkday = this.dailyworkday;
          this.Info.dailystarttime = this.DayStartTime;
          if(this.DayEndTime){
            this.Info.dailyendtime = this.DayEndTime;
          }
        }
      }
    },
    async addjob() {
      console.log(this.Info);
      const if1 = this.checkBaseInfo() === "true";
      const if2 = await this.checkTrigger() === "true";
      if (if1 && if2) {
        this.builInfo();
        console.log(this.Info);
        const response = await axios.post("/task/Add/job", this.Info);
        console.log(response);
        if(response.data.code === "500" ){
            this.$message({
              showClose: true,
              message: response.data.message,
              grouping: true,
              type: 'error'
            });
          }
          this.Info = {};
          this.$emit('getWhenAdd');
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
            "/task/Add/jobdetail",
            null,
            {
              params: this.Info,
            }
          );
          console.log(response);
          if(response.data.code === "500" ){
            this.$message({
              showClose: true,
              message: response.data.message,
              grouping: true,
              type: 'error'
            });
          }
          this.Info = {};
          this.$emit('getWhenAdd');
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
    setAllDays() {
      if(this.all){
        this.dailyworkday = ["1","2","3","4","5","6","7"];
        this.workday = true;
        this.weekend = true;
      }else{
        this.dailyworkday = [];
        this.workday = false;
        this.weekend = false;
      }
    },
    setWorkDays() {
      if(this.workday){
        this.dailyworkday.push("1","2","3","4","5");
        this.dailyworkday = [...new Set(this.dailyworkday)];
        if(this.dailyworkday.includes("1") && this.dailyworkday.includes("2") && this.dailyworkday.includes("3") && this.dailyworkday.includes("4") && this.dailyworkday.includes("5") && this.dailyworkday.includes("6") && this.dailyworkday.includes("7")){
          this.all = true;
        }

      }else{
        this.dailyworkday = [];

        if(this.weekend){
          this.dailyworkday.push("6","7");
        }
        this.all = false;
      }
    },
    setWeekendDays() {
      if(this.weekend){
        this.dailyworkday.push("6","7");
        this.dailyworkday = [...new Set(this.dailyworkday)];
        if(this.dailyworkday.includes("1") && this.dailyworkday.includes("2") && this.dailyworkday.includes("3") && this.dailyworkday.includes("4") && this.dailyworkday.includes("5") && this.dailyworkday.includes("6") && this.dailyworkday.includes("7")){
          this.all = true;
        }
      }else{
        this.dailyworkday = [];
        if(this.workday){
          this.dailyworkday.push("1","2","3","4","5");
      }
      this.all = false;
    }
    },
    checkday() {
      console.log('checkday');
      if (this.dailyworkday.includes("1") && this.dailyworkday.includes("2") && this.dailyworkday.includes("3") && this.dailyworkday.includes("4") && this.dailyworkday.includes("5")) {
        this.workday = true;
      } else {
        this.workday = false;
      }
      if (this.dailyworkday.includes("6") && this.dailyworkday.includes("7")) {
        this.weekend = true;
      } else {
        this.weekend = false;
      }
      if (this.workday && this.weekend) {
        this.all = true;
      } else {
        this.all = false;
      }
    },
    openCronDialog() {
      this.showCronDialog = true;
    },
    closeCronDialog() {
      this.showCronDialog = false;
    },
    fillCronValue(cronValue) {
      this.cronexpression = cronValue;
      this.closeCronDialog();
    }
  },
  created() {
    this.getTrigger();
    this.getJob();
    this.getJobDetail();
  },
  watch: {
    isVisible(val) {
      if (val) {
        this.getJob();
        this.getJobDetail();
        this.getTrigger();
      }
    }
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
  width: 180px;
  height: 40px;
  font-size: 20px;
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
  /* width:220px; */
  padding-right: 20px;
}
:deep(.el-date-editor){
  width: 290px;
}

.title{
  display: flex;
  justify-content: space-between;
}

.left{
  width: 400px;
}

.right{
  width: 430px;
}

.two-column-form {
  display: flex;
  justify-content: space-between;
}

.two-column-form .el-col {
  flex: 1;
  margin-right: 10px;
}

.two-column-form .el-col:last-child {
  margin-right: 0;
}

.two-column-form .el-col .el-form-item {
  margin-bottom: 20px;
}

.button-container {
  position: absolute;
  bottom: 20px;
  width: 800px; 
  text-align: center;
}

.button-container .el-button {
  font-size: 20px;
  margin: 0 10px;
}
:deep(.zdycfq .el-switch__core){
  width: 320px;
  height: 30px;
  position: absolute;left: -80px
}

:deep(.zdycfq1 .el-switch__core){
  width: 350px;
  height: 30px;
  position: absolute;left: -80px
}
/* 开关 */
:deep(.custom-switch .el-switch__core) {
  background-size: 200% auto !important;
  transition: background-position 0.3s ease;
}
:deep(.custom-switch.is-checked .el-switch__core) {
  background-position: right center;
}
:deep(.custom-switch:not(.is-checked) .el-switch__core) {
  background-position: left center;
}
:deep(.el-switch__button) {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-input-number{
  width: 290px;
}
:deep(.el-input-number .el-input-number__increase){
  right: 21px;
}
</style>