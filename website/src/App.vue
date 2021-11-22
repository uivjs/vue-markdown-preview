<template>
  <div>
    <header>
      <img alt="Vue logo" src="./assets/logo.png" />
      <a href="https://github.com/ui-vue/vue-markdown-preview" target="__blank">Vue Markdown Preview</a>
      <p>{{ description }}</p>
    </header>
    <example-base></example-base>
    <markdown-preview :source="markdown" class="markdown"></markdown-preview>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';
import str from '@uivjs/vue-markdown-preview/README.md';
import pkg from '@uivjs/vue-markdown-preview/package.json';
import ExampleBase from './Example.vue';
import './App.css';

export default defineComponent({
  data() {
    return {
      markdown: str,
      description: pkg.description,
    };
  },
  components: {
    'example-base': ExampleBase,
    MarkdownPreview,
  },
});
</script>
<style scoped>
header {
  text-align: center;
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #fff;
}
header img {
  height: 20vmin;
}
header a {
  color: #09d3ac;
  font-weight: bold;
}
header p {
  margin-bottom: 10px;
  padding: 10px;
  max-width: 560px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.markdown {
  margin: 0 auto;
  max-width: 820px;
  padding: 16px;
  border-radius: 5px;
  margin-bottom: 110px;
}
</style>
