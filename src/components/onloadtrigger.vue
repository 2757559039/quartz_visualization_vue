<template>
  <el-dialog v-model="isVisible" title="触发器挂载" :before-close="closeModal">
    <el-form label-width="140px">
      <el-form-item label="任务分组">
        <el-select v-model="jobgroup" @change="select(jobgroup)">
          <el-option
            v-for="(group, index) in jobgroups"
            :key="index"
            :label="group"
            :value="group"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名">
        <el-select v-model="jobname">
          <el-option
            v-for="(jobname, index) in jobnames"
            :key="index"
            :label="jobname"
            :value="jobname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="触发器类型">
        <el-select v-model="trigger">
          <el-option label="SimpleTrigger" value="SimpleTrigger" />
          <el-option label="CronTrigger" value="CronTrigger" />
          <el-option label="DailyTimeIntervalTrigger" value="DailyTimeIntervalTrigger" />
          <el-option label="CalendarIntervalTrigger" value="CalendarIntervalTrigger" />
        </el-select>
      </el-form-item>
      <el-form-item class="zdycfq">
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
      <el-form-item label="自定义触发器"  v-if="isCustomTrigger === 'true'"> 
        <el-select v-model="selecttrigger">
          <el-option
            v-for="(trigger, index) in triggers"
            :key="index"
            :label="trigger"
            :value="trigger"
          />
        </el-select>
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
              v-model="endTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
              :disabled-date="disabledEndDate"
            />
          </el-form-item>


      <el-form-item label="任务优先级" v-if="isCustomTrigger === 'false'">
        <el-input-number v-model="priority" :min="1" :max="999" />
      </el-form-item>

      <el-form-item v-if="isCustomTrigger === 'false'" label="设置时区">
        <el-input v-model="timezone" placeholder="请设置时区" />
      </el-form-item>
      <el-form-item  label="触发器名称">
        <el-input v-model="triggername" />
      </el-form-item>
      <el-form-item  label="触发器分组">
        <el-input v-model="triggergroup" />
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
          <el-option label="秒钟" value="second" />
          <el-option label="分钟" value="minute" />
          <el-option label="小时" value="hour" />
          <el-option label="日" value="day" />
          <el-option label="月" value="month" />
          <el-option label="年" value="year" />
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
        label="执行日选择(星期)"
      >
        <el-checkbox-group v-model="dailyworkday" @change="checkday" >
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
          <el-option label="秒钟" value="second" />
          <el-option label="分钟" value="minute" />
          <el-option label="小时" value="hour" />
          <el-option label="日" value="day" />
          <el-option label="月" value="month" />
          <el-option label="年" value="year" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
        label="触发器间隔次数"
      >
        <el-input v-model="calendarnum" placeholder="请输入间隔次数" />
      </el-form-item>
      <el-form-item class="zdycfq" v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'">
        <el-switch
          v-model="preserveHourOfDayAcrossDaylightSavings"
          active-value="true"
          inactive-value="false"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="是否使用夏令时"
          inactive-text="是否使用夏令时"
        />
      </el-form-item>
      <el-form-item class="zdycfq" v-if="trigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'">
        <el-switch
          v-model="skipDayIfHourDoesNotExist"
          active-value="true"
          inactive-value="false"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="设置当小时不存在时是否跳过这一天"
          inactive-text="设置当小时不存在时是否跳过这一天"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
      <el-button type="primary" @click="replace">挂载触发器</el-button>
      <el-button @click="closeModal">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { ca, el } from "element-plus/es/locales.mjs";
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';
import 'vue3-cron-plus-picker/style.css';

