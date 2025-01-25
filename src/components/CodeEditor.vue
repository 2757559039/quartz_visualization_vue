<template>
    <div class="code-editor">
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
        };
        return modes[language] || modes.java;
      },
      onReady(editor) {
        this.editorInstance = editor; // 保存编辑器实例
        // 初始化折叠功能
        editor.foldCode(CodeMirror.Pos(0, 0));
        // 设置输入监听以触发自动补全
        editor.on('inputRead', (cm, location) => {
          if (/[a-zA-Z]/.test(location.text[0])) {
            cm.showHint();
          }
        });
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
    width: 1440px;
    height: 750px;
    /* overflow: auto; */
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 20px;

    font-size: 20px;
  }
  </style>