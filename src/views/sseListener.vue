<template>
  <div class="sse-lister">
    <div> 
      <p>监控器模块</p>
    </div>
    <div class="see-select">
      <div class="selectBox"> 
        <el-select v-model="key" placeholder="请选择key" @focus="getkeys" @change="getRecordDates">
          <el-option
            v-for="item in keys"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <el-select v-model="recordDate" placeholder="请选择recordDate" @focus="getRecordDates">
          <el-option
            v-for="item in recordDates"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>

      <div class="buttonBox"> 
        <el-button type="info" @click="replace">确认</el-button>
        <el-button type="info" @click="clean">清空</el-button>
        <el-button type="info" @click="close">关闭</el-button>  
      </div>
    </div>
    <div class="see-text">
      <vue-virtual-scroll-list
        :data-key="'message'"
        :data-sources="formattedMessages"
        :data-component="VirtualListItem"
        class="virtual-list"
      />
    </div>
  </div>

  <div class="jumpButtonBox"> 
    <el-button type="info" @click="go('JobIndex')">任务管理</el-button>
    <el-button type="info" @click="go('TriggerIndex')">触发器管理</el-button>
    <el-button type="info" @click="go('VirtualPlatform')">虚拟管理平台</el-button>  
  </div>
</template>

<script>
import axios from "axios"; // 确保引入 axios
import { defineComponent } from 'vue';
import VirtualList from 'vue3-virtual-scroll-list';

export default defineComponent({
  components: {
    VirtualList,
    VirtualListItem: {
      props: ['item'],
      template: '<div class="virtual-list-item">{{ item.message }}</div>'
    }
  },
  data() {
    return {
      keys: [], // 用于存储key
      key: "", // 用于存储当前选中的key
      recordDates: [],
      recordDate: "",
      messages: [], // 用于存储接收到的消息
      source: null, // EventSource 实例
      cancelTokenSource: null // 用于取消 Axios 请求
    };
  },
  computed: {
    formattedMessages() {
      return Array.isArray(this.messages) ? this.messages.map(message => ({ message })) : [];
    }
  },
  methods: {
    go(address) {
      if (this.source) {
        this.source.close();
      }
      this.messages = [];
      this.$router.push({ path: '/' + address });
    },

    getNowFormatDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    async getRecordDates() {
      if (this.key === "") return;
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const response = await axios.post(`/sse/getLinkRecordDateFromDB?key=` + this.key, {
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
        this.messages.unshift("连接关闭");
      }

      try {
        console.log(this.key);
        console.log(this.recordDate);

        const response = await axios.get("/sse/restoreSSEInfoHistory?cacheKey=" + this.key + "&recordDate=" + this.recordDate);
        this.messages = Array.isArray(response.data) ? response.data : [];
        this.messages.unshift(this.recordDate + "历史如下");

        if (this.recordDate === this.getNowFormatDate()) {
          this.source = new EventSource("http://172.17.169.151:8002/sse/definedJobSubscribe?cacheKey=" + this.key);

          this.source.onmessage = (event) => {
            this.messages.unshift(event.data);
          };

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

    async getkeys() {
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const response = await axios.post("/sse/getLinkingCache", {
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

    clean() {
      this.messages = [];
    },

    close() {
      if (this.source) {
        this.source.close();
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

.see-text {
  width: 600px;
  height: 650px;
  overflow-y: auto;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f5f5f5; /* 添加背景色 */
  word-wrap: break-word; /* 添加换行 */
  display: flex;
  flex-direction: column-reverse; /* 自动定位到底部 */
}

.virtual-list {
  width: 100%;
  height: 100%;
}

.virtual-list-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.see-text p {
  margin: 0;
  padding: 5px;
  font-size: 16px;
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
</style>