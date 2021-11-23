@uivjs/vue-markdown-preview
===

[![Build & Deploy](https://github.com/uivjs/vue-markdown-preview/actions/workflows/ci.yml/badge.svg)](https://github.com/uivjs/vue-markdown-preview/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dm/@uivjs/vue-markdown-preview.svg?style=flat)](https://www.npmjs.com/package/@uivjs/vue-markdown-preview)
[![npm version](https://img.shields.io/npm/v/@uivjs/vue-markdown-preview.svg)](https://www.npmjs.com/package/@uivjs/vue-markdown-preview)
[![npm unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@uivjs/vue-markdown-preview/file/README.md)

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

## API

- `source` (`string`, default: `''`) Markdown to parse
- `remarkPlugins` (`Array.<Plugin>`, default: `[]`) List of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options
- `rehypePlugins` (`Array.<Plugin>`, default: `[]`) List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options

## Related

- [react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) React component preview markdown text in web browser. 

## License

Licensed under the MIT License.
