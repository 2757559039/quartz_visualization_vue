<template>
  <!-- 更新触发器信息 -->
  <div class="container">
    <div class="box">
      <div class="trigger">
      <div class="title">
        <span>触发器名称:</span>
        <span>{{ triggername }}</span>
      </div>
      <div class="title">
        <span>触发器分组:</span>
        <span>{{ triggergroup }}</span>
      </div>
      <div class="title1">
        <p>触发器类型:</p>
        <p style="text-align: right;">{{ selecttrigger }}</p>
      </div>

      <!-- 可修改项 -->
      <div class="title">
        <span>任务优先级:</span>
        <el-input-number v-model="priority" :min="0" :max="999" />
      </div>
      <div class="title" >
        <span>是否使用自定义触发器</span>
        <el-switch v-model="isCustomTrigger"/>
      </div>
      <div class="title1" v-if="isCustomTrigger === true">
        <span>自定义触发器</span>
        <el-select v-model="trigger" :disabled="!isCustomTrigger" @focus="getTrigger()">
          <el-option
            v-for="(trigger, index) in triggers"
            :key="index"
            :label="trigger"
            :value="trigger"
          />
        </el-select>
      </div>

      <div class="title" v-if="isCustomTrigger === false">
            <span>设置时区</span>
            <el-input v-model="timezone" placeholder="请设置时区" />            
          </div>

      <div class="title" v-if="isCustomTrigger === false">
          <span>开始任务时间: </span>
            <el-date-picker
              v-model="startTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择开始日期"
              :disabled-date="disabledStartDate"
            />
        </div>
          <div class="title" v-if="isCustomTrigger === false">
            <span>结束任务时间: </span>
            <el-date-picker
            :disabled="startTime === ''"
              v-model="endTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
              :disabled-date="disabledEndDate"
            />
          </div>
    </div>

    <div class="fg"></div>
    <!-- 修改触发器专属信息--按触发器类型 -->
    <div class="triggerDetail">
        <div v-if="isCustomTrigger === false" class="detailbox">
          <!-- SimpleTrigger -->
        <div v-show="selecttrigger === 'SimpleTrigger' && this.isCustomTrigger === false " class="detailbox">
          <div class="detail">
            <span>触发时间间隔</span>
            <el-input v-model="simpletimesecond" placeholder="单位为秒" />            
          </div>
          <div class="detail">
            <span>触发器执行次数</span>
            <el-input v-model="repeatcount"/>
          </div>
        </div>
          <!--CronTrigger  -->
        <div v-show="selecttrigger === 'CronTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>cron字段</span>
            <el-input class="elInput" v-model="cronexpression"  @click="openDialog" :clearable="true"  placeholder="请输入正确的cron表达式">
            </el-input>
            <el-dialog v-model="showCron">
              <Vue3CronPlusPicker @hide="closeDialog" @fill="fillValue" :expression="expression"/>
            </el-dialog>         
          </div>
        </div>

        <!-- CalendarIntervalTrigger -->
        <div v-show="selecttrigger === 'CalendarIntervalTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>触发器时间间隔单位</span>
            <el-select v-model="calendartime" placeholder="Select">
              <el-option :label="'秒钟'" :value="'second'"/>
              <el-option :label="'分钟'" :value="'minute'"/>
              <el-option :label="'小时'" :value="'hour'"/>
              <el-option :label="'天'" :value="'day'"/>
              <el-option :label="'月'" :value="'month'"/>
              <el-option :label="'年'" :value="'year'"/>
            </el-select>
          </div>

          <div class="detail">
            <span>触发器间隔次数</span>
            <el-input v-model="calendarnum"/>            
          </div>
          <div class="detail">
            <span>是否使用夏令时</span>
            <el-switch v-model="preserveHourOfDayAcrossDaylightSavings"/>            
          </div>
          <div class="detail">
            <span>设置当小时不存在时是否跳过这一天</span>
            <el-switch v-model="skipDayIfHourDoesNotExist"/>            
          </div>
        </div>

        <!-- DailyTimeIntervalTrigger -->
        <div v-show="selecttrigger === 'DailyTimeIntervalTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>触发器时间间隔单位</span>
            <el-select v-model="dailytime" placeholder="Select">
              <el-option :label="'秒钟'" :value="'second'"/>
              <el-option :label="'分钟'" :value="'minute'"/>
              <el-option :label="'小时'" :value="'hour'"/>
            </el-select>
          </div>
          <div class="detail">
            <span>触发器间隔次数</span>
            <el-input v-model="dailynum"/>
          </div>
          <div class="detail">
            <span>总执行次数</span>
            <el-input v-model="dailyrepeatcount"/>
          </div>
          <div class="detail">
            <span>当天开始时间</span>
            <el-time-picker v-model="DayStartTime" placeholder="请选择" format="HH:mm:ss" value-format="HH:mm:ss" />
          </div>
          <div class="detail">
            <span>当天结束时间</span>
            <el-time-picker v-model="DayEndTime" placeholder="请选择" format="HH:mm:ss" value-format="HH:mm:ss" />
          </div>
          <div class="detail1">
            <span>执行日选择(星期)</span>
            <div> 
              <el-checkbox v-model="all" label="all" @change="checkall">每一天</el-checkbox>
              <el-checkbox v-model="workday" label="workday" @change="checkworkday">工作日</el-checkbox>
              <el-checkbox v-model="weekend" label="weekend" @change="checkweekend">周末</el-checkbox>
              <el-checkbox-group v-model="dailyworkday" @change="checkday">
                <el-checkbox label=1>星期一</el-checkbox>
                <el-checkbox label=2>星期二</el-checkbox>
                <el-checkbox label=3>星期三</el-checkbox>
                <el-checkbox label=4>星期四</el-checkbox>
                <el-checkbox label=5>星期五</el-checkbox>
                <el-checkbox label=6>星期六</el-checkbox>
                <el-checkbox label=7>星期日</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
    <div class="buttonbox"> 
      <el-button @click="replace">更改触发器参数</el-button>
      <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>
  
<script>
//? 自定义禁用逻辑

import axios from "axios";
import { mapState } from 'vuex';
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';
import 'vue3-cron-plus-picker/style.css';
import { tr } from "element-plus/es/locales.mjs";
export default {
  components: {
    Vue3CronPlusPicker
  },
  props: {
    jobinfo: {
      type: Object,
      required: true,
      // 默认值是一个空对象，避免直接修改父组件传递的对象
      default: () => ({}),
    },
  },
  data() {
    return {
      isCustomTrigger: "false",
      triggers: [],
      trigger: "",

      selecttrigger: '',

      priority: "", // 任务优先级
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      // 是否使用自定义触发器的选项
      

      // 触发器名称和组名
      triggername: "",
      triggergroup: "",

      // SimpleTrigger 特定属性
      simpletimesecond: "", // 时间间隔秒数
      repeatcount: "", // 执行次数

      // CronTrigger 特定属性
      cronexpression: "", // cron 表达式
      showCron:false,
			expression:"* * * * * ? *",

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
      DayStartTime: "", // 当天开始时间
      DayEndTime: "", // 当天结束时间
      dailyworkday: [],
      workday: false,
      weekend: false,
      all: false,
      options: ["1", "2", "3", "4", "5", "6", "7", "workday", "weekend", "all"], // 可选工作日

      Info: {},
    };
  },
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {

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


    openDialog () {
			this.showCron = true;
			if (this.cronexpression != ""){
				this.expression = this.cronexpression
			}
		},
		closeDialog(){
			this.showCron = false;
		},
		fillValue(cronValue){
			this.cronexpression = cronValue;
		},
    async getTrigger() {
      try {
        let type = this.jobinfo.type;
        if(type ==="SimpleTrigger"){
          type = "SimpleUpdateTrigger";
        }else if(type ==="CronTrigger"){
          type = "CronUpdateTrigger";
        }else if(type ==="DailyTimeIntervalTrigger"){
          type = "DailyUpdateTimeIntervalTrigger";
        }else if(type ==="CalendarIntervalTrigger"){
          type = "CalendarUpdateIntervalTrigger";
        }
        const response = await axios.post(
          this.baseURL + "/task/Reflect/updatetriggerclass",null,{
            params: {
              type: type
            },
          }
        );
        
        this.triggers = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async replace() {
      if (await this.checkTrigger() === true) {
        this.builInfo();
        try {
          const response = await axios.post(
            this.baseURL + "/task/Update/updatetrigeerargument",
            this.Info
          );
          
          this.$emit('close');

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


      if (this.isCustomTrigger === true) {
        if (this.trigger === "") {
          alert("请选择触发器类型");
          return false;
        }
        return true;
      } else {
        if (this.selecttrigger === "") {
          alert("请选择触发器类型");
          return false;
        } else if (this.startTime === "" || this.endTime === "") {
          alert("开始时间或结束时间不能为空");
          return false;
        } else if (this.priority === "") {
          alert("任务优先级不能为空");
          return false;
        } else if (this.triggername === "" || this.triggergroup === "") {
          alert("触发器名称或触发器分组不能为空");
          return false;
        } else if (this.timezone === "") {
          alert("时区不能为空");
          return false;
        }
        if (this.selecttrigger === "SimpleTrigger") {
          if ( this.simpletimesecond === "" || this.repeatcount === "") {
            alert("SimpleTrigger的时间间隔秒数或执行次数不能为空");
            return false;
          }
        } else if (this.selecttrigger === "CronTrigger") {
          if (this.cronexpression !== "") {
            const response = await axios.post(
              this.baseURL + "/task/Util/cron-check?cron=" +
                this.cronexpression
            );
            
            if (response.data.message === "cron表达式格式错误！") {
              alert("cron表达式不合法");
              return false;
            }
          }
          else{
            alert("cron表达式不能为空");
            return false;
          }
        } else if (this.selecttrigger === "CalendarIntervalTrigger") {
          if ( this.calendartime === "" || this.calendarnum === "") {
            alert("请输入完整参数或请清空输入使用默认参数");
            return false;
          }
        } else if (this.selecttrigger === "DailyTimeIntervalTrigger") {
          if ( this.dailytime === "" || this.dailynum === "" || this.dailyrepeatcount === "" || this.DayStartTime === "" || this.dailyworkday.length === 0) {
            alert("请输入完整参数或请清空输入使用默认参数");
            return false;
          }
        }
      }
      return true;
    },

    builInfo() {
      this.Info.triggername = this.triggername;
      this.Info.triggergroup = this.triggergroup;
      this.Info.type = this.selecttrigger;
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if (this.isCustomTrigger === true) {
        this.Info.trigger = this.trigger;
      } else {
        this.Info.priority = this.priority;

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
          this.Info.DayStartTime = this.DayStartTime;
          this.Info.DayEndTime = this.DayEndTime;
          this.Info.dailyworkday = this.dailyworkday;
        }
      }
    },
    checkall(){
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
    checkworkday(){
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
    checkweekend(){
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
    back(){
        this.$emit('close');
      },
  },
  created() {
    this.getTrigger();
    this.triggername = this.jobinfo.triggername;
    this.triggergroup = this.jobinfo.triggergroup;
    this.priority = this.jobinfo.priority;
    this.selecttrigger = this.jobinfo.type;
    this.startTime = this.jobinfo.startime;
    this.endTime = this.jobinfo.endtime;
    if(this.jobinfo.trigger === "" || this.jobinfo.trigger === null || this.jobinfo.trigger === undefined){
      this.isCustomTrigger = false;
    }else{
      this.isCustomTrigger = true;
      this.trigger = this.jobinfo.trigger;
    }
  },
};
</script>
  
<style scoped>

.container{
  width: 690px;
  height: 600px;
  font-size: 20px;
}

.box{
  /* width: 300px; */
  display: flex;
}

.fg{
  border-left: 1px solid #000;
}

.trigger{
  width: 300px;
  margin-right: 14px;
}
.title{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title1{
  margin-bottom: 20px;
}

.title1 p{
  margin-bottom: 10px;
}

:deep(.title1 .el-select){
  margin-top: 10px;
  font-size: 20px;
  height: 40px;
}

:deep(.title .el-input){
  width: 150px;
}

.triggerDetail{
  width: 300px;
  height: 420px;
  margin-left: 14px;
}


.detailbox{
  width: 350px;
  height: 32px;
  font-size: 20px;
}

.detailbox .el-select{
  width: 100px;
}

.detailbox .el-input{
  width: 200px;
}

.detail{
  width: 350px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 10px;
}

.detail1{
  width: 350px;
  height: 32px;
  font-size: 20px;
  margin-top: 10px;
}

.detail1 .el-checkbox{
  --el-checkbox-font-size: 20px;
  margin-top: 10px;
  margin-right: 10px;
}

.detail1 .el-checkbox__label{
  font-size: 20px;
}


.buttonbox{
  column-gap:0;
  gap: 0px;
  margin-top: 20px;
  flex-direction: column;
  display: flex;
}

.buttonbox button{
  width: 600px !important;
  font-size: 24px;
  width: 128px;
  height: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

:deep(.detail .el-dialog){
  width: 600px;
}

:deep(.detail .el-dialog .el-select){
  width: 150px;
}

</style>