export default {
  components: {
    Vue3CronPlusPicker
  },
  data() {
    return {
      isVisible: false,
      jobgroups: [],
      jobgroup: "",
      jobnames: [],
      jobname: "",
      priority: 5,
      startTime: "",
      endTime: "",
      trigger: "",
      isCustomTrigger: "false",
      triggername: "",
      triggergroup: "",
      triggers: [],
      selecttrigger: "",
      simpletimesecond: "",
      repeatcount: "",
      cronexpression: "",
      calendartime: "second",
      calendarnum: "",
      preserveHourOfDayAcrossDaylightSavings: false,
      skipDayIfHourDoesNotExist: false,
      timezone: "Asia/Shanghai",
      dailytime: "second",
      dailynum: "",
      dailyrepeatcount: "",
      dailyworkday: [],
      workday: false,
      weekend: false,
      all: false,
      showCronDialog: false
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
        const response = await axios.post("/task/Select/jobgroupall");
        this.jobgroups = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async select(jobgroup) {
      try {
        const response = await axios.post(
          "/task/Select/jobDetailname?jobgroup=" + jobgroup
        );
        this.jobnames = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    async getTrigger() {
      try {
        const response = await axios.post("/task/Reflect/triggerclass");
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    initinfo(){
      let info = {};
      info.jobname = this.jobname;
      info.jobgroup = this.jobgroup;
      info.type = this.trigger;

      info.isCustomTrigger = this.isCustomTrigger;
      if (this.isCustomTrigger === "true") {
        info.trigger = this.selecttrigger;
      } else {
        info.triggername = this.triggername;
        info.triggergroup = this.triggergroup;
        info.startime = this.startTime;
        if(this.endTime !== ""){
          info.endtime = this.endTime;
        }
        info.priority = this.priority;
        info.timezone = this.timezone;
        if (
          this.trigger === "SimpleTrigger" &&
          this.simpletimesecond !== "" &&
          this.repeatcount !== ""
        ) {
          info.simpletimesecond = this.simpletimesecond;
          info.repeatcount = this.repeatcount;
        } else if (
          this.trigger === "CronTrigger" &&
          this.cronexpression !== ""
        ) {
          info.cronexpression = this.cronexpression;
        } else if (
          this.trigger === "CalendarIntervalTrigger" &&
          this.calendarnum !== ""
        ) {
          info.calendartime = this.calendartime;
          info.calendarnum = this.calendarnum;
          info.preserveHourOfDayAcrossDaylightSavings =
            this.preserveHourOfDayAcrossDaylightSavings;
          info.skipDayIfHourDoesNotExist = this.skipDayIfHourDoesNotExist;
        } else if (
          this.trigger === "DailyTimeIntervalTrigger" &&
          this.dailynum !== "" &&
          this.dailyrepeatcount !== "" &&
          this.dailyworkday.length !== 0
        ) {
          info.dailytime = this.dailytime;
          info.dailynum = this.dailynum;
          info.dailyrepeatcount = this.dailyrepeatcount;
          info.dailyworkday = this.dailyworkday;
        }
      }
      return info;
    },
    checkinfo() {
      let errors = [];
      if(this.isCustomTrigger === "true"){
        if (!this.selecttrigger && !this.trigger) {
          errors.push("自定义触发器不能为空");
        }
        else{
          return false;
        }
      }
      if (!this.jobname) {
      errors.push("任务名不能为空");
      }
      if (!this.jobgroup) {
      errors.push("任务分组不能为空");
      }
      if (!this.trigger) {
      errors.push("触发器类型不能为空");
      }
      if (!this.priority) {
      errors.push("任务优先级不能为空");
      }
      if (!this.startTime) {
      errors.push("开始任务时间不能为空");
      }
      if (this.isCustomTrigger === "false") {
      if (!this.triggername) {
        errors.push("触发器名称不能为空");
      }
      if (!this.triggergroup) {
        errors.push("触发器分组不能为空");
      }
      if (this.trigger === "SimpleTrigger") {
        if (!this.simpletimesecond) {
        errors.push("触发时间间隔不能为空");
        }
        if (!this.repeatcount) {
        errors.push("触发器执行次数不能为空");
        }
      } else if (this.trigger === "CronTrigger") {
        if (!this.cronexpression) {
        errors.push("cron字段不能为空");
        }
      } else if (this.trigger === "DailyTimeIntervalTrigger") {
        if (!this.dailytime) {
        errors.push("触发器时间间隔单位不能为空");
        }
        if (!this.dailynum) {
        errors.push("触发器间隔次数不能为空");
        }
        if (!this.dailyrepeatcount) {
        errors.push("总执行次数不能为空");
        }
        if (this.dailyworkday.length === 0) {
        errors.push("执行日选择不能为空");
        }
      } else if (this.trigger === "CalendarIntervalTrigger") {
        if (!this.calendarnum) {
        errors.push("触发器间隔次数不能为空");
        }
        if (!this.calendartime) {
        errors.push("触发器间隔单位不能为空");
        }
      } 
    }else{
      if (!this.selecttrigger) {
        errors.push("自定义触发器不能为空");
      }
    }
    if (errors.length > 0) {
        this.$message({
        message: errors.join("<br><br>"),
        dangerouslyUseHTMLString: true,
        type: "error"
        });
        return true;
      }
      return false;
    },
    async replace() {
      try{
        if(this.checkinfo()){
          return;
        }
        const info = this.initinfo();
        const response = await axios.post("/task/Add/jobTOtri", info);
        console.log(response);
        if(response.data.data === "success"){
          this.$message({
            message: "挂载成功",
            type: "success"
          });
          this.closeModal()
        }else if(response.data.message === "触发器已存在!"){
          this.$message({
            message: "触发器已存在,请重新输入触发器名或触发器组名",
            type: "error"
          });
        }
      }catch(error){
        console.error(error);
      }
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
    this.getjobgroups();
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
  width: 600px;
  height: 780px;
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

.el-input-number{
  width: 286px;
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
  width: 120px;
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
:deep(.zdycfq .el-switch__core){
  width: 365px;
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

.footer{
  position: absolute;
  bottom: 20px;
  width: 100%; 
  text-align: center;
}

:deep(.el-input){
  width: 286px;
}
</style>