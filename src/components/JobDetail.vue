<template>
  <div>
    <span>任务名:{{ jobName }}</span>
    <br />
    <span>任务分组:{{ jobGroup }}</span>
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
    <span>是否使用自定义JobDetail </span>
    <select v-model="isCustomJobDetail">
      <option>true</option>
      <option>false</option>
    </select>
    <br>
    <p v-if="isCustomJobDetail === 'true'">
      <span>JobDetail</span>
      <select v-model="jobDetail">
        <option v-for="(JobDetail, index) in JobDetails" :key="index">{{JobDetail}}</option>
      </select>
    </p>
    <el-button type="primary" @click="update">更新任务属性</el-button>
    <el-button @click="back">返回</el-button>
  </div>
</template>
  
<script>
import { ElButton } from "element-plus";
import axios from "axios";
export default {
  components: {
    ElButton,
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
      // 假设任务名、任务分组、任务类名等都是字符串输入
      jobName: "",
      jobGroup: "",
      jobClassNameGroup:[],
      jobClassName: "",
      jobDescription: "",


      // 触发器类型选择
      isCustomJobDetail: "false",
      // 自定义JobDetail输入
      JobDetails:[],
      jobDetail: "",
    };
  },
  methods: {

    back(){
        this.$emit('close');
      },
    async getJob() {
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/jobclass"
        );
        console.log(response);
        this.jobClassNameGroup = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async getJobDetail() {
      console.log("getJobDetail");
      try {
        const response = await axios.post(
          "http://114.132.71.250:8002/task/Reflect/jobdetailclass"
        );
        console.log(response);
        this.JobDetails = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    async update() {
      try {
        const response = await axios.post("http://114.132.71.250:8002/task/Update/updatejob",null,{
          params:{
            jobname:this.jobName,
            jobgroup:this.jobGroup,
            jobclassname:this.jobClassName,
            description:this.jobDescription,
            isCustomJobDetail:this.isCustomJobDetail,
            jobDetail:this.jobDetail
          }
        });
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
  },
  created() {
    this.getJob();
    this.getJobDetail();
    console.log(this.jobinfo);
    this.jobName = this.jobinfo.jobname;
    this.jobGroup = this.jobinfo.jobgroup;
    this.jobClassName = this.jobinfo.jobclassname;
    this.jobDescription = this.jobinfo.description;
    this.isCustomJobDetail = this.jobinfo.isCustomJobDetail;
    this.jobDetail = this.jobinfo.jobDetail;
  },
};
</script>
  
<style scoped>
</style>