import { VNodeChild, h } from 'vue';
import { RootContent } from 'hast';

export function childrenToReact(node: RootContent[]): VNodeChild[] {
  return node.map((item) => {
    if (item.type === 'text') {
      return item.value;
    }
    if (item.type === 'element' && item.children) {
      // @ts-ignore
      let className = item.properties.className || item.properties.class;
      // @ts-ignore
      item.properties.className = Array.isArray(className) ? className.join(' ') : className;
      return h(item.tagName, item.properties, childrenToReact(item.children));
    }
  });
}
