// filepath: d:\asd\KSH3\vite-project\src\views\uploadIP.vue
<template>
  <!-- 更改后端地址页面 -->
  <div class="container">
    <!-- IP 配置卡片 -->
    <div class="card">
      <h3>后端 IP 配置</h3>
      <div class="form-row">
        <div class="form-item">
          <label for="protocol">协议:</label>
          <el-select v-model="protocol" id="protocol" class="input-control">
            <el-option label="http" value="http" />
            <el-option label="https" value="https" />
          </el-select>
        </div>

        <div class="form-item">
          <label for="ip1">IP段1:</label>
          <el-input-number
            v-model="ip1"
            :min="0"
            :max="255"
            controls-position="right"
            id="ip1"
            class="input-control tiny-input"
          />
        </div>

        <div class="form-item">
          <label for="ip2">IP段2:</label>
          <el-input-number
            v-model="ip2"
            :min="0"
            :max="255"
            controls-position="right"
            id="ip2"
            class="input-control tiny-input"
          />
        </div>

        <div class="form-item">
          <label for="ip3">IP段3:</label>
          <el-input-number
            v-model="ip3"
            :min="0"
            :max="255"
            controls-position="right"
            id="ip3"
            class="input-control tiny-input"
          />
        </div>

        <div class="form-item">
          <label for="ip4">IP段4:</label>
          <el-input-number
            v-model="ip4"
            :min="0"
            :max="255"
            controls-position="right"
            id="ip4"
            class="input-control tiny-input"
          />
        </div>

        <div class="form-item">
          <label for="port">端口:</label>
          <el-input-number
            v-model="port"
            id="port"
            class="input-control port-input"
          />
        </div>
      </div>

      <div class="button-row">
        <el-button type="info" @click="updateStore" class="primary-btn">
          更新并使用后端IP
        </el-button>
      </div>
    </div>

    <!-- 域名配置卡片 -->
    <div class="card">
        <h3>后端域名配置</h3>
        <div class="form-row">
            <!-- 新增：协议选择器（与IP区域同步） -->
            <div class="form-item">
            <label for="protocol-domain">协议:</label>
            <el-select v-model="protocol" id="protocol-domain" class="input-control">
                <el-option label="http" value="http" />
                <el-option label="https" value="https" />
            </el-select>
            </div>

            <!-- 域名输入 -->
            <div class="form-item domain-item">
            <label for="域名">域名:</label>
            <el-input v-model="domain" id="域名" class="input-control domain-input" />
            </div>
        </div>
        <div class="button-row">
            <el-button type="info" @click="updateDomain" class="primary-btn">
            更新并使用后端域名
            </el-button>
        </div>
    </div>

    <!-- 当前地址展示卡片 -->
    <div class="card current-info">
      <h3>当前后端地址信息</h3>
      <div class="info-row">
        <span class="label">当前选择的后端地址:</span>
        <span class="value">{{ address }}</span>
      </div>
      <div class="info-row">
        <span class="label">当前选择的后端域名:</span>
        <span class="value">{{ protocol }}://{{ domain }}</span>
      </div>
      <div class="info-row">
        <span class="label">当前生效后端地址:</span>
        <span class="value highlight">{{ baseURL }}</span>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="nav-buttons">
      <el-button
        v-for="item in navItems"
        :key="item.name"
        :type="item.active ? 'info' : 'info'"
        @click="go(item.path)"
        class="nav-btn"
        :class="{ active: item.active }"
      >
        {{ item.name }}
      </el-button>
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
      port: '',
      domain: '',
    };
  },
  computed: {
    ...mapState(['baseURL']),
    address() {
      return `${this.protocol}://${this.ip1}.${this.ip2}.${this.ip3}.${this.ip4}:${this.port}`;
    },
    navItems() {
      const currentPath = this.$route.path.replace('/', '');
      return [
        { name: '任务管理', path: 'JobIndex', active: currentPath === 'JobIndex' },
        { name: '触发器管理', path: 'TriggerIndex', active: currentPath === 'TriggerIndex' },
        { name: '虚拟管理平台', path: 'VirtualPlatform', active: currentPath === 'VirtualPlatform' },
        { name: '监控平台', path: 'sseListener', active: currentPath === 'sseListener' },
      ];
    },
  },
  methods: {
    ...mapActions(['updateBaseURL']),
    updateStore() {
      if (this.ip1 !== '' && this.ip2 !== '' && this.ip3 !== '' && this.ip4 !== '' && this.port !== '') {
        this.updateBaseURL(this.address);
        this.$message.success('后端IP地址已更新');
      } else {
        this.$message.error('请填写完整的IP地址和端口');
      }
    },
    updateDomain() {
      if (this.domain.trim()) {
        this.updateBaseURL(this.protocol + '://' + this.domain);
        this.$message.success('后端域名已更新');
      } else {
        this.$message.error('域名不能为空');
      }
    },
    go(address) {
      this.$router.push({ path: '/' + address });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 40px 20px;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.card {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.input-control {
  width: 140px;
}

.tiny-input {
  width: 90px !important;
}

.port-input {
  width: 160px !important;
}

.domain-input {
  width: 100% !important;
  max-width: 400px;
}

.domain-item {
  flex: 1;
}

.button-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.primary-btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182));
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 当前信息卡片 */
.current-info {
  background: #f0f7ff;
  border: 1px solid #cce5ff;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px dashed #d0d0d0;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
  min-width: 180px;
}

.value {
  color: #333;
  word-break: break-all;
}

.highlight {
  font-weight: 600;
  color: #d32f2f;
}

/* 导航按钮 */
.nav-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.nav-btn {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  background: linear-gradient(to left, rgb(53,204,255), rgb(4,114,182));
  border: none;
  color: white;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: linear-gradient(to right, rgb(53,204,255), rgb(4,114,182));
  transform: scale(1.05);
}

/* Element Plus 深度样式定制 */
:deep(.el-input__wrapper),
:deep(.el-input-number__wrapper) {
  border-radius: 6px !important;
  border: 1px solid #dcdfe6 !important;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input-number__wrapper:hover) {
  border-color: #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

/* :deep(.el-input__inner){
    width: 100px;
} */

:deep(.el-input__inner),
:deep(.el-input-number__input) {
  text-align: center;
  font-size: 14px;
  padding: 8px 0px;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  width: 28px !important;
  height: 16px !important;
}

:deep(.port-input .el-input-number__decrease),
:deep(.port-input .el-input-number__increase) {
  height: 31px !important;
}
</style>