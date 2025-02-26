<template>
    <div class="code-editor">
    <!-- <div class="code-editor"  :class="{ 'multi-line': lineten >= 1 }"> -->
      <Codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        height="100%"
        width="100%"
        @ready="onReady"
      />
    </div>
  </template>
  
  <script>
  import Codemirror from 'codemirror-editor-vue3';
  // 引入基本样式和主题
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/theme/idea.css';
  // 引入语言模式
  import 'codemirror/mode/clike/clike.js';
  // 引入自动补全相关资源
  import 'codemirror/addon/hint/show-hint.css';
  import 'codemirror/addon/hint/show-hint.js';
  import 'codemirror/addon/hint/anyword-hint.js';
  // 引入代码折叠相关资源
  import 'codemirror/addon/fold/foldcode.js';
  import 'codemirror/addon/fold/foldgutter.js';
  import 'codemirror/addon/fold/brace-fold.js'; // 或者其他适合的折叠模式
  
  export default {
    name: 'CodeEditor',
    components: {
      Codemirror,
    },
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      language: {
        type: String,
        default: 'java',
      },
    },
    data() {
      return {
        code: this.modelValue || '',
        editorInstance: null, // 保存编辑器实例
        // lineCount: 0,
        // lineten:0,
      };
    },
    computed: {
      cmOptions() {
        return {
          mode: this.getMode(this.language),
          theme: 'idea',
          lineNumbers: true,
          lineWrapping: true,
          tabSize: 4,
          hintOptions: {
            completeSingle: false,
          },
          // 自动补全配置
          extraKeys: {
            'Ctrl-Space': 'autocomplete', // 使用 Ctrl+Space 触发自动补全
          },
          // 折叠配置
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        };
      },
    },
    methods: {
      getMode(language) {
        const modes = {
          java: 'text/x-java',
          json: 'text/x-json',
        };
        return modes[language] || modes.java|| modes.json;
      },
      onReady(editor) {
        this.editorInstance = editor; // 保存编辑器实例
        this.lineCount = editor.lineCount();// 初始化时获取行数
        // 初始化折叠功能
        editor.foldCode(CodeMirror.Pos(0, 0));
        // 设置输入监听以触发自动补全
        editor.on('inputRead', (cm, location) => {
          if (/[a-zA-Z]/.test(location.text[0])) {
            cm.showHint();
          }
        });
        // editor.on('change', () => {// 监听内容变化
        //   this.lineCount = editor.lineCount();
        //   if(this.lineCount>=10){
        //     this.lineten = 1;
        //   }
        // });
      },
    },
    watch: {
      code(newVal) {
        this.$emit('update:modelValue', newVal);
      },
      modelValue(newVal) {
        this.code = newVal || '';
      },
      language(newVal) {
        this.cmOptions.mode = this.getMode(newVal);
        if (this.editorInstance) {
          this.editorInstance.setOption('mode', this.cmOptions.mode);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .code-editor {
    width: 90%;
    height: 500px;
    /* overflow: auto; */
    border: 1px solid #ddd;
    /* border-radius: 5px; */
    /* margin-top: 20px; */
    font-size: 20px;
  }

  :deep(.CodeMirror-gutters){
    width: 30px;
  }
  /* :deep(.CodeMirror-lines) {
    padding-left: 30px;
  }

  .code-editor.multi-line :deep(.CodeMirror-lines) {
    padding-left: 0px;
  }
  :deep(.CodeMirror-gutter-elt){
    left:-30px !important;
  }
  .code-editor.multi-line :deep(.CodeMirror-gutter-elt) {
    left:0px !important;
  } */
  :deep(.CodeMirror-hints){
    z-index: 10111;
  }
  </style>