<template>
  <div class="container">
    <div class="box">
      <div class="typeselect">
          <p>触发器类型选择</p>
          <div class="title">
          <span>触发器类型: </span>
          <el-select v-model="selecttrigger" placeholder="Select">
            <el-option :label="'SimpleTrigger'" :value="'SimpleTrigger'"/>
            <el-option :label="'CronTrigger'" :value="'CronTrigger'"/>
            <el-option :label="'DailyTimeIntervalTrigger'" :value="'DailyTimeIntervalTrigger'"/>
            <el-option :label="'CalendarIntervalTrigger'" :value="'CalendarIntervalTrigger'"/>
          </el-select>
        </div>
        <div class="title">
          <span>任务优先级: </span>
          <el-input v-model="priority" placeholder="Please input" @input="filterInput" maxlength="3"/>
        </div>
        <div class="title">
          <span>是否使用自定义触发器: </span>
          <el-switch v-model="isCustomTrigger"/>
        </div>
        <div class="title">
          <span>自定义触发器: </span>
          <el-select v-model="value" :disabled="!isCustomTrigger" placeholder="Select">
            <el-option
              v-for="(trigger, index) in triggers"
              :key="index"
              :label="trigger"
              :value="trigger"
            />
          </el-select>
        </div>
        
      </div>

      <div class="fg"></div>

      <div class="triggerdetail">
        <p>触发器详情</p>
        <div v-if="isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>触发器名称</span>
            <el-input v-model="triggername" placeholder="请输入触发器名称" />
          </div>

          <div class="detail">
            <span>触发器分组</span>
            <el-input v-model="triggergroup" placeholder="请输入触发器分组" />
          </div>

          <div class="detail">
            <span>设置时区</span>
            <el-input v-model="timezone" placeholder="请设置时区" />            
          </div>
          

        <div v-show="selecttrigger === 'SimpleTrigger' && this.isCustomTrigger === false " class="detailbox">
          <div class="detail">
            <span>触发时间间隔</span>
            <el-input v-model="priority" placeholder="单位为秒" />            
          </div>
          <div class="detail">
            <span>触发器执行次数</span>
            <el-input v-model="priority"/>
          </div>
        </div>

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

        <div v-show="selecttrigger === 'DailyTimeIntervalTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>触发器时间间隔单位</span>
            <el-select v-model="dailytime" placeholder="Select">
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
            <el-input v-model="dailynum"/>
          </div>
          <div class="detail">
            <span>总执行次数</span>
            <el-input v-model="dailyrepeatcount"/>
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
      <el-button @click="replace">更改触发器</el-button>
      <el-button @click="back">返回</el-button>
    </div>

  </div>
</template>
  
<script>
import axios from 'axios';
import 'vue3-cron-plus-picker/style.css'
import {Vue3CronPlusPicker} from 'vue3-cron-plus-picker'

export default {
  components : {"Vue3CronPlusPicker":Vue3CronPlusPicker,},
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
      oldtriggername:"",
      oldtriggergroup:"",

      priority: "", // 任务优先级

      selecttrigger: "DailyTimeIntervalTrigger",
      // 是否使用自定义触发器的选项
      isCustomTrigger: false,

      // 触发器名称和组名
      triggername: "",
      triggergroup: "",

      // SimpleTrigger 特定属性
      simpletimesecond: "", // 时间间隔秒数
      repeatcount: "", // 执行次数

      // CronTrigger 特定属性
      cronexpression: "", // cron 表达式
      showCron:false,
			expression:"* * * * * * *",

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
      all: false,
      workday: false,
      weekend: false,
      Info:{},
    };
  },
  watch: {
    jobinfo: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selecttrigger = newVal.selecttrigger || "DailyTimeIntervalTrigger";
          this.priority = newVal.priority || "";
          this.isCustomTrigger = newVal.isCustomTrigger || false;
          this.triggers = newVal.triggers || [];
          this.value = newVal.value || "";
        }
      }
    }
  },
  methods: {
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
    filterInput(value) {
      // 使用正则表达式替换所有非数字字符为空字符串
      this.priority = value.replace(/\D/g, '');
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
      console.log('checkday4');
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
    back(){
        this.$emit('close');
      },
    async getTrigger() {
      try {
         const response = await axios.post("http://114.132.71.250:8002/task/Reflect/triggerclass");
        console.log(response);
        this.triggers = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async replace(){
      console.log(this.oldtriggername);
      console.log(this.oldtriggergroup);

      if(this.checkTrigger()){
        this.builInfo();
        console.log(this.Info);
        try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Update/updateTrigger?oldtriggername=" +this.oldtriggername+"&oldtriggergroup="+this.oldtriggergroup,this.Info
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
    async checkTrigger(){
      console.log(this.isCustomTrigger);
      if (this.priority > 999 || this.priority < 0) {
        tip = tip + "优先级范围为0~999\n";
      }
      if(this.isCustomTrigger === "true"){
        return true;
      }else if(this.selecttrigger === "SimpleTrigger"){
        if( !(
            (this.simpletimesecond === "" && this.repeatcount === "") ||
            (this.simpletimesecond !== "" && this.repeatcount !== "")
          )){
          alert("SimpleTrigger的时间间隔秒数或执行次数不能为空");
          return false;
        }
      }else if(this.selecttrigger === "CronTrigger"){
        if (this.cronexpression !== "") {
          const response = await axios.post(
            "http://114.132.71.250:8002/task/Util/cron-check?cron=" +
              this.cronexpression
          );
          console.log(response);
          if (response.data.message === "cron表达式格式错误！") {
            alert("cron表达式不合法");
            return false;
          }
        }
      }else if(this.selecttrigger === "CalendarIntervalTrigger"){
        if (
          !(
            (this.calendarnum === "" && this.timezone === "") ||
            (this.calendarnum !== "" && this.timezone !== "")
          )
        ) {
          alert("请输入完整参数或请清空输入使用默认参数");
          return false;
        }
      }else if(this.selecttrigger === "DailyTimeIntervalTrigger"){
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

    builInfo(){
      this.Info.triggername = this.triggername;
      this.Info.triggergroup = this.triggergroup;

      this.Info.priority = this.priority;
      this.Info.type = this.selecttrigger;
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if(this.isCustomTrigger === "true"){
        this.Info.trigger = this.selecttrigger;
      }else{
        this.Info.triggername = this.triggername;
        this.Info.triggergroup = this.triggergroup;
        if(this.selecttrigger === "SimpleTrigger"){
          this.Info.simpletimesecond = this.simpletimesecond;
          this.Info.repeatcount = this.repeatcount;
      }else if(this.selecttrigger === "CronTrigger"){
          this.Info.cronexpression = this.cronexpression;
      }else if(this.selecttrigger === "CalendarIntervalTrigger"){
          this.Info.calendartime = this.calendartime;
          this.Info.calendarnum = this.calendarnum;
          this.Info.preserveHourOfDayAcrossDaylightSavings = this.preserveHourOfDayAcrossDaylightSavings;
          this.Info.skipDayIfHourDoesNotExist = this.skipDayIfHourDoesNotExist;
          this.Info.timezone = this.timezone;
      }else if(this.selecttrigger === "DailyTimeIntervalTrigger"){
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
    console.log(this.jobinfo);
    this.oldtriggername = this.jobinfo.triggername;
    this.oldtriggergroup = this.jobinfo.triggergroup;
    this.triggername = this.jobinfo.triggername;
    this.triggergroup = this.jobinfo.triggergroup;
  },
};
</script>
  
<style scoped>
.container {
  width: 750px;
  height: 510px;
  padding: 10px;
  flex-direction: column;
  display: flex;
  z-index: 500;
}

.fg{
  border-left: 1px solid #000;
}

.box {
  display: flex;
  flex-direction: row;
  height: 510px;
}

.box p {
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.typeselect {
  width: 350px;
  margin-right: 14.5px;
}

.title{
  width: 350px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 20px;
}

.typeselect .el-select{
  width: 210px;
}

.typeselect .el-input{
  width: 210px;
}

.triggerdetail {
  margin-left: 14.5px;
  width: 350px;
}

.detailbox{
  width: 350px;
  height: 32px;
  font-size: 20px;
  margin-top: 20px;
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