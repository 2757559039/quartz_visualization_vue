<!-- 脚本控制 -->
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

      <el-select
        v-model="filterCriteria2"
        placeholder="状态：全部"
        style="width: 200px;"
        @change="applyFilter"
      >
        <el-option
          v-for="option2 in filterOptions2"
          :key="option2.value"
          :label="option2.label"
          :value="option2.value"
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
      <el-table-column prop="scriptType" label="类型" width="240" />

      <!-- 状态列 -->
      <el-table-column prop="beanState" label="状态" width="120" :formatter="formatBeanState"/>

      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #header>
          <!-- 操作列不需要表头 -->
          <div></div>
        </template>
        <template #default="scope">
          <div class="czbtn">
            <el-button class="azb" @click="handleInstall(scope.row)" :disabled="scope.row.beanState">安装</el-button>
            <el-button class="ckb" @click="handleAlter(scope.row)">查看/修改</el-button>
            <el-button class="scb" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <UpLoad ref="uploadModal" class="uploadmod" :row="row" @update-success="fetchData"/>
  </div>
</template>

<script>
import axios from 'axios';
import UpLoad from './upload.vue';

export default {
  name: 'UnerectedList',
  components: { UpLoad },
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
      filterCriteria2: '',
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
      filterOptions2: [
        { label: '状态：全部', value: '' },
        { label: '状态：已安装', value: 'true' },
        { label: '状态：未安装', value: 'false' },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post(
          '/scriptBuilder/selectAllScript',
          {
            keywords: this.searchKeyword,
            type: this.filterCriteria,
            state:this.state
          }
        );
        this.filteredTableData = response.data.data;
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    applyFilter() {
      this.fetchData();
      console.log(this.searchKeyword);
    },
    formatBeanState(row, column, cellValue) {
      return cellValue ? '已安装' : '未安装';
    },
    handleInstall(row) {
      ElMessageBox.confirm(
        `确定要安装类 ${row.className} 吗？`,
        '确认安装',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          const className = row.className;
          axios.post(`/groovyBean/loadGroovyBean?className=${className}`)
            .then(response => {
              console.log(response);
              if (response.data.code === '200') {
                ElMessage({
                  message: '安装成功',
                  type: 'success',
                });
                this.fetchData(); // 重新加载数据
              } else {
                ElMessage({
                  message: '安装失败',
                  type: 'error',
                });
              }
            })
            .catch(error => {
              console.error('安装失败:', error);
              ElMessage({
                message: '安装失败',
                type: 'error',
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消安装',
          });
        });
    },
    handleDelete(row) {
      ElMessageBox.confirm(
        `确定要删除类 ${row.className} 吗？`,
        '确认删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'error',
        }
      )
        .then(() => {
          const id = row.id;
          axios.post(`/scriptBuilder/deleteScript?id=${id}`)
            .then(response => {
              if (response.data.code === '200') {
                ElMessage({
                  message: '删除成功',
                  type: 'success',
                });
                this.fetchData(); // 重新加载数据
              } else {
                ElMessage({
                  message: '删除失败',
                  type: 'error',
                });
              }
            })
            .catch(error => {
              console.error('删除失败:', error);
              ElMessage({
                message: '删除失败',
                type: 'error',
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    handleAlter(row) {
      this.$refs.uploadModal.uploadModal(row);
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

:deep(.czbtn .el-button:disabled) {
  background: linear-gradient(to right, rgb(119, 119, 119), rgb(119,119,119));
}

:deep(.el-dialog.uploadmod ){
  background-color: #fefefe;
  border: 1px solid #888;
  width: 1440px;
  /* height: 650px; */
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
}
</style>