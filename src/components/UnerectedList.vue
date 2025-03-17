<!-- 脚本控制 -->
<template>
   <!-- 虚拟管理平台  脚本管理-->
  <div class="unerected-list">
    <!-- 搜索框和筛选框 -->
    <div class="search-filter-type">
      <!-- 筛选 脚本类名输入 -->
      <el-input
        v-model="searchKeyword"
        placeholder="搜索类名"
        clearable
        @input="applyFilter"
      >
        <template #append>
          <el-button type="primary" icon="Search" @click="applyFilter"></el-button>
        </template>
      </el-input>
    <!-- 筛选 脚本类型选择 -->
      <el-select
        v-model="filterCriteria"
        placeholder="类型：全部"
        @change="applyFilter"
      >
        <el-option
          v-for="option in filterOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 筛选 脚本状态选择 -->
      <el-select
        v-model="filterCriteria2"
        placeholder="状态：全部"
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

    <!-- 表格 脚本管理 -->
    <el-table
      :data="filteredTableData"
      stripe
      style="width: 100%"
      v-show="showTable"
      max-height="520"
    >
      <!-- 类名列 -->
      <el-table-column prop="className" label="类名" min-width="36" />

      <!-- 类型列 -->
      <el-table-column prop="scriptType" label="类型" min-width="24" />

      <!-- 状态列 -->
      <el-table-column prop="beanState" label="状态" min-width="12" :formatter="formatBeanState"/>

      <!-- 操作列 -->
      <el-table-column label="操作" min-width="48">
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
import { mapState } from 'vuex';
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
      filteredTableData: [], // 脚本列表
      searchKeyword: '', // 搜索关键词
      filterCriteria: '', // 筛选类型
      filterCriteria2: '', // 筛选状态
      filterOptions: [
      { label: '类型：全部', value: '' }, // 筛选选项1：全部类型
      { label: '类型：job', value: 'job' }, // 筛选选项1：job类型
      { label: '类型：job_detail', value: 'job_detail' }, // 筛选选项1：job_detail类型
      { label: '类型：SimpleTrigger', value: 'SimpleTrigger' }, // 筛选选项1：SimpleTrigger类型
      { label: '类型：CalendarIntervalTrigger', value: 'CalendarIntervalTrigger' }, // 筛选选项1：CalendarIntervalTrigger类型
      { label: '类型：DailyTimeIntervalTrigger', value: 'DailyTimeIntervalTrigger' }, // 筛选选项1：DailyTimeIntervalTrigger类型
      { label: '类型：CronTrigger', value: 'CronTrigger' }, // 筛选选项1：CronTrigger类型
      { label: '类型：SimpleUpdateTrigger', value: 'SimpleUpdateTrigger' }, // 筛选选项1：SimpleUpdateTrigger类型
      { label: '类型：CalendarUpdateIntervalTrigger', value: 'CalendarUpdateIntervalTrigger' }, // 筛选选项1：CalendarUpdateIntervalTrigger类型
      { label: '类型：DailyUpdateTimeIntervalTrigger', value: 'DailyUpdateTimeIntervalTrigger' }, // 筛选选项1：DailyUpdateTimeIntervalTrigger类型
      { label: '类型：CronUpdateTrigger', value: 'CronUpdateTrigger' }, // 筛选选项1：CronUpdateTrigger类型
      ],
      filterOptions2: [
      { label: '状态：全部', value: '' }, // 筛选选项2：全部状态
      { label: '状态：已安装', value: true }, // 筛选选项2：已安装状态
      { label: '状态：未安装', value: false }, // 筛选选项2：未安装状态
      ],
    };
  },
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {
    //获取脚本列表
    async fetchData() {
      try {
        const className=this.searchKeyword;
        const type = this.filterCriteria;
        const beanState = this.filterCriteria2;
        const response = await axios.post(this.baseURL + `/scriptBuilder/selectAllScript?type=${type}&className=${className}&beanState=${beanState}`);
        this.filteredTableData = response.data.data;
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },

    //筛选
    applyFilter() {
      this.fetchData();
    },

    //格式化状态
    formatBeanState(row, column, cellValue) {
      return cellValue ? '已安装' : '未安装';
    },

    //安装脚本
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
          axios.post(this.baseURL + `/groovyBean/loadGroovyBean?className=${className}`)
            .then(response => {
              
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

    //删除脚本
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
          axios.post(this.baseURL + `/scriptBuilder/deleteScript?id=${id}`)
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

    //跳转脚本详情
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

.search-filter-type {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-filter-type .el-input{
  width: 300px;
  margin-right: 20px;
}

.search-filter-type .el-select{
  width: 200px;
  margin-right: 20px;
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