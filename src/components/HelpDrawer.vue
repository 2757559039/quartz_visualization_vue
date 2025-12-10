<template>
  <el-drawer
    v-model="visible"
    title="使用文档"
    direction="rtl"
    size="50%"
    :with-header="true"
  >
    <div class="markdown-body">
      <h1>一、项目结构和技术栈</h1>
      <p>本项目基于标准的Vue 3架构构建，集成了多种核心技术以实现高效开发和优秀的用户体验。</p>
      <ul>
        <li><strong>前后端交互:</strong> 使用Axios进行HTTP请求处理。</li>
        <li><strong>样式美化:</strong> 引入了Element UI组件库。</li>
        <li><strong>Cron表达式选择:</strong> 集成了vue3-cron-plus-picker。</li>
        <li><strong>代码编辑器:</strong> 使用了Codemirror-editor-vue3。</li>
      </ul>

      <h1>二、数据属性介绍</h1>
      <h2>任务属性</h2>
      <ul>
        <li><strong>任务分组:</strong> 标识任务所属的特定分组。</li>
        <li><strong>任务名:</strong> 在指定的任务分组内唯一标识该任务的名字。</li>
        <li><strong>任务类:</strong> 实现任务逻辑的具体类。</li>
        <li><strong>任务描述:</strong> 对任务的目的或功能进行简要说明。</li>
        <li><strong>自定义JobDetail:</strong> 允许用户根据需求自定义JobDetail信息。</li>
      </ul>

      <h2>触发器属性</h2>
      <p><strong>通用属性:</strong> 触发器分组、触发器名、优先级、开始时间、时区等。</p>
      <p><strong>专有属性:</strong> 针对SimpleTrigger, CronTrigger, CalendarIntervalTrigger, DailyTimeIntervalTrigger的特定配置。</p>

      <h1>三、页面及功能介绍</h1>
      
      <h2>后端地址控制页面</h2>
      <p>支持修改当前后端地址（协议、IP、端口）。</p>

      <h2>任务及触发器管理页面</h2>
      <ul>
        <li>支持基于分组和名称的筛选及模糊搜索。</li>
        <li>支持恢复、暂停、删除所有任务/触发器。</li>
        <li>支持添加任务及挂载触发器。</li>
      </ul>

      <h2>任务管理页面</h2>
      <p>展示任务信息，支持立即执行、恢复、暂停、删除、修改任务、替换触发器。</p>

      <h2>触发器管理页面</h2>
      <p>展示触发器信息，支持恢复、暂停、删除、查看下次触发时间、替换和更改属性。</p>

      <h2>虚拟类管理平台</h2>
      <p>支持虚拟类和脚本的查找、安装、卸载、修改、删除及文件上传。</p>

      <h2>监控平台</h2>
      <p>支持查询监控历史信息和实时监控链接。</p>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'HelpDrawer',
  data() {
    return {
      visible: false
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.markdown-body {
  padding: 20px;
  line-height: 1.6;
  color: #333;
}
.markdown-body h1 {
  font-size: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
}
.markdown-body h2 {
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}
.markdown-body ul {
  padding-left: 20px;
  margin-bottom: 16px;
}
.markdown-body li {
  margin-bottom: 8px;
}
</style>