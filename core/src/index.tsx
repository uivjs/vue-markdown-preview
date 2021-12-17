import { defineComponent, h, PropType, ExtractPropTypes, Fragment, Text, VNode } from 'vue';
import { unified, PluggableList } from 'unified';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import rehypeAttrs from 'rehype-attr';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeRewrite from 'rehype-rewrite';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { ElementContent, Root, Element } from 'hast';
import { VFile } from 'vfile';
import { octiconLink } from './nodes/octiconLink';
import { copyElement } from './nodes/copyElement';
import { childrenToVue, Components } from './utils/ast-to-vue';

const markdownPreview = {
  rehypePlugins: {
    type: Object as PropType<PluggableList>,
    default: [],
  },
  remarkPlugins: {
    type: Object as PropType<PluggableList>,
    default: [],
  },
  components: {
    type: Object as PropType<Components>,
    default: {},
  },
  source: {
    type: String,
    default: '',
  },
};

type ExtractPublicPropTypes<T> = Omit<Partial<ExtractPropTypes<T>>, Extract<keyof T, `internal${string}`>>;

const getCodeStr = (data: ElementContent[] = [], code: string = '') => {
  data.forEach((node) => {
    if (node.type === 'text') {
      code += node.value;
    } else if (node.type === 'element' && node.children && Array.isArray(node.children)) {
      code += getCodeStr(node.children);
    }
  });
  return code;
};

export type MarkdownPreviewProps = ExtractPublicPropTypes<typeof markdownPreview>;
export default defineComponent({
  name: 'MarkdownPreview',
  props: markdownPreview,
  setup(props, { slots }) {
    const { remarkPlugins, rehypePlugins } = props;
    function processor() {
      return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkPlugins || [])
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeAttrs, { properties: 'attr' })
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
            if (node.type === 'element' && node.tagName === 'pre') {
              const code = getCodeStr(node.children);
              node.children.push(copyElement(code));
            }
          },
        })
        .use(rehypePlugins || []);
    }
    return () => {
      const children =
        slots && slots.default
          ? slots
              .default()
              .filter((item) => item.type === Text)
              .map((item) => item.children)
          : [];
      const file = new VFile();
      file.value = children && children.length > 0 ? children.join() : props.source;
      const prc = processor();
      const hastNode = prc.runSync(prc.parse(file), file) as unknown as Element | Root;
      if (hastNode.type !== 'root') {
        throw new TypeError('Expected a `root` node');
      }
      let result = h(Fragment, {}, childrenToVue(hastNode.children, { components: props.components }));
      return <div class="markdown-body">{result}</div>;
    };
  },
});
