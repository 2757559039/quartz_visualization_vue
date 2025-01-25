<template>
  <div>
    <el-input
      class="elInput"
      v-model="cronValue"
      @click="openDialog"
      :clearable="true"
      placeholder="请输入正确的cron表达式"
    ></el-input>
    <el-dialog
      v-model="showCron"
      title="Cron表达式设置"
      width="30%"
      :before-close="handleClose"
    >
      <div class="cron-picker-container">
        <Vue3CronPlusPicker
          @hide="closeDialog"
          @fill="fillValue"
          :expression="expression"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'vue3-cron-plus-picker/style.css';
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker';

export default {
  name: 'demoShow',
  components: {
    Vue3CronPlusPicker,
  },
  data() {
    return {
      cronValue: '',
      showCron: false,
      expression: '* * * * * * *',
    };
  },
  methods: {
    openDialog() {
      this.showCron = true;
      if (this.cronValue !== '') {
        this.expression = this.cronValue;
      }
    },
    closeDialog() {
      this.showCron = false;
    },
    fillValue(cronValue) {
      this.cronValue = cronValue;
    },
    confirm() {
      this.cronValue = this.expression;
      this.closeDialog();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.elInput {
  width: 300px;
  margin-bottom: 20px;
}

.cron-picker-container {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  text-align: right;
}

.dialog-footer button {
  margin-left: 10px;
}
</style>