<template>
  <!-- 添加任务 弹窗组件 -->
  <el-dialog v-model="isVisible" title="任务配置" :before-close="closeModal">
    <el-form label-width="30%" class="two-column-form">
      <div class="title">
        <!-- 任务属性 -->
        <div id="tour-addjob-left" class="left">
          <el-form-item label="任务名">
            <el-input v-model="jobName" />
          </el-form-item>
          <el-form-item label="任务分组">
            <el-input v-model="jobGroup" />
          </el-form-item>
          <el-form-item label="任务类名">
            <el-select v-model="jobClassName" @focus="getJob()">
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
            <el-select v-model="jobDetail" :disabled="isCustomJobDetail === 'false'" @focus="getJobDetail()">
              <el-option
                v-for="(JobDetail, index) in JobDetails"
                :key="index"
                :label="JobDetail"
                :value="JobDetail"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- 触发器属性 -->
        <div id="tour-addjob-right" class="right">
          <!-- 选择触发器类型 -->
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

          <!-- 选择触发器实现类 -->
          <el-form-item v-if="isCustomTrigger === 'true'" label="触发器实现类">
            <el-select v-model="selecttrigger" @focus="getTrigger">
              <el-option
                v-for="(trigger, index) in triggers"
                :key="index"
                :label="trigger"
                :value="trigger"
              />
            </el-select>
          </el-form-item>

          <!-- 触发器通用属性 -->
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

          <!-- 触发器专属属性 -->

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
            label="时间间隔单位"
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
            label="时间间隔单位"
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

    <!-- 底部按钮 -->
    <template #footer>
      <div class="button-container">
        <el-button id="tour-addjob-btn" @click="addjob">增加任务</el-button>
        <el-button id="tour-addfreejob-btn" @click="addfreejob">增加空闲任务</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { mapState } from 'vuex';
// 第三方cron表达式组件
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';
import 'vue3-cron-plus-picker/style.css';

export default {
  components: {
    Vue3CronPlusPicker
  },
  data() {
    return {
      // 任务名称
      jobName: "",
      // 任务组
      jobGroup: "",
      // 任务类名
      jobClassName: "",
      // 任务类名组
      jobClassNameGroup: [],
      // 任务描述
      jobDescription: "",
      // 是否自定义任务详情
      isCustomJobDetail: "false",
      // 任务详情列表
      JobDetails: [],
      // 任务详情
      jobDetail: "",

      // 触发器类型
      trigger: "SimpleTrigger",
      // 是否自定义触发器
      isCustomTrigger: "false",
      // 触发器列表
      triggers: [],
      // 选择的触发器
      selecttrigger: "",

      // 开始时间
      startTime: "",
      // 结束时间
      endTime: "",
      // 优先级
      priority: 5,
      // 时区
      timezone: "Asia/Shanghai",

      // 触发器名称
      triggername: "",
      // 触发器组
      triggergroup: "",

      // 简单时间间隔（秒）
      simpletimesecond: "",
      // 重复次数
      repeatcount: "",

      // Cron表达式
      cronexpression: "",

      // 日历时间单位
      calendartime: "second",
      // 日历时间数量
      calendarnum: "",
      // 保留跨夏令时的小时
      preserveHourOfDayAcrossDaylightSavings: false,
      // 如果小时不存在则跳过该天
      skipDayIfHourDoesNotExist: false,

      // 时间间隔单位
      dailytime: "second",
      // 时间间隔数量
      dailynum: "",
      // 总次数
      dailyrepeatcount: "",
      // 当天开始时间
      DayStartTime: "",
      // 当天结束时间
      DayEndTime: "",
      // 工作日,按星期
      dailyworkday: [],
      // 是否全选工作日
      workday: false,
      // 是否全选周末
      weekend: false,
      // 是否全选
      all: false,

      // 任务及触发器信息
      Info: {},

      // 是否可见
      isVisible: false,
      // 是否显示Cron对话框
      showCronDialog: false
    };
  },
  computed: {
    // 获取当前后端地址
    ...mapState(['baseURL']),
  },
  methods: {
    // 获取自定义触发器实现类
    async getTrigger() {
      try {
        const response = await axios.post(this.baseURL + "/task/Reflect/triggerclass",null, {
          params: {
            type: this.trigger,
          },
        });
        
        this.triggers = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },
    
    //获取任务实现类
    async getJob() {
      try {
        const response = await axios.post(this.baseURL + "/task/Reflect/jobclass");
        
        this.jobClassNameGroup = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },

    //获取jobDetail
    async getJobDetail() {
      try {
        const response = await axios.post(this.baseURL + "/task/Reflect/jobdetailclass");
        
        this.JobDetails = response.data.data;
      } catch (error) {
        console.error("请求失败，请检查网络连接");
      }
    },

    //检查任务信息
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
      return "true";
    },

    //检查触发器信息
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
          this.baseURL + "/task/Util/cron-check?cron=" + this.cronexpression
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
      return "true";
    },

    //设置开始时间--日期选择器的禁用项
    disabledStartDate(time) {
    // 获取当前日期
    const today = new Date();
    // 设置时间的时分秒为0，表示当天的开始
    today.setHours(0, 0, 0, 0);
    // 返回一个布尔值，表示是否禁用该日期
    return time.getTime() < today.getTime();
  },

  //设置结束时间--日期选择器的禁用项
  disabledEndDate(time) {
      // 获取开始时间
      const startTime = new Date(this.startTime);
      // 设置时间的时分秒为0，表示当天的开始
      startTime.setHours(0, 0, 0, 0);
      // 返回一个布尔值，表示是否禁用该日期
      return time.getTime() <= startTime.getTime();
    },

    //构建发送后端信息
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

    //添加任务--包含一个触发器
    async addjob() {
      const if1 = this.checkBaseInfo() === "true";
      const if2 = await this.checkTrigger() === "true";
      if (if1 && if2) {
        this.builInfo();
        const response = await axios.post(this.baseURL + "/task/Add/job", this.Info);
        
        if(response.data.code === "200" ){
          this.clean();
          this.Info = {};
          this.$emit('getWhenAdd');
          this.closeModal();

        }
        else if(response.data.code === "500" ){
            this.$message({
              showClose: true,
              message: response.data.message,
              grouping: true,
              type: 'error'
            });
          }

        }
    },

    //添加空闲任务--无触发器
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
            this.baseURL + "/task/Add/jobdetail",
            null,
            {
              params: this.Info,
            }
          );
          
          if(response.data.code === "200" ){

            this.clean();
            this.Info = {};
            this.$emit('getWhenAdd');
            this.closeModal();

            }
            else if(response.data.code === "500" ){
            this.$message({
              showClose: true,
              message: response.data.message,
              grouping: true,
              type: 'error'
            });
          }
        }
      } else {
        alert("任务名、任务分组、任务类名不能为空");
      }
    },

    //设置可见性
    jobModal() {
      this.isVisible = true;
    },
    closeModal() {
      this.isVisible = false;
    },

    //设置DailyTimeIntervalTrigger dailyworkday 全选
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

    //设置DailyTimeIntervalTrigger dailyworkday的 工作日全选
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

    //设置DailyTimeIntervalTrigger dailyworkday 周日全选
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

    //检查DailyTimeIntervalTrigger dailyworkday星期选项
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

    //第三方cron表达式组件可见性与数据传递
    openCronDialog() {
      this.showCronDialog = true;
    },
    closeCronDialog() {
      this.showCronDialog = false;
    },
    fillCronValue(cronValue) {
      this.cronexpression = cronValue;
      this.closeCronDialog();
    },

    //初始化选项
    clean(){
      this.jobName= "";
      this.jobGroup= "";
      this.jobClassName= "";
      this.jobDescription= "";
      this.isCustomJobDetail= "false";
      this.jobDetail= "";

      this.trigger= "SimpleTrigger";

      this.isCustomTrigger= "false";
      this.selecttrigger= "";

      this.startTime= "";
      this.endTime= "";
      this.priority= 5;
      this.timezone= "Asia/Shanghai";
      this.triggername= "";
      this.triggergroup= "";
      
      this.simpletimesecond= "";
      this.repeatcount= "";

      this.cronexpression= "";

      this.calendartime= "second";
      this.calendarnum= "";
      this.preserveHourOfDayAcrossDaylightSavings= false;
      this.skipDayIfHourDoesNotExist= false;
      
      this.dailytime= "second";
      this.dailynum= "";
      this.dailyrepeatcount= "";
      this.DayStartTime= ""; // 当天开始时间
      this.DayEndTime= ""; // 当天结束时间
      this.dailyworkday= [];
      this.workday= false;
      this.weekend= false;
      this.all= false;
    },
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