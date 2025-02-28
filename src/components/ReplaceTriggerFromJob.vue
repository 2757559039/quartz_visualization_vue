<template>
  <div class="container">
    <div class="box">
      <div class="typeselect">
          <p>触发器基础信息</p>
          <div class="title">
            <span>旧触发器分组</span>
            <el-select v-model="oldtriggergroup"  placeholder="Select" @change="getTriggerName()">
            <el-option
              v-for="(trigger, index) in oldtriggergroups"
              :key="index"
              :label="trigger"
              :value="trigger"
            />
          </el-select>
          </div>
          <div class="title">
            <span>旧触发器名称</span>
            <el-select v-model="oldtriggername" placeholder="Select">
            <el-option
              v-for="(trigger, index) in oldtriggernames"
              :key="index"
              :label="trigger"
              :value="trigger"
            />
          </el-select>
          </div>
          <div class="title">
          <span>触发器类型: </span>
          <el-select v-model="selecttrigger" placeholder="Select" @change="getTrigger()">
            <el-option :label="'SimpleTrigger'" :value="'SimpleTrigger'"/>
            <el-option :label="'CronTrigger'" :value="'CronTrigger'"/>
            <el-option :label="'DailyTimeIntervalTrigger'" :value="'DailyTimeIntervalTrigger'"/>
            <el-option :label="'CalendarIntervalTrigger'" :value="'CalendarIntervalTrigger'"/>
          </el-select>
        </div>

        <div class="title">
          <span>是否使用自定义触发器: </span>
          <el-switch v-model="isCustomTrigger"/>
        </div>
        <div class="title">
          <span>自定义触发器: </span>
          <el-select v-model="trigger" :disabled="!isCustomTrigger" placeholder="Select">
            <el-option
              v-for="(trigger, index) in triggers"
              :key="index"
              :label="trigger"
              :value="trigger"
            />
          </el-select>
        </div>

        <div class="title" v-if="isCustomTrigger === false">
          <span>任务优先级: </span>
          <el-input-number v-model="priority" :min="1" :max="999" />
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
              v-model="endTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
              :disabled-date="disabledEndDate"
            />
          </div>

          <div class="title" v-if="isCustomTrigger === false">
            <span>设置时区</span>
            <el-input v-model="timezone" placeholder="请设置时区" />            
          </div>
        
      </div>

      <div class="fg"></div>

      <div class="triggerdetail">
        <p>触发器详情</p>
        <div class="detailbox">
          <div class="detail" v-if="isCustomTrigger === false">
            <span>触发器名称</span>
            <el-input v-model="triggername" placeholder="请输入触发器名称" />
          </div>

          <div class="detail" v-if="isCustomTrigger === false">
            <span>触发器分组</span>
            <el-input v-model="triggergroup" placeholder="请输入触发器分组" />
          </div>


        <div v-if="selecttrigger === 'SimpleTrigger' && this.isCustomTrigger === false " class="detailbox">
          <div class="detail">
            <span>触发时间间隔</span>
            <el-input v-model="simpletimesecond" placeholder="单位为秒" />            
          </div>
          <div class="detail">
            <span>触发器执行次数</span>
            <el-input v-model="repeatcount"/>
          </div>
        </div>

        <div v-if="selecttrigger === 'CronTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>cron字段</span>
            <el-input class="elInput" v-model="cronexpression"  @click="openDialog" :clearable="true"  placeholder="请输入正确的cron表达式">
            </el-input>
            <el-dialog v-model="showCron">
              <Vue3CronPlusPicker @hide="closeDialog" @fill="fillValue" :expression="expression"/>
            </el-dialog> 
            
          </div>
        </div>

        <div v-if="selecttrigger === 'CalendarIntervalTrigger' && this.isCustomTrigger === false" class="detailbox">
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

        <div v-if="selecttrigger === 'DailyTimeIntervalTrigger' && this.isCustomTrigger === false" class="detailbox">
          <div class="detail">
            <span>触发器时间间隔单位</span>
            <el-select v-model="dailytime" placeholder="Select">
              <el-option :label="'秒钟'" :value="'second'"/>
              <el-option :label="'分钟'" :value="'minute'"/>
              <el-option :label="'小时'" :value="'hour'"/>
              <!-- <el-option :label="'天'" :value="'day'"/>
              <el-option :label="'月'" :value="'month'"/>
              <el-option :label="'年'" :value="'year'"/> -->
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
            <el-time-picker v-model="DayStartTime" placeholder="Arbitrary time" format="HH:mm:ss" value-format="HH:mm:ss"/>
          </div>
          <div class="detail">
            <span>当天结束时间</span>
            <el-time-picker v-model="DayEndTime" placeholder="Arbitrary time" format="HH:mm:ss" value-format="HH:mm:ss"/>
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
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';
import 'vue3-cron-plus-picker/style.css';
import { tr } from 'element-plus/es/locales.mjs';

export default {

  components: {
    Vue3CronPlusPicker
  },
  props: {
  },
  data() {
    return {
      oldtriggergroups: [],
      oldtriggernames: [],
      oldtriggername:"",
      oldtriggergroup:"",

      priority: "", // 任务优先级
      startTime: "", // 开始时间
      endTime: "", // 结束时间

      selecttrigger: "",
      // 是否使用自定义触发器的选项
      isCustomTrigger: false,
      triggers: [], // 触发器列表
      trigger: "", // 自定义触发器

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
      DayStartTime: "", // 当天开始时间
      DayEndTime: "", // 当天结束时间
      dailyworkday: [], // 工作日选择, 数组因为是多选框
      all: false,
      workday: false,
      weekend: false,
      Info:{},
    };
  },
  watch: {
  },
  methods: {

    getTriggerGroup(){
      axios.post("/task/Select/triggergroupall").then((response) => {
        console.log(response);
        this.oldtriggergroups = response.data.data;
      });
    },

    getTriggerName(){
      console.log(this.oldtriggergroup);
      axios.post("/task/Select/Triggername",null,{
        params: {
          jobgroup : this.oldtriggergroup,
        },
      }).then((response) => {
        console.log(response);
        this.oldtriggernames = response.data.data;
      });
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
      console.log('111')
        this.$emit('close');
      },
    async getTrigger() {
      try {
         const response = await axios.post("/task/Reflect/triggerclass",null,{
          params: {
            type: this.selecttrigger,
          },
         });
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

      console.log(this.checkTrigger());
      if(await this.checkTrigger() === true){
        this.builInfo();
        console.log(this.Info);
        try {
        const response = await axios.post(
          "/task/Update/updateTrigger?oldtriggername=" +this.oldtriggername+"&oldtriggergroup="+this.oldtriggergroup,this.Info
        );
        console.log(response);
        if(response.data.data == 'success'){
          alert("更改成功");
          this.back();
        }else{
          this.$message.error('更改失败,请检查输入及触发器是否已存在');
        }
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

      if(this.oldtriggergroup === "" || this.oldtriggername === ""){
        alert("请选择旧触发器");
        return false;
      }

      if(this.isCustomTrigger === true){
        if(this.trigger === ""){
          alert("请选择自定义触发器");
          return false;
        }
        return true;
      }
      else if(this.selecttrigger === ""){
        alert("请选择触发器类型");
        return false;
      }else if(this.triggername === "" || this.triggergroup === ""){
        alert("触发器名称和分组不能为空");
        return false;
      }else if(this.startTime === ""){
        alert("开始时间不能为空");
        return false;
      }else if(this.timezone === ""){
        alert("时区不能为空");
        return false;
      }else if(this.selecttrigger === "SimpleTrigger"){
        if( this.simpletimesecond === "" || this.repeatcount === ""){
          alert("SimpleTrigger的时间间隔秒数或执行次数不能为空");
          return false;
        }
      }else if(this.selecttrigger === "CronTrigger"){
        if( this.cronexpression === ""){
          alert("请输入cron表达式");
          return false;
        }
        if (this.cronexpression !== "") {
          const response = await axios.post(
            "/task/Util/cron-check?cron=" +
              this.cronexpression
          );
          console.log(response);
          if (response.data.message === "cron表达式格式错误！") {
            alert("cron表达式不合法");
            return false;
          }
        }
      }else if(this.selecttrigger === "CalendarIntervalTrigger"){
        if ( this.calendartime === "" || this.calendarnum === "")  {
          alert("请输入完整参数");
          return false;
        }
      }else if(this.selecttrigger === "DailyTimeIntervalTrigger"){
        if ( this.dailytime === "" || this.dailynum === "" || this.dailyrepeatcount === "" || this.dailyworkday.length === 0 || this.DayStartTime === "") {
          alert("请输入完整参数");
          return false;
        }
      }
      return true;
    },

    builInfo(){
      this.Info.oldtriggername = this.oldtriggername;
      this.Info.oldtriggergroup = this.oldtriggergroup;

      this.Info.type = this.selecttrigger;
      this.Info.isCustomTrigger = this.isCustomTrigger;
      if(this.isCustomTrigger === true){
          this.Info.trigger = this.trigger;
      }else{
        this.Info.triggername = this.triggername;
      this.Info.triggergroup = this.triggergroup;

      this.Info.priority = this.priority;
        this.Info.startTime = this.startTime;
        if(this.endTime){
          this.Info.endTime = this.endTime;
        }
        this.Info.timezone = this.timezone;
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
          if(this.Info.dailynum){
            this.Info.dailytime = this.dailytime;
          }
          this.Info.dailynum = this.dailynum;
          this.Info.dailyrepeatcount = this.dailyrepeatcount;
          this.Info.dailyworkday = this.dailyworkday;
      }
    }
  },
},
  created() {
    this.getTrigger();
    this.getTriggerGroup();
    console.log(this.jobinfo);
  },
};
</script>
  
<style scoped>
.container {
  width: 750px;
  height: 560px;
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
  height: 600px;
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

.buttonbox {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.buttonbox button {
  font-size: 24px;
  width: 640px;
  height: 60px;
  margin-left: 0;
  /* margin: 10px 0; */
}

:deep(.detail .el-dialog){
  width: 600px;
}

:deep(.detail .el-dialog .el-select){
  width: 150px;
}

</style>