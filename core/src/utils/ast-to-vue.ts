import { VNodeChild, h, isVNode } from 'vue';
import { RootContent, Element, ElementContent } from 'hast';

export interface CNode extends Omit<ElementContent, 'children'> {
  children: VNodeChild[];
  node: Element;
}
export type Components = Record<string, (node: CNode) => VNodeChild>;
export interface Options {
  components: Components;
}
export function childrenToVue(node: RootContent[], options: Options): VNodeChild[] {
  return node.map((item) => {
    if (item.type === 'text') {
      return item.value;
    }
    if (
      item.type === 'element' &&
      options.components[item.tagName] &&
      typeof options.components[item.tagName] === 'function'
    ) {
      const cnode: CNode = {
        ...item,
        node: item,
        children: childrenToVue(item.children || [], options),
      };
      const vnode = options.components[item.tagName](cnode);
      if (vnode && isVNode(vnode)) {
        return vnode;
      }
    }
    if (item.type === 'element' && item.children) {
      // @ts-ignore
      let className = item.properties.className || item.properties.class;
      // @ts-ignore
      item.properties.className = Array.isArray(className) ? className.join(' ') : className;
      // item.properties.className
      return h(item.tagName, item.properties, childrenToVue(item.children, options));
    }
  });
}
