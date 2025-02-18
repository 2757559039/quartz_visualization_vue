<template>
  <div class="unerected-list">
    <!-- 搜索框和筛选框 -->
    <div class="search-filter-type">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索关键字"
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
        placeholder="筛选条件"
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
            <el-button class="gxb" @click="handleInstall(scope.row)">安装</el-button>
            <el-button class="xzb">查看</el-button>
            <el-button class="xzb">修改</el-button>
            <el-button class="xzb" @click="handleDelete(scope.row)">删除</el-button>
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
        { label: '全部', value: '' },
        { label: '状态1', value: 'status1' },
        { label: '状态2', value: 'status2' },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post('http://114.132.71.250:8002/scriptBuilder/selectAllScript');
        this.filteredTableData = response.data.data;
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    applyFilter() {
      this.filteredTableData = this.tableData.filter((item) => {
        const matchesSearch = item.className
          ? item.className.toLowerCase().includes(this.searchKeyword.toLowerCase())
          : true;
        const matchesFilter = this.filterCriteria
          ? item.status === this.filterCriteria
          : true;
        return matchesSearch && matchesFilter;
      });
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
          axios.post(`http://114.132.71.250:8002/groovyBean/loadGroovyBean?className=${className}`)
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
          axios.post(`http://114.132.71.250:8002/scriptBuilder/deleteScript?id=${id}`)
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