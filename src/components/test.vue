<template>
    <div class="container">
        <div class="detail">
            <span>任务名:</span>
            <span>{{ jobName }}</span>
        </div>
      
        <div class="detail">
            <span>任务分组:</span>
            <span>{{ jobGroup }}</span>
        </div>
        <div class="detail">
            <span>任务类名:</span>
            <el-select v-model="jobClassName">
                <el-option v-for="(item,index) in jobClassNameGroup" :key="index" :label="item" :value="item"/>
            </el-select>
        </div>
        <div class="detail1">
            <span>任务描述:</span>
            <el-input
                v-model="jobDescription"
                :rows="2"
                type="textarea"
                placeholder="Please input"
            />
        </div>
        <div class="detail">
            <span>是否使用自定义JobDetail </span>
            <el-switch v-model="isCustomJobDetail" />
        </div>
        <div class="detail1">
            <span>请选择自定义的jobDetail</span>
            <el-select v-model="jobDetail" :disabled = "!isCustomJobDetail">
                <el-option v-for="(item,index) in JobDetails" :key="index" :label="item" :value="item"/>
            </el-select>
        </div>
        <div class="detail1">
            <el-button type="primary" @click="update">更新任务属性</el-button>
            <el-button @click="back">返回</el-button>
        </div>
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
  .container{
    width: 300px;
  }

.container span{
    font-size: 20px;
}

  .detail{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  :deep(.detail .el-select){
    width: 200px;
  }

  .detail1{
    margin-bottom: 20px;
  }

  :deep(.detail1 .el-textarea){
    width: 300px;
    margin-top: 10px;
    font-size: 16px;
  }
  :deep(.detail1 .el-select){
    width: 300px;
    margin-top: 10px;
  }

  .detail1 button{
    width: 300px;
    height: 40px;
    margin-bottom: 10px;
    margin-left: 0;
  }
  </style>