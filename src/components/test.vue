<template>
  <div>
    <el-input class="elInput" v-model="cronValue" placeholder="请输入正确的cron表达式">
      <template #append>
        <el-button class="inputButton" @click="openDialog">配置cron</el-button>
      </template>
    </el-input>
    <el-dialog v-model="showCron"  >
      <vue3-cron-plus-picker @hide="showCron=false" @fill="cronFill" :expression="expression"/>
    </el-dialog>
    
  </div>
</template>

<script setup>
import {ref} from 'vue'


const cronValue = ref('')
const showCron = ref()
const expression = ref('')
const openDialog = ()=>{
  showCron.value = true
  expression.value = cronValue.value
}
const cronFill = (contabValue)=>{
  cronValue.value = contabValue
}

</script>
<style>
</style>