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
        <div class="buttonbox">
          <el-button type="primary" @click="update">更新任务属性</el-button>
          <el-button @click="back">返回</el-button>
        </div>
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
      isCustomJobDetail: false,
      // 自定义JobDetail输入
      JobDetails:[],
      jobDetail: null,
    };
  },
  methods: {

    back(){
        this.$emit('close');
      },
    async getJob() {
      try {
        const response = await axios.post(
          "/task/Reflect/jobclass"
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
          "/task/Reflect/jobdetailclass"
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
        let info = {};
        if(this.isCustomJobDetail){
          if(this.jobDetail == null || this.jobDetail == "" || this.jobDetail == undefined){
            this.$message({
              message: "请选择自定义JobDetail",
              type: "error"
              });
            return;
          }
          info.jobDetail = this.jobDetail;
        }
        info.jobname = this.jobName;
        info.jobgroup = this.jobGroup;
        if(this.jobClassName == "" || this.jobClassName == null || this.jobClassName == undefined){
          this.$message({
            message: "请选择任务类名",
            type: "error"
            });
          return;
        }else{
          info.jobclassname = this.jobClassName;
        }
        info.description = this.jobDescription;
        info.isCustomJobDetail = this.isCustomJobDetail;

        const response = await axios.post("/task/Update/updatejob",null,{
          params: info
        });
        console.log(response);
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
    this.isCustomJobDetail = this.jobinfo.isCustomJobDetail ? true : false;
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
.buttonbox{
  column-gap:0;
  gap: 0px;
  margin-top: 20px;
  flex-direction: column;
  display: flex;
}

.buttonbox button{
  width: 300px !important;
  font-size: 24px;
  width: 128px;
  height: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

:deep(.detail1 .el-textarea){
  width: 320px;
  margin-top: 10px;
  font-size: 16px;
}
:deep(.detail1 .el-select){
  width: 320px;
  margin-top: 10px;
}

.detail1 button{
  width: 320px;
  height: 40px;
  margin-bottom: 10px;
  margin-left: 0;
}
</style>