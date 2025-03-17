<template>
  <!-- 监控器模块页面 -->
  <div class="sse-lister">
    <div> 
      <p class="tetle">监控器模块</p>
      <el-link class="title" :underline="false" @click="go('uploadIP')">当前后端地址--{{ baseURL }}</el-link>
    </div>
    <div class="see-select">
      <div class="selectBox">
         <!--选择key  -->
        <el-select v-model="key" placeholder="请选择key" @focus="getkeys" @change="getRecordDates">
          <el-option
            v-for="item in keys"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <!-- 选择recordDate -->
        <el-select v-model="recordDate" placeholder="请选择recordDate" @focus="getRecordDates">
          <el-option
            v-for="item in recordDates"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>

      <!-- 操作按钮 -->
      <div class="buttonBox"> 
        <el-button type="info" @click="replace">确认</el-button>
        <el-button type="info" @click="clean">清空</el-button>
        <el-button type="info" @click="close">关闭</el-button>  
      </div>
    </div>
    <!-- 监控数据展示 -->
      <p class="text">历史监控如下</p>
      <div class="virtual-list" > 
        <p v-for="message in historyMessages" :key="message">{{ message }}</p>
      </div>
      <p class="text">实时监控如下</p>
      <div  class="virtual-list1"> 
        <p v-for="message in messages" :key="message">{{ message }}</p>
      </div>
    </div>

  <div class="jumpButtonBox"> 
    <!-- 页面跳转按钮 -->
    <el-button type="info" @click="go('JobIndex')">任务管理</el-button>
    <el-button type="info" @click="go('TriggerIndex')">触发器管理</el-button>
    <el-button type="info" @click="go('VirtualPlatform')">虚拟管理平台</el-button>  
  </div>
</template>

<script>
import axios from "axios"; // 确保引入 axios
import { mapState, mapActions } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  data() {
    return {
      keys: [], // 用于存储key
      key: "", // 用于存储当前选中的key
      recordDates: [], //recordDates列表
      recordDate: "", //选择的recordDates
      messages: [], // 用于存储接收到的实时监控信息`
      historyMessages: '', // 用于存储接收到的历史监控信息
      source: null, // EventSource 实例
      cancelTokenSource: null // 用于取消 Axios 请求
    };
  },
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {

    //页面跳转
    go(address) {
      this.close();
      this.$router.push({ path: '/' + address });
    },

    //时间格式 yyyy-mm-dd
    getNowFormatDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    //获取recordDates
    async getRecordDates() {
      if (this.key === "") return;
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const response = await axios.post(this.baseURL + `/sse/getLinkRecordDateFromDB?key=` + this.key, {
          cancelToken: this.cancelTokenSource.token
        });
        let res = new Set(response.data.data);
        res.add(this.getNowFormatDate());
        this.recordDates = Array.from(res).reverse();
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("error!", error);
          this.$message({
            showClose: true,
            message: '获取recordDate失败,请检查网络',
            type: 'error'
          });
        }
      }
    },

    //监控链接
    async replace() {
      if (this.key === "" || this.recordDate === "") {
        this.$message({
          showClose: true,
          message: '请选择key或recordDate',
          type: 'error'
        });
        return;
      }

      if (this.source) {
        this.source.close();
        this.clean();
      }

      try {

        //历史监控信息
        const response = await axios.get(this.baseURL + "/sse/restoreSSEInfoHistory?cacheKey=" + this.key + "&recordDate=" + this.recordDate);
        
        this.historyMessages = response.data.data;

        if (this.recordDate === this.getNowFormatDate()) {
          //实时监控链接
          this.source = new EventSource(this.baseURL +"/sse/definedJobSubscribe?cacheKey=" + this.key);

          this.source.addEventListener("message", (event) => {
            const data = JSON.parse(event.data).data;
            data.forEach(item => {
              this.messages.unshift(item);
            });
          });

          this.source.onerror = (e) => {
            if (e.target.readyState === EventSource.CLOSED) {
              this.messages.unshift("连接关闭");
            }
          };

          this.source.onopen = (event) => {
            this.messages.unshift("连接已开启");
          };
        }
      } catch (error) {
        console.error("error!", error);
        this.$message({
          showClose: true,
          message: '操作失败,请检查网络',
          type: 'error'
        });
      }
    },

    //获取key
    async getkeys() {
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const response = await axios.post(this.baseURL + "/sse/getLinkingCache", {
          cancelToken: this.cancelTokenSource.token
        });
        this.keys = response.data.data; // 更新响应式变量
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("error!", error);
          this.$message({
            showClose: true,
            message: '获取key失败,请检查网络',
            type: 'error'
          });
        }
      }
    },

    //清空监控数据
    clean() {
      this.historyMessages = [];
      this.messages = [];
    },

    //关闭链接
    close() {
      if (this.source) {
        this.source.close();
        this.clean();
        this.messages.unshift("连接关闭");
      }
    }
  },
  mounted() {
    this.getkeys();
  },
  beforeUnmount() {
    if (this.source) {
      this.source.close();
    }
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel("Component is being destroyed");
    }
  }
});
</script>

<style scoped>
.sse-lister {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  background-color:#fff ; /* 添加背景色 */
}

.tetle {
  display: flex;
  justify-content: center;
  font-size: 48px;
  margin-top: 20px;
  margin-top: 0px;
  margin-bottom: 0;
}

.title {
  display: flex;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 0;
}

.see-select {
  width: 100%;
  margin-top: 20px;
  display: block;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.see-select .selectBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.see-select .buttonBox {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.see-select .el-select) {
  width: 200px;
  height: 40px;
  margin-right: 20px;
}

:deep(.see-select .el-select .el-select__wrapper) {
  width: 200px;
  height: 40px;
  margin-right: 20px;
}

.see-select  button{
  font-size: 18px;
  width: 100px;
  height: 40px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none; /* 去除边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.see-select  button:hover{
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
}


.virtual-list {
  width: 600px;
  height: 200px;
  overflow-y: auto;
  margin-top: 0px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f5f5f5; /* 添加背景色 */
  word-wrap: break-word; /* 添加换行 */
  display: flex;
  flex-direction: column-reverse; /* 自动定位到底部 */
}

.virtual-list1 {
  width: 600px;
  height: 350px;
  overflow-y: auto;
  margin-top: 0px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f5f5f5; /* 添加背景色 */
  word-wrap: break-word; /* 添加换行 */
  display: flex;
  flex-direction: column-reverse; /* 自动定位到底部 */
}

.virtual-list-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.text {
  margin: 0;
  padding: 5px;
  margin-bottom: 0;
  font-size: 24px;
}

.jumpButtonBox{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.jumpButtonBox  button{
  font-size: 18px;
  width: 200px;
  height: 50px;
  font-size: 24px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none; /* 去除边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.jumpButtonBox  button:hover{
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
}

:deep(.el-link__inner){
  color:rgb(0,119,194);
}
</style>