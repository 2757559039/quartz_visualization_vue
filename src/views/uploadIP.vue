// filepath: d:\asd\KSH3\vite-project\src\views\uploadIP.vue
<template>
    <div class="container">
        <div class="ipBox">
            <div>
                <label for="protocol">协议:</label>
                <el-select v-model="protocol" id="protocol">
                    <el-option label="http" value="http"/>
                    <el-option label="https" value="https"/>
                </el-select>
            </div>

            <div>
                <label for="ip1">IP段1:</label>
                <el-input-number class="number1" v-model="ip1" :min="0" :max="255" controls-position="right" id="ip1"/>
            </div>

            <div>
                <label for="ip2">IP段2:</label>
                <el-input-number class="number1" v-model="ip2" :min="0" :max="255" controls-position="right" id="ip2"/>
            </div>

            <div>
                <label for="ip3">IP段3:</label>
                <el-input-number class="number1" v-model="ip3" :min="0" :max="255" controls-position="right" id="ip3"/>
            </div>

            <div>
                <label for="ip4">IP段4:</label>
                <el-input-number class="number1" v-model="ip4" :min="0" :max="255" controls-position="right" id="ip4"/>
            </div>

            <div>
                <label for="port">端口:</label>
                <el-input-number class="number2" v-model="port" id="port"/>
            </div>
        </div>
        <div>
            <p>当前选择的后端地址:</p>
            <p> {{ address }}</p>
            <p>当前后端地址: </p>
            <p>{{ baseURL }}</p>
        </div>
            
        <div class="updateButton">
            <el-button type="info" @click="updateStore">更新后端地址</el-button>
        </div>

        <div class="jumpButtonBox"> 
            <el-button type="info" @click="go('JobIndex')">任务管理</el-button>
            <el-button type="info" @click="go('TriggerIndex')">触发器管理</el-button>
            <el-button type="info" @click="go('VirtualPlatform')">虚拟管理平台</el-button>
            <el-button type="info" @click="go('sseListener')">监控平台</el-button>    
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            protocol: 'http',
            ip1: '',
            ip2: '',
            ip3: '',
            ip4: '',
            port: ''
        };
    },
    computed: {
        ...mapState(['baseURL']),
        address(){
            return `${this.protocol}://${this.ip1}.${this.ip2}.${this.ip3}.${this.ip4}:${this.port}`
        }
    },
    methods: {
        ...mapActions(['updateBaseURL']),
        updateStore() {
            this.updateBaseURL(this.address);
        },
        go(address) {
            this.$router.push({ path: '/' + address });
        },
    },
};
</script>

<style scoped>
/* Add your styles here */

.container {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
	padding-top: 10%;
  display : flex;
	flex-direction: column;
	align-items: center;
  overflow: auto;
  background: rgb(255, 255, 255);
}

.ipBox{
	width: 1000px;
	display: flex;
	justify-items: center;
	justify-content: space-between;
	align-items: center;
}

.ipBox .el-select{
    width: 120px;
    margin-top: 5px;
}

.number1{
    width: 120px;
    margin-top: 5px;
}

.number2{
    width: 200px;
    margin-top: 5px;
}

.updateButton{
    margin-top: 20px;
}

.updateButton  button{
  font-size: 18px;
  width: 200px;
  height: 50px;
  font-size: 24px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
  border: none; /* 去除边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.updateButton  button:hover{
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182)); /* 从浅蓝色到深蓝色 */
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