<template>
  <div class="sse-lister">
    <div> 
      <p>监控器模块</p>
    </div>
    <div class="see-select">
      <el-select v-model="key" placeholder="请选择" @focus="getkeys">
        <el-option
          v-for="item in keys"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-button @click="replace">确认</el-button>
    </div>
    <div class="see-text">
      <p v-for="(message, index) in messages" :key="index">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // 确保引入 axios

export default {
  data() {
    return {
      keys: [], // 用于存储key
      key: "asd", 
      messages: [], // 用于存储接收到的消息
      source: null // EventSource 实例
    };
  },
  methods: {
    replace() {
      if (this.source) {
        this.source.close();
        this.messages.push("连接关闭");
      }

      this.source = new EventSource("http://172.17.170.107:8002/sse/definedJobSubscribe", null, {
        params: {
          cacheKey: this.key,
        },
      });

      // 监听消息事件
      this.source.addEventListener("msg", (e) => {
        this.messages.unshift(e.data); // 将消息添加到列表头部
        console.log(e.data);
      });

      // 监听错误事件
      this.source.onerror = (e) => {
        if (e.readyState === EventSource.CLOSED) {
          this.messages.push("连接关闭");
        } else {
          this.messages.push("发生错误: " + e.message);
        }
      };

      // 监听连接开启事件
      this.source.onopen = (event) => {
        this.messages.push("连接已开启");
        console.log(event);
      };
    },
    async getkeys() {
      try {
        const response = await axios.get("/sse/getLinkingCache");
        this.keys = response.data.data; // 更新响应式变量
      } catch (error) {
        console.error("error!", error);
        this.$message({
          showClose: true,
          message: '获取key失败,请检查网络',
          type: 'error'
        });
      }
    }
  },
  mounted() {
    this.getkeys();
  },
  beforeDestroy() {
    if (this.source) {
      this.source.close();
    }
  }
};
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
  height: 50px;
  display: flex;
}

:deep(.see-select .el-select) {
  width: 200px;
  margin-right: 20px;
}

.see-text {
  width: 500px;
  height: 700px;
  overflow-y: auto;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f5f5f5; /* 添加背景色 */
  word-wrap: break-word; /* 添加换行 */
}

.see-text p {
  margin: 0;
  padding: 5px;
  font-size: 16px;
}
</style>
