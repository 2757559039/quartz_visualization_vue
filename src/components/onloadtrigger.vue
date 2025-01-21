<template>
  <div>
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

        <div
          v-show="
            selecttrigger === 'SimpleTrigger' &&
            this.isCustomTrigger === 'false'
          "
        >
          <span>触发时间间隔</span>
          <input v-model="simpletimesecond" placeholder="单位为秒" />
          <br />
          <span>触发器执行次数</span>
          <input v-model="repeatcount" />
        </div>

        <div
          v-show="
            selecttrigger === 'CronTrigger' && this.isCustomTrigger === 'false'
          "
        >
          <span>cron字段</span>
          <input v-model="cronexpression" placeholder="请输入cron格式字段" />
        </div>

        <div
          v-show="
            selecttrigger === 'CalendarIntervalTrigger' &&
            this.isCustomTrigger === 'false'
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
          v-show="
            selecttrigger === 'DailyTimeIntervalTrigger' &&
            this.isCustomTrigger === 'false'
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

          <div>已选中的值: {{ dailyworkday }}</div>
        </div>
        <br />
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
      jobgroups: [],
      jobgroup: "group1",

      jobs: [],
      job: "",

      priority: "", // 任务优先级

      selecttrigger: "",
      // 是否使用自定义触发器的选项
      isCustomTrigger: "false",

      // 触发器名称和组名
      triggername: "",
      triggergroup: "",

      // SimpleTrigger 特定属性
      simpletimesecond: "", // 时间间隔秒数
      repeatcount: "", // 执行次数

      // CronTrigger 特定属性
      cronexpression: "", // cron 表达式

      // CalendarIntervalTrigger 特定属性
      calendartime: "second", // 默认时间单位为秒
      calendarnum: "", // 间隔次数
      preserveHourOfDayAcrossDaylightSavings: "false",
      skipDayIfHourDoesNotExist: "false",
      timezone: "Asia/Shanghai", // 时区

      // DailyTimeIntervalTrigger 特定属性
      dailytime: "second", // 默认时间单位为秒
      dailynum: "", // 间隔次数
      dailyrepeatcount: "", // 总执行次数
      dailyworkday: [], // 工作日选择, 数组因为是多选框
      options: ["1", "2", "3", "4", "5", "6", "7", "workday", "weekend", "all"], // 可选工作日

      Info: {},
    };
  },
  methods: {
    async getjobgroups(){
        try {
            const response = await axios.post("http://114.132.71.250:8002/task/Select/jobgroupall");
            console.log(response);
            this.jobgroups = response.data.data;
        } catch (error) {
            this.errorMessage = "请求失败，请检查网络连接";
            console.error;
        }
    },

    async select(jobgroup){
        try {
            const response = await axios.post("http://114.132.71.250:8002/task/Select/FINDjobBYgroup?group=" + jobgroup);
            console.log(response);
            this.jobs = response.data.data;
        } catch (error) {
            this.errorMessage = "请求失败，请检查网络连接";
            console.error;
        }
    },

    async getTrigger() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/triggerclass"
        );
        console.log(response);
        this.triggers = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async replace() {

      if (this.checkTrigger()) {
        this.builInfo();
        console.log(this.Info);
        try {
          const response = await axios.post(
            "http://114.132.71.250:8002/task/Add/jobTOtri",
            this.Info
          );
          console.log(response);

          // 重置表单
        } catch (error) {
          // 处理网络错误或其他错误
          this.errorMessage = "请求失败，请检查网络连接";
          console.error;
        }
      }
      // const 一个设计 jobinfo
    },
    async checkTrigger() {
      console.log(this.isCustomTrigger);
      if (this.priority > 999 || this.priority < 0) {
        alert("优先级范围为0~999");
        return false;
      }
      if (this.isCustomTrigger === "true") {
        return true;
      } else if (this.selecttrigger === "SimpleTrigger") {
        if (
          !(
            (this.simpletimesecond === "" && this.repeatcount === "") ||
            (this.simpletimesecond !== "" && this.repeatcount !== "")
          )
        ) {
          alert("SimpleTrigger的时间间隔秒数或执行次数不能为空");
          return false;
        }
      } else if (this.selecttrigger === "CronTrigger") {
        if (this.cronexpression !== "") {
          const response = await axios.post(
            "http://114.132.71.250:8002/task/Util/cron-check?cron=" +
              this.cronexpression
          );
          if (response.data.message === "cron表达式格式错误！") {
            alert("cron表达式不合法");
            return false;
          }
        }
      } else if (this.selecttrigger === "CalendarIntervalTrigger") {
        if (
          !(
            (this.calendarnum === "" && this.timezone === "") ||
            (this.calendarnum !== "" && this.timezone !== "")
          )
        ) {
          alert("请输入完整参数或请清空输入使用默认参数");
          return false;
        }
      } else if (this.selecttrigger === "DailyTimeIntervalTrigger") {
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
        console.log(this.job);
        this.Info.jobname = this.job.jobname;
        this.Info.jobgroup = this.job.jobgroup;
        this.Info.jobclassname = this.job.jobclassname;
      this.Info.triggername = this.triggername;
      this.Info.triggergroup = this.triggergroup;

      this.Info.priority = this.priority;
      this.Info.type = this.selecttrigger;
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if (this.isCustomTrigger === "true") {
        this.Info.trigger = this.selecttrigger;
      } else {
        this.Info.triggername = this.triggername;
        this.Info.triggergroup = this.triggergroup;
        if (this.selecttrigger === "SimpleTrigger") {
          this.Info.simpletimesecond = this.simpletimesecond;
          this.Info.repeatcount = this.repeatcount;
        } else if (this.selecttrigger === "CronTrigger") {
          this.Info.cronexpression = this.cronexpression;
        } else if (this.selecttrigger === "CalendarIntervalTrigger") {
          this.Info.calendartime = this.calendartime;
          this.Info.calendarnum = this.calendarnum;
          this.Info.preserveHourOfDayAcrossDaylightSavings =
            this.preserveHourOfDayAcrossDaylightSavings;
          this.Info.skipDayIfHourDoesNotExist = this.skipDayIfHourDoesNotExist;
          this.Info.timezone = this.timezone;
        } else if (this.selecttrigger === "DailyTimeIntervalTrigger") {
          this.Info.dailytime = this.dailytime;
          this.Info.dailynum = this.dailynum;
          this.Info.dailyrepeatcount = this.dailyrepeatcount;
          this.Info.dailyworkday = this.dailyworkday;
        }
      }
    },
  },
  created() {
    this.getTrigger();
    this.getjobgroups();
  },
};
</script>

<style>
</style>