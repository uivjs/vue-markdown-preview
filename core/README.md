@uivjs/vue-markdown-preview
===

[![Build & Deploy](https://github.com/uivjs/vue-markdown-preview/actions/workflows/ci.yml/badge.svg)](https://github.com/uivjs/vue-markdown-preview/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dm/@uivjs/vue-markdown-preview.svg?style=flat)](https://www.npmjs.com/package/@uivjs/vue-markdown-preview)
[![npm version](https://img.shields.io/npm/v/@uivjs/vue-markdown-preview.svg)](https://www.npmjs.com/package/@uivjs/vue-markdown-preview)
[![npm unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@uivjs/vue-markdown-preview/file/README.md)

Markdown component for Vue. The minimal amount of CSS to replicate the GitHub Markdown style. The current document website is converted using this Vue component.

## Feature

- ⛑ [Safe](#Security) by default (no `v-html`/`innerHTML` or XSS attacks)
- ♻️ [Components](#components) (pass your own component to use instead of `<h2>` for `## hi`)
- 🧩 [Plugins](#plugins) (many plugins you can pick and choose from)
- ☘️ [Compliant](#components) (100% to CommonMark, 100% to GFM with a plugin)

## Install

```bash
npm i @uivjs/vue-markdown-preview
```

## Usage

```vue
<template>
  <div>
    <markdown-preview :source="markdown" />
    <markdown-preview class="markdown-warpper">
      {{markdown}}
    </markdown-preview>
    <markdown-preview>
      ## Hello Markdown
    </markdown-preview>
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

## Examples

### Use a plugin

This example shows how to use a remark plugin. In this case, [remark-gfm](https://github.com/remarkjs/remark-gfm), which adds support for strikethrough, tables, tasklists and URLs directly:

```vue
<template>
  <markdown-preview :remarkPlugins="remarkPlugins">
    {{markdown}}
  </markdown-preview>
</template>

<script>
import { defineComponent } from 'vue';
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';
import remarkGfm from 'remark-gfm';

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://vuejs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;

export default defineComponent({
  data() {
    return {
      markdown,
      remarkPlugins: [remarkGfm]
    }
  },
  components: {
    MarkdownPreview
  }
});
</script>
```

### Use a plugin with options

This example shows how to use a plugin and give it options. To do that, use an array with the plugin at the first place, and the options second. [remark-gfm](https://github.com/remarkjs/remark-gfm) has an option to allow only double tildes for strikethrough:

```vue
<template>
  <markdown-preview :remarkPlugins="remarkPlugins">
    This ~is not~ strikethrough, but ~~this is~~!
  </markdown-preview>
</template>

<script>
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';
import remarkGfm from 'remark-gfm';

export default {
  data() {
    return {
      remarkPlugins: [[remarkGfm, { singleTilde: false }]]
    }
  },
  components: {
    MarkdownPreview
  }
};
</script>
```

## Components

You can also change the things that come from markdown:

```vue
<template>
  <markdown-preview :components="components">
    {{`<em>www  \nxxx</em>\n- 1\n- 2`}}
  </markdown-preview>
</template>

<script>
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';

export default {
  data() {
    return {
      components: {
        em: ({ children, ...properties}) => {
          return <i style={{ color: 'red' }} {...properties}>{children}</i>
        },
        li: ({ node, checked, index, ordered, children, ...properties}) => {
          console.log('other:', node, properties, children, checked, index, ordered)
          return <li {...properties}>{children}</li>
        },
      }
    }
  },
  components: {
    MarkdownPreview
  }
};
</script>
```

The keys in components are HTML equivalents for the things you write with markdown (such as `h1` for `# heading`). Normally, in markdown, those are: `a`, `blockquote`, `br`, `code`, `em`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hr`, `img`, `li`, `ol`, `p`, `pre`, `strong`, and `ul`. With [remark-gfm](https://github.com/remarkjs/remark-gfm), you can also use: `del`, `input`, `table`, `tbody`, `td`, `th`, `thead`, and `tr`. Other remark or rehype plugins that add support for new constructs will also work with `vue-markdown-preview`.

The props that are passed are what you probably would expect: an a (link) will get href (and title) props, and img (image) an src (and title), etc. There are some extra props passed.

- `code`
  - `inline` (`boolean?`) — set to true for inline code
  - `className` (string?) — set to language-js or so when using `\```js`
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
  - `level` (`number` between 1 and 6) — heading rank
- `input` (when using [remark-gfm](https://github.com/remarkjs/remark-gfm))
  - `checked` (`boolean`) — whether the item is checked
  - `disabled` (`true`)
  - `type` (`'checkbox'`)
- `li`
  - `index` (`number`) — number of preceding items (so first gets `0`, etc.)
  - `ordered` (`boolean`) — whether the parent is an ol or not
  - `checked` (`boolean`?) — null normally, boolean when using [remark-gfm](https://github.com/remarkjs/remark-gfm)’s tasklists
  - `className` (`string`?) — set to task-list-item when using [remark-gfm](https://github.com/remarkjs/remark-gfm) and the item1 is a tasklist
- `ol`, `ul`
  - `depth` (`number`) — number of ancestral lists (so first gets `0`, etc.)
  - `ordered` (`boolean`) — whether it’s an ol or not
  - `className` (`string?`) — set to contains-task-list when using [remark-gfm](https://github.com/remarkjs/remark-gfm) and the list contains one or more tasklists
- `td`, `th` (when using [remark-gfm](https://github.com/remarkjs/remark-gfm))
  - `style` (`Object?`) — something like `{textAlign: 'left'}` depending on how the cell is aligned
  - `isHeader` (`boolean`) — whether it’s a th or not
- `tr` (when using [remark-gfm](https://github.com/remarkjs/remark-gfm))
  - `isHeader` (`boolean`) — whether it’s in the thead or not

Every component will receive a node (Object). This is the original [`hast`](https://github.com/syntax-tree/hast) element being turned into a Vue element.

## API

- `source` (`string`, default: `''`) Markdown to parse.
- `components` (`Object.<string, VNodeChild>`, default: `{}`) Object mapping tag names to [`Vue`](https://vuejs.org) components.
- `remarkPlugins` (`Array.<Plugin>`, default: `[]`) List of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options.
- `rehypePlugins` (`Array.<Plugin>`, default: `[]`) List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options.
- `skipHtml` (`boolean`, default: `false`) ignore HTML in markdown completely.
- `linkTarget` (`string` or `(href, children, title) => string`, optional) target to use on links (such as `_blank` for `<a target="_blank"…`)
- `sourcePos` (`boolean`, default: `false`) pass a prop to all components with a serialized position (`data-sourcepos="3:1-3:13"`)
- `rawSourcePos` (`boolean`, default: `false`)
pass a prop to all components with their [`position`](https://github.com/syntax-tree/unist#position) (`sourcePosition: {start: {line: 3, column: 1}, end:…}`)
- `includeElementIndex` (`boolean`, default: `false`) pass the index (number of elements before it) and `siblingCount` (number of elements in parent) as props to all components
- `transformLinkUri` (`(href, children, title) => string`, default: [`uriTransformer`](https://github.com/uivjs/vue-markdown-preview/blob/main/core/src/utils/uri-transformer.ts), optional) change URLs on links, pass null to allow all URLs, see [security](#security).
- `transformImageUri` (`(src, alt, title) => string`, default: [`uriTransformer`](https://github.com/uivjs/vue-markdown-preview/blob/main/core/src/utils/uri-transformer.ts), optional) change URLs on images, pass null to allow all URLs, see [security](#security)

## Plugins

We use [unified](https://github.com/unifiedjs/unified), specifically [remark](https://github.com/remarkjs/remark) for markdown and [rehype](https://github.com/rehypejs/rehype) for HTML, which are tools to transform content with plugins. Here are three good ways to find plugins:

- [awesome-remark](https://github.com/remarkjs/awesome-remark) and [awesome-rehype](https://github.com/rehypejs/awesome-rehype) — selection of the most awesome projects
- List of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) and list of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) — list of all plugins
- [remark-plugin](https://github.com/topics/remark-plugin) and [rehype-plugin](https://github.com/topics/rehype-plugin) topics — any tagged repo on GitHub

## Syntax

`vue-markdown-preview` follows CommonMark, which standardizes the differences between markdown implementations, by default. Some syntax extensions are supported through plugins.

We use [`micromark`](https://github.com/micromark/micromark) under the hood for our parsing. See its documentation for more information on markdown, CommonMark, and extensions.

## Types

This package is fully typed with [TypeScript](https://www.typescriptlang.org/). It exports Options and Components types, which specify the interface of the accepted props and components.

## Security

Use of `vue-markdown-preview` is secure by default. Overwriting `transformLinkUri` or `transformImageUri` to something insecure will open you up to XSS vectors. Furthermore, the `remarkPlugins`, `rehypePlugins`, and components you use may be insecure.

To make sure the content is completely safe, even after what plugins do, use [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize). It lets you define your own schema of what is and isn’t allowed.


## Development

```bash
npm install       # Installation dependencies
npm run bootstrap # Install dependencies in sub-packages
```

```bash
npm run build     # Compile package
# listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch     # Monitor the compiled package `@uivjs/vue-markdown-preview`
npm run start     # development mode, listen to compile preview website instance
```

## Related

- [react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) React component preview markdown text in web browser. 
- [react-markdown](https://www.npmjs.com/package/react-markdown) Markdown component for React.

## License

Licensed under the MIT License.
