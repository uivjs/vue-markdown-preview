import { defineComponent, h, PropType } from 'vue';
import { unified, PluggableList } from 'unified';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeRewrite from 'rehype-rewrite';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import stringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { octiconLink } from './octiconLink';

export default defineComponent({
  name: 'MarkdownPreview',
  props: {
    rehypePlugins: {
      type: Object as PropType<PluggableList>,
      default: [],
    },
    remarkPlugins: {
      type: Object as PropType<PluggableList>,
      default: [],
    },
    source: {
      default: '',
      type: String,
    },
  },
  setup(props) {
    const { remarkPlugins, rehypePlugins } = props;
    function createHTML(str: string) {
      return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkPlugins || [])
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings)
        .use(rehypePrism, { ignoreMissing: true, alias: { markup: ['vue', 'html'] } })
        .use(rehypeRewrite, {
          rewrite: (node) => {
            if (
              node.type == 'element' &&
              /h(1|2|3|4|5|6)/.test(node.tagName) &&
              node.children &&
              Array.isArray(node.children) &&
              node.children.length > 0
            ) {
              const child = node.children[0];
              if (child && child.type === 'element' && child.properties) {
                child.properties = { className: 'anchor', ...child.properties };
                child.children = [octiconLink()];
              }
            }
          },
        })
        .use(rehypePlugins || [])
        .use(stringify)
        .processSync(str)
        .toString();
    }
    return () => {
      return <div class="markdown-body" innerHTML={createHTML(props.source || '')}></div>;
    };
  },
});
