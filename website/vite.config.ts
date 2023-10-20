import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import raw from 'vite-raw-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
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
          refractor: ['refractor'],
          unified: [
            'comma-separated-tokens',
            'property-information',
            'remark-gfm',
            'remark-parse',
            'remark-rehype',
            'space-separated-tokens',
            'style-to-object',
            'unified',
          ],
          rehype: [
            'rehype-attr',
            'rehype-autolink-headings',
            'rehype-raw',
            'rehype-rewrite',
            'rehype-slug',
            'rehype-stringify',
          ],
          'vue-markdown-preview': ['@uivjs/vue-markdown-preview'],
          'hast-util': ['hast-util-raw', 'hast-util-select', 'mdast-util-to-hast'],
          micromark: ['micromark', 'micromark-core-commonmark', 'micromark-extension-gfm-table'],
          'rehype-prism-plus': ['rehype-prism-plus'],
          'micromark-extension': [
            'micromark-util-subtokenize',
            'micromark-util-character',
            'micromark-util-chunked',
            'micromark-util-subtokenize',
            'micromark-extension-gfm-autolink-literal',
            'micromark-extension-gfm-footnote',
            'micromark-extension-gfm-strikethrough',
            'micromark-extension-gfm-task-list-item',
            'mdast-util-gfm-autolink-literal',
            'mdast-util-to-markdown',
            'mdast-util-find-and-replace',
            'mdast-util-gfm-table',
            'mdast-util-from-markdown',
            'markdown-table',
            'github-slugger',
            'vfile',
          ],
        },
      },
    },
  },
});
