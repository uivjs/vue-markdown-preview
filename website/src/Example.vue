<template>
  <div class="example">
    <textarea v-model="message" placeholder="Please enter the Markdown code!"></textarea>
    <markdown-preview :source="message" class="markdown">{{ message }}</markdown-preview>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import MarkdownPreview from '@uivjs/vue-markdown-preview';

export default defineComponent({
  data() {
    return {
      message: '',
    };
  },
  components: {
    MarkdownPreview,
  },
});
</script>
<style scoped>
.example {
  max-width: 560px;
  margin: 0 auto;
  padding: 30px 0 60px 0;
}
.example .markdown-body {
  border-radius: 5px;
  margin-top: 16px;
  min-height: 30px;
}
.example textarea {
  border-radius: 5px;
  max-width: 100%;
  min-width: 100%;
  padding: 5px;
  box-sizing: border-box;
  display: block;
  min-height: 120px;
}
</style>
