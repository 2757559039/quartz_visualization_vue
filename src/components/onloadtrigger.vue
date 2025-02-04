<template>
  <el-dialog v-model="isVisible" title="触发器挂载" width="50%" :before-close="closeModal">
    <el-form label-width="120px">
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
        <el-select v-model="job">
          <el-option
            v-for="(job, index) in jobs"
            :key="index"
            :label="job.jobname"
            :value="job"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="触发器类型">
        <el-select v-model="selecttrigger">
          <el-option label="SimpleTrigger" value="SimpleTrigger" />
          <el-option label="CronTrigger" value="CronTrigger" />
          <el-option label="DailyTimeIntervalTrigger" value="DailyTimeIntervalTrigger" />
          <el-option label="CalendarIntervalTrigger" value="CalendarIntervalTrigger" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务优先级">
        <el-input-number v-model="priority" :min="0" :max="999" />
      </el-form-item>
      <el-form-item class="zdycfq">
        <el-switch
          v-model="isCustomTrigger"
          active-value="true"
          inactive-value="false"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="自定义触发器"
          inactive-text="自定义触发器"
        />
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'true'" label="自定义触发器">
        <el-select v-model="trigger">
          <el-option
            v-for="(trigger, index) in triggers"
            :key="index"
            :label="trigger"
            :value="trigger"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'false'" label="触发器名称">
        <el-input v-model="triggername" />
      </el-form-item>
      <el-form-item v-if="isCustomTrigger === 'false'" label="触发器分组">
        <el-input v-model="triggergroup" />
      </el-form-item>

      <!-- SimpleTrigger -->
      <el-form-item
        v-if="selecttrigger === 'SimpleTrigger' && isCustomTrigger === 'false'"
        label="触发时间间隔"
      >
        <el-input v-model="simpletimesecond" placeholder="单位为秒" />
      </el-form-item>
      <el-form-item
        v-if="selecttrigger === 'SimpleTrigger' && isCustomTrigger === 'false'"
        label="触发器执行次数"
      >
        <el-input v-model="repeatcount" placeholder="请输入执行次数" />
      </el-form-item>

      <!-- CronTrigger -->
      <el-form-item
        v-if="selecttrigger === 'CronTrigger' && isCustomTrigger === 'false'"
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
        v-if="selecttrigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
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
      <el-form-item
        v-if="selecttrigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
        label="总执行次数"
      >
        <el-input v-model="dailyrepeatcount" placeholder="请输入总执行次数" />
      </el-form-item>
      <el-form-item
        v-if="selecttrigger === 'DailyTimeIntervalTrigger' && isCustomTrigger === 'false'"
        label="执行日选择(星期)"
      >
        <el-checkbox-group v-model="dailyworkday">
          <el-checkbox label="1">星期一</el-checkbox>
          <el-checkbox label="2">星期二</el-checkbox>
          <el-checkbox label="3">星期三</el-checkbox>
          <el-checkbox label="4">星期四</el-checkbox>
          <el-checkbox label="5">星期五</el-checkbox>
          <el-checkbox label="6">星期六</el-checkbox>
          <el-checkbox label="7">星期日</el-checkbox>
        </el-checkbox-group>
        <el-checkbox v-model="allDays" label="每一天" @change="setAllDays" />
        <el-checkbox v-model="workDays" label="工作日" @change="setWorkDays" />
        <el-checkbox v-model="weekendDays" label="周末" @change="setWeekendDays" />
      </el-form-item>

      <!-- CalendarIntervalTrigger -->
      <el-form-item
        v-if="selecttrigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
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
        v-if="selecttrigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
        label="触发器间隔次数"
      >
        <el-input v-model="calendarnum" placeholder="请输入间隔次数" />
      </el-form-item>
      <el-form-item
        v-if="selecttrigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'"
        label="是否使用夏令时"
      >
        <el-switch v-model="preserveHourOfDayAcrossDaylightSavings" />
      </el-form-item>
      <el-form-item class="zdycfq" v-if="selecttrigger === 'CalendarIntervalTrigger' && isCustomTrigger === 'false'">
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
      <el-button type="primary" @click="replace">挂载触发器</el-button>
      <el-button @click="closeModal">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
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
      jobs: [],
      job: "",
      priority: "",
      selecttrigger: "SimpleTrigger",
      isCustomTrigger: "false",
      triggername: "",
      triggergroup: "",
      triggers: [],
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
      allDays: false,
      workDays: false,
      weekendDays: false,
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
    },
    setAllDays() {
      if (this.allDays) {
        this.dailyworkday = ["1", "2", "3", "4", "5", "6", "7"];
        this.workDays = false;
        this.weekendDays = false;
      } else {
        this.dailyworkday = [];
      }
    },
    setWorkDays() {
      if (this.workDays) {
        this.dailyworkday = ["1", "2", "3", "4", "5"];
        this.allDays = false;
        this.weekendDays = false;
      } else {
        this.dailyworkday = [];
      }
    },
    setWeekendDays() {
      if (this.weekendDays) {
        this.dailyworkday = ["6", "7"];
        this.allDays = false;
        this.workDays = false;
      } else {
        this.dailyworkday = [];
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
:deep(.zdycfq .el-switch__core){
  width: 300px;
  height: 30px;
  position: absolute;left: -80px
}
</style>