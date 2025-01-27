<template>
  <div>
  <el-input class="elInput" v-model="cronValue"  @click="openDialog" :clearable="true"  placeholder="请输入正确的cron表达式">
  </el-input>
  <el-dialog v-model="showCron">
      <vue3CronPlus
        @change="changeCron"
        @close="closeDialog"
        max-height="600px"
        i18n="cn">
      </vue3CronPlus>
  </el-dialog>
</div>
</template>

<script>
import { vue3CronPlus } from 'vue3-cron-plus'
import 'vue3-cron-plus/dist/index.css' // 引入样式
export default {
name : "DemoCompare",
components: { "vue3CronPlus":vue3CronPlus },
data () {
  return{
    cronValue:"",
    showCron:"",
  }
},
methods : {
  openDialog () {
    this.showCron = true;
  },
  closeDialog(){
    this.showCron = false;
  },
  changeCron(cronValue){
    if (typeof (cronValue) == "string") {
      this.cronValue = cronValue;
    }
  }
}
}
</script>

<style scoped>

</style>
