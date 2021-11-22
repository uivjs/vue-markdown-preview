@uivjs/vue-markdown-preview
===

Vue component preview markdown text in web browser. The minimal amount of CSS to replicate the GitHub Markdown style. The current document website is converted using this Vue component.

## Install

```bash
npm i @uivjs/vue-markdown-preview
```

## Usage

```vue
<template>
  <div>
    <markdown-preview :source="markdown"></markdown-preview>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';

const markdown = `## Hello Markdown
\`\`\`shell
npm i @uivjs/vue-markdown-preview
\`\`\`
`;

export default defineComponent({
  data() {
    return {
      markdown
    }
  },
  components: {
    MarkdownPreview
  }
});
</script>
```
## Related

- [react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) React component preview markdown text in web browser. 

## License

Licensed under the MIT License.
