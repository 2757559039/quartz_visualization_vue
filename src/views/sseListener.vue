<template>
  <!-- 监控器模块页面 -->
  <div class="sse-lister">
    <div style="width:100%; display: flex; justify-content: flex-end; padding-right: 40px;">
       <el-button id="tour-sse-docs-btn" type="primary" plain @click="openDocs">文档</el-button>
       <el-button id="tour-sse-guide-btn" type="info" @click="startTour">新手引导</el-button>
    </div>
    <div>
      <p class="tetle">监控器模块</p>
      <el-link id="tour-sse-backend" class="title" :underline="false" @click="go('uploadIP')">当前后端地址--{{ baseURL }}</el-link>
    </div>
    <div class="see-select">
      <div id="tour-sse-selects" class="selectBox">
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
      <div id="tour-sse-ops" class="buttonBox">
        <el-button type="info" @click="replace">确认</el-button>
        <el-button type="info" @click="clean">清空</el-button>
        <el-button type="info" @click="close">关闭</el-button>
      </div>
    </div>
    <!-- 监控数据展示 -->
      <p class="text">历史监控如下</p>
      <div id="tour-sse-history" class="virtual-list" >
        <p v-for="message in historyMessages" :key="message">{{ message }}</p>
      </div>
      <p class="text">实时监控如下</p>
      <div id="tour-sse-realtime" class="virtual-list1">
        <p v-for="message in messages" :key="message">{{ message }}</p>
      </div>
    </div>

  <HelpDrawer ref="helpDrawer" />
  <div id="tour-sse-nav-btns" class="jumpButtonBox">
    <!-- 页面跳转按钮 -->
    <el-button type="info" @click="go('JobIndex')">任务管理</el-button>
    <el-button type="info" @click="go('TriggerIndex')">触发器管理</el-button>
    <el-button type="info" @click="go('VirtualPlatform')">虚拟管理平台</el-button>
  </div>
</template>

<script>
import axios from "axios"; // 确保引入 axios
import { mapState, mapActions } from 'vuex';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { defineComponent } from 'vue';
import HelpDrawer from '../components/HelpDrawer.vue';

export default defineComponent({
  components: {
    HelpDrawer,
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
    },
    // 打开文档
    openDocs() {
      this.$refs.helpDrawer.open();
    },
    // 新手引导
    startTour() {
      const driverObj = driver({
        showProgress: true,
        allowClose: false, // 禁止点击空白关闭
        allowKeyboardControl: false, // 禁用默认键盘控制
        overlayClickNext: false, // 点击遮罩层不跳转
        doneBtnText: '完成',
        nextBtnText: '下一步',
        prevBtnText: '上一步',
        steps: [
          { element: '#tour-sse-backend', popover: { title: '后端地址', description: '显示当前连接的后端服务器地址。' } },
          { element: '#tour-sse-selects', popover: { title: '监控选择', description: '选择要监控的Key和日期。' } },
          { element: '#tour-sse-ops', popover: { title: '操作按钮', description: '确认开始监控，或清空、关闭当前监控。' } },
          { element: '#tour-sse-history', popover: { title: '历史监控', description: '显示选定日期的历史监控数据。' } },
          { element: '#tour-sse-realtime', popover: { title: '实时监控', description: '如果是当天日期，会实时显示接收到的监控消息。' } },
          { element: '#tour-sse-nav-btns', popover: { title: '快速导航', description: '快速跳转到其他管理页面。' } },
          { element: '#tour-sse-docs-btn', popover: { title: '文档', description: '点击查看详细使用文档。' } },
          { element: '#tour-sse-guide-btn', popover: { title: '新手引导', description: '点击这里可以再次查看本指引。' } },
        ],
        onDestroyed: () => {
           localStorage.setItem('hasSeenSseTour', 'true');
           document.removeEventListener('keydown', keyHandler);
        }
      });
      
      const keyHandler = (e) => {
        if (!driverObj.isActive()) return;
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          driverObj.moveNext();
        } else if (e.key === 'ArrowLeft') {
          driverObj.movePrevious();
        } else if (e.key === 'Escape') {
          driverObj.destroy();
        }
      };

      document.addEventListener('keydown', keyHandler);
      driverObj.drive();
    }
  },
  mounted() {
    this.getkeys();

      // 检查是否需要启动新手引导
     this.$nextTick(() => {
        const hasSeenTour = localStorage.getItem('hasSeenSseTour');
        if (!hasSeenTour) {
          this.startTour();
        }
      });
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