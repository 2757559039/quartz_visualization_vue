<template>
  <div class="unerected-list">
    <!-- 类型切换 -->
    <div class="type-switch">
      <el-radio-group v-model="currentType" size="medium">
        <el-radio-button label="class">类</el-radio-button>
        <el-radio-button label="config">配置文件</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-show="showTable"
    >
      <!-- 类名列 -->
      <el-table-column
        v-if="currentType === 'class'"
        prop="className"
        label="类名"
        width="180"
      />

      <!-- 配置文件名列 -->
      <el-table-column
        v-if="currentType === 'config'"
        prop="configName"
        label="配置文件名"
        width="180"
      />

      <!-- 占位列 -->
      <el-table-column prop="placeholder1" label="列2" width="180" />
      <el-table-column prop="placeholder2" label="列3" width="180" />
      <el-table-column prop="placeholder3" label="列4" width="180" />

      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #header>
          <!-- 操作列不需要表头 -->
          <div></div>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
          <el-button size="small" @click="k(scope.row)">安装</el-button>
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
    // 控制表格是否显示（在上一个页面标签切换时传入）
    showTable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentType: 'class', // 当前类型，初始为类
      tableData: [], // 表格数据
    };
  },
  methods: {
    // 获取数据
    async fetchData() {
        try {
          const response = await axios.post('http://114.132.71.250:8002/groovyBean/selectAllGroovyBean');
          this.filteredTableData = response.data;
        } catch (error) {
          console.error('数据获取失败:', error);
        }
      },
    // 操作按钮点击事件
    handleDelete(row) {
      console.log('删除:', row);
      // 删除逻辑
    },
    handleEdit(row) {
      console.log('编辑:', row);
      // 编辑逻辑
    },
    handleDetail(row) {
      console.log('查看:', row);
      // 查看逻辑
    },
  },
  watch: {
    // 监听类型切换，重新获取数据
    currentType: {
      handler() {
        this.fetchData();
      },
      immediate: true,
    },
  },
  mounted() {
    // 组件挂载时获取数据
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.unerected-list {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.type-switch {
  margin-bottom: 20px;
  text-align: center;
}

.el-table {
  :deep(.cell) {
    text-align: center;
  }
}
</style>