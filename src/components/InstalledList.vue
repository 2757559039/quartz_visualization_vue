<template>
  <div class="unerected-list">
    <!-- 搜索框和筛选框 -->
    <div class="search-filter-type">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索类名"
        clearable
        style="width: 300px; margin-right: 20px;"
        @input="applyFilter"
      >
        <template #append>
          <el-button type="primary" icon="Search" @click="applyFilter"></el-button>
        </template>
      </el-input>

      <el-select
        v-model="filterCriteria"
        placeholder="类型：全部"
        style="width: 200px;"
        @change="applyFilter"
      >
        <el-option
          v-for="option in filterOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>

    <!-- 表格 -->
    <el-table
      :data="filteredTableData"
      stripe
      style="width: 100%"
      v-show="showTable"
      max-height="520"
    >
      <!-- 类名列 -->
      <el-table-column prop="className" label="类名" width="360" />

      <!-- 类型列 -->
      <el-table-column prop="scriptType" label="类型" width="360" />

      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #header>
          <!-- 操作列不需要表头 -->
          <div></div>
        </template>
        <template #default="scope">
          <div class="czbtn">
            <el-button class="xzb" @click="handleUninstall(scope.row)">卸载</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UnerectedList',
  props: {
    showTable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [],
      filteredTableData: [],
      searchKeyword: '',
      filterCriteria: '',
      filterOptions: [
        { label: '类型：全部', value: '' },
        { label: '类型：job', value: 'job' },
        { label: '类型：job_detail', value: 'job_detail' },
        { label: '类型：SimpleTrigger', value: 'SimpleTrigger' },
        { label: '类型：CalendarIntervalTrigger', value: 'CalendarIntervalTrigger' },
        { label: '类型：DailyTimeIntervalTrigger', value: 'DailyTimeIntervalTrigger' },
        { label: '类型：CronTrigger', value: 'CronTrigger' },
        { label: '类型：SimpleUpdateTrigger', value: 'SimpleUpdateTrigger' },
        { label: '类型：CalendarUpdateIntervalTrigger', value: 'CalendarUpdateIntervalTrigger' },
        { label: '类型：DailyUpdateTimeIntervalTrigger', value: 'DailyUpdateTimeIntervalTrigger' },
        { label: '类型：CronUpdateTrigger', value: 'CronUpdateTrigger' },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post('/groovyBean/selectAllLoadGroovyBean',
          {
            keywords: this.searchKeyword,
            filterCriteria: this.filterCriteria,
          });
        this.filteredTableData = response.data.data;
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    applyFilter() {
      this.fetchData();
      console.log('筛选条件：', this.filterCriteria);
    },
    handleUninstall(row) {
      ElMessageBox.confirm(
        `确定要卸载类 ${row.className} 吗？`,
        '确认卸载',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'error',
        }
      )
        .then(() => {
          const className = row.className;
          axios.post(`/groovyBean/unloadGroovyBean?className=${className}`)
            .then(response => {
              if (response.data.code === '200') {
                ElMessage({
                  message: '卸载成功',
                  type: 'success',
                });
                this.fetchData(); // 重新加载数据
              } else {
                ElMessage({
                  message: '卸载失败',
                  type: 'error',
                });
              }
            })
            .catch(error => {
              console.error('卸载失败:', error);
              ElMessage({
                message: '卸载失败',
                type: 'error',
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消卸载',
          });
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
// .unerected-list {
//   margin-top: 20px;
//   padding: 20px;
//   background-color: #ffffff;
//   border-radius: 8px;
//   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
// }

.search-filter-type {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.el-table {
  :deep(.cell) {
    text-align: center;
  }
}

// 操作按钮组
:deep(.czbtn .el-button) {
  background: linear-gradient(to left, rgb(53, 204, 255), rgb(4, 114, 182));
  color: white;
  border: none;
}

:deep(.czbtn .el-button:hover) {
  background: linear-gradient(to right, rgb(53, 204, 255), rgb(4, 114, 182));
}
</style>