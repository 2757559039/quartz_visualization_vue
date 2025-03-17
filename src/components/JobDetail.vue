<template>
  <!-- 修改任务详情 弹窗组件 -->
  <div class="container">
    <!-- 任务详情展示 -->
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
          <el-select v-model="jobClassName" @focus="getJob">
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
          <el-select v-model="jobDetail" :disabled = "!isCustomJobDetail" @focus="getJobDetail">
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
import { mapState } from 'vuex';
export default {
  components: {
    ElButton,
  },
  props: {
    jobinfo: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 任务名
      jobName: "",
      // 任务组
      jobGroup: "",
      // 任务类名组
      jobClassNameGroup:[],
      // 任务类名
      jobClassName: "",
      // 任务描述
      jobDescription: "",

      // 是否开启自定义jobDetail
      isCustomJobDetail: false,
      // 自定义JobDetail项
      JobDetails:[],
      // 选择的jobDetail
      jobDetail: null,
    };
  },
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {

    //改变弹窗
    back(){
        this.$emit('close');
      },

      //获取任务实现类
    async getJob() {
      try {
        const response = await axios.post(
          this.baseURL + "/task/Reflect/jobclass"
        );
        
        this.jobClassNameGroup = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },
    async getJobDetail() {
      try {
        const response = await axios.post(
          this.baseURL + "/task/Reflect/jobdetailclass"
        );
        
        this.JobDetails = response.data.data;

        // 重置表单
      } catch (error) {
        // 处理网络错误或其他错误
        this.errorMessage = "请求失败，请检查网络连接";
        console.error;
      }
    },

    //更新任务详情
    async update() {
      try {
        let info = {};
        if(this.isCustomJobDetail){
          if(this.jobDetail == null || this.jobDetail == "" || this.jobDetail == undefined){
            this.$message({
              message: "请选择自定义JobDetail",
              grouping: true,
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
            grouping: true,
            type: "error"
            });
          return;
        }else{
          info.jobclassname = this.jobClassName;
        }
        info.description = this.jobDescription;
        info.isCustomJobDetail = this.isCustomJobDetail;

        const response = await axios.post(this.baseURL + "/task/Update/updatejob",null,{
          params: info
        });
        
        if(response.data.code === "500" ){
            this.$message({
              showClose: true,
              message: response.data.message,
              grouping: true,
              type: 'error'
            });
          }else{
          this.$message({
            message: "更新成功",
            grouping: true,
            type: "success"
            });
          this.$emit('close');
          }
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
    this.jobName = this.jobinfo.jobname;
    this.jobGroup = this.jobinfo.jobgroup;
    this.jobClassName = this.jobinfo.jobclassname;
    this.jobDescription = this.jobinfo.description;
    if(this.jobinfo.jobDetail === null || this.jobinfo.jobDetail === "" || this.jobinfo.jobDetail === undefined){
      this.isCustomJobDetail = false;
    }else{
      this.isCustomJobDetail = true;
      this.jobDetail = this.jobinfo.jobDetail;
    }
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