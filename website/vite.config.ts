import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import raw from 'vite-raw-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-markdown-preview',
  plugins: [
    vue(),
    raw({
      fileRegex: /\.md$/,
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'dist/deps.html', //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          'vue-markdown-preview': ['@uivjs/vue-markdown-preview'],
          'hast-util': [
            'hast-util-has-property',
            'hast-util-heading-rank',
            'hast-util-is-element',
            'hast-util-to-string',
            'hast-util-parse-selector',
            'hast-util-from-parse5',
            'hast-util-raw',
            'hast-util-to-parse5',
            'hast-util-select',
            'hast-util-whitespace',
            'hast-util-to-html',
            'hastscript',
            'mdast-util-to-hast',
          ],
          unified: [
            'unified',
            'comma-separated-tokens',
            'property-information',
            'remark-gfm',
            'remark-parse',
            'remark-rehype',
            'space-separated-tokens',
            'style-to-object',
            'refractor',
            'rehype-attr',
            'rehype-autolink-headings',
            'rehype-parse',
            'rehype-raw',
            'rehype-rewrite',
            'rehype-slug',
            'rehype-stringify',
            'remark-rehype',
          ],
          'rehype-prism-plus': ['rehype-prism-plus'],
          'micromark-extension': [
            'micromark',
            'micromark-util-character',
            'micromark-extension-gfm',
            'micromark-extension-gfm-autolink-literal',
            'micromark-extension-gfm-footnote',
            'micromark-core-commonmark',
            'micromark-factory-destination',
            'micromark-factory-label',
            'micromark-factory-title',
            'micromark-factory-whitespace',
            'micromark-factory-space',
            'micromark-extension-gfm-strikethrough',
            'micromark-extension-gfm-table',
            'micromark-extension-gfm-tagfilter',
            'micromark-extension-gfm-task-list-item',
            'micromark-util-combine-extensions',
            'micromark-util-types',
            'micromark-util-decode-numeric-character-reference',
            'micromark-util-decode-string',
            'micromark-util-normalize-identifier',
            'micromark-util-chunked',
            'micromark-util-classify-character',
            'micromark-util-resolve-all',
            'micromark-util-html-tag-name',
            'micromark-util-encode',
            'micromark-util-subtokenize',
            'micromark-util-sanitize-uri',
          ],
        },
      },
    },
  },
});
