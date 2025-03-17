# 一、项目结构和技术栈

本项目基于标准的Vue 3架构构建，集成了多种核心技术以实现高效开发和优秀的用户体验。以下是主要使用的技术栈及其作用：

*   **前后端交互:** 使用**Axios**进行HTTP请求处理，确保前后端数据传输的高效与稳定。
*   **样式美化:** 引入了**Element UI组件库**，提供了丰富的UI组件，简化了界面设计流程，并保持了一致的设计风格。
*   **分辨率适配:** 通过**PostCSS-px-to-viewport**插件，实现了页面在不同设备上的完美显示，解决了分辨率兼容性问题。
*   **Cron表达式选择:** 集成了**vue3-cron-plus-picker**，提供了一个直观且易用的Cron表达式生成器，方便用户配置定时任务。
*   **代码编辑器:** 使用了**Codemirror-editor-vue3**作为代码编辑器，支持多种编程语言的语法高亮、自动补全等功能，极大地提升了编码效率。

# 二、项目架构概述

1.  **项目目录结构:**

    *   **src/**: 包含所有源代码文件。

        *   **assets/**: 存放静态资源，如图片、字体等。
        *   **components/**: 存放可复用的Vue组件。
        *   **views/**: 页面级组件存放处，每个文件通常对应一个路由。
        *   **router/**: 路由配置，定义页面跳转逻辑。
        *   **store/**: Vuex状态管理，集中管理应用的状态。
        *   **App.vue**: 应用的主要组件。
        *   **main.js**: 应用入口文件，负责初始化Vue实例。

***

# 数据属性介绍

## 任务属性

*   **任务分组:** 标识任务所属的特定分组。
*   **任务名:** 在指定的任务分组内唯一标识该任务的名字。
*   **任务类:** 实现任务逻辑的具体类。
*   **任务描述:** 对任务的目的或功能进行简要说明。
*   **自定义JobDetail:** 允许用户根据需求自定义JobDetail信息。

## 触发器属性

**通用属性:**

*   **触发器分组:** 标识触发器所属的分组。
*   **触发器名:** 在指定分组内的触发器名称。
*   **触发器优先级:** 调整触发顺序（范围1至999）。
*   **触发器开始时间:** 设置触发器激活的时间点（格式：yyyy/mm/dd）。
*   **时区:** 默认设置为Asia/Shanghai，但可以根据具体需要调整。
*   **触发器类型:** 支持多种类型的触发器，包括SimpleTrigger、CronTrigger、CalendarIntervalTrigger和DailyTimeIntervalTrigger等。\
    注：当启用自定义触发器时，无需填写触发器属性，内部会以完整定义方式处理。

**专有属性:**

*   **SimpleTrigger:**
    *   **simpletimesecond:** 定义触发间隔，单位为秒。
    *   **repeatcount:** 触发器执行次数。

*   **CronTrigger:**
    *   **cronexpression:** 使用Cron表达式来定义复杂的调度计划。

*   **CalendarIntervalTrigger:**
    *   **calendartime:** 时间间隔单位（年月日时分秒）。
    *   **calendarnum:** 触发器间隔次数。
    *   **preserveHourOfDayAcrossDaylightSavings:** 是否在夏令时期间保持小时不变。
    *   **skipDayIfHourDoesNotExist:** 当指定的小时不存在时是否跳过这一天。

*   **DailyTimeIntervalTrigger:**
    *   **dailytime:** 时间间隔单位。
    *   **dailynum:** 间隔次数。
    *   **dailyrepeatcount:** 总执行次数。
    *   **dayStartTime:** 每天开始时间。
    *   **dayEndTime:** 每天结束时间。
    *   **dailyworkday:** 执行日选择（星期几）。

运行时属性

*   **isConcurrentExectionDisallowed:** 控制是否允许并发执行。
*   **previousFireTime:** 上次触发时间。
*   **nextFireTime:** 下次触发时间。
*   **remainingTime:** 距离下次触发的时间。
*   **finalFireTime:** 最终触发时间。
*   **misfireInstruction:** 定义错过触发策略。

# 页面及功能介绍

## 通用功能

*   **页面跳转及当前后端地址展示:**

    *   提供页面间的导航支持。
    *   展示当前连接的后端地址，便于用户了解当前环境配置。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/通用跳转后端地址.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/通用跳转任务展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/通用跳转触发器展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/通用跳转虚拟类管理平台.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/通用跳转监控平台.png)

## 后端地址控制页面

*   **主要功能:** 修改当前后端地址。
*   **功能介绍:** 用户需选择协议（如HTTP或HTTPS），并填写IP地址和端口号来修改后端地址。也可以通过修改`.env`文件来设置默认的后端地址。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/后端地址.png)


## 任务及触发器管理页面

*   **基于分组和名称的筛选及模糊搜索功能:**

    *   支持按任务或触发器的分组和名称进行筛选，并提供模糊搜索功能，方便快速定位所需的任务或触发器。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/任务筛选.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/触发器筛选.png)

*   **所有任务操作按钮:**

    *   包含恢复、暂停、删除等按钮，点击后会有确认弹窗以确保用户确实希望执行该操作。

!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/all任务展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/all触发器展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/all恢复.png)

*   **添加任务及挂载触发器:**
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/tg任务展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/tg触发器二级展示.png)

    *   **添加任务功能弹窗:** 填写完整任务信息可以增加一个新任务。若同时填写了触发器属性，则可以直接挂载触发器。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/添加任务.png)


    *   **挂载触发器功能弹窗:** 选择已有任务并填写完整的触发器属性，可将该触发器挂载到所选任务上。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/挂载任务.png)


## 任务管理页面

*   **主要功能:**

    *   展示当前任务及其下属触发器的信息，并提供立即执行一次、恢复、暂停、删除、更改任务属性、替换触发器等功能。

*   **当前任务展示:**

    *   显示任务的分组、名称、任务类、描述以及下属触发器的数量和详细信息（如分组、名称、触发器类型、开始时间、结束时间和状态）。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/任务展示.png)


*   **当前任务操作:**

    *   操作包括立即执行任务、恢复任务、暂停任务、删除任务等，每项操作前都有确认弹窗以避免误操作。

!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/操作任务展示.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/任务操作确认弹窗.png)


*   **替换触发器功能弹窗:**

    *   可选择触发器进行替换，填写具体属性后执行替换操作。注意，当触发器组名与其他非选择的触发器组名相同时，旧触发器会被删除且不会自动挂载新触发器。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/替换触发器.png)

*   **更改任务属性功能弹窗:**

    *   允许修改任务描述、任务类和自定义JobDetail。如果选择的任务类或JobDetail不符合要求，相应属性的更改将失效。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/更新任务属性.png)


## 触发器管理页面

*   **主要功能:**

    *   展示触发器的基础属性、专有属性及运行时属性，并提供恢复、暂停、删除、查看下次触发时间、替换和更改属性的功能。

*   **展示触发器基本信息:**

    *   包括分组、名称、类型、优先级、状态、开始时间、结束时间,及专有属性及运行时属性等。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/触发器二级展示.png)


*   **当前触发器操作按钮:**

    *   类似于任务的操作按钮，包含恢复、暂停、删除等，每个操作都需要确认。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/触发器操作确认弹窗.png)




*   **查看下次触发时间功能弹窗:**

    *   用户指定某个时间点后，系统会计算并显示该触发器在指定时间点后的下一次触发时间。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/下一次触发时间查询弹窗.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/下一次触发时间结果弹窗.png)


*   **替换当前触发器功能弹窗:**

    *   通过填写完整的触发器属性，将现有触发器替换为新的触发器，但新触发器挂载的任务与旧触发器相同。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/触发器页面替换触发器.png)

*   **更改触发器属性功能弹窗:**

    *   允许修改触发器的部分属性，但不能修改其分组、名称和类型。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/更改触发器属性.png)


## 虚拟类管理平台

*   **主要功能:**

    *   支持虚拟类的查找、卸载、脚本的查找、安装、修改、删除以及配置文件或类的编写与上传。

*   **虚拟类的查找功能:**

    *   通过虚拟类类型进行筛选，并在此基础上通过类名进行模糊查询。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/虚拟类筛选.png)


*   **虚拟类的卸载按钮:**

    *   点击出现确认弹窗，确认后执行卸载操作。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/虚拟类卸载.png)


*   **脚本的查找功能:**

    *   根据脚本类型及状态进行查询，并支持模糊查询。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/脚本筛选.png)


*   **脚本的安装与删除按钮:**

    *   点击后出现确认弹窗，确认后执行具体操作。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/脚本安装.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/脚本删除.png)

*   **脚本的修改弹窗:**

    *   支持对脚本代码进行查看或编辑。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/脚本查看与修改.png)


*   **配置文件或类的编写与上传:**

    *   提供界面用于编写配置文件或类，并支持上传至服务器。
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/配置文件及类的上传.png)


## 监控平台

*   **主要功能:**

    *   可选择key和recordDate进行查询监控历史信息和链接实时监控,关闭监控链接,清空输出

*   **查询监控历史信息和链接实时监控:**

    *   选择key和recordDate后,点击确认按钮
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/监控平台.png)
!\[image\]\( https://github.com/2757559039/quartz_visualization_vue/blob/前端/public/介绍图片/监控平台展示.png)
