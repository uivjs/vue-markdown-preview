import { Plugin } from 'unified';
import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export type AliasLanguageOptions = {};

const aliasLanguage: Plugin<[AliasLanguageOptions?], Root> = (options) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code' && parent?.type === 'element' && parent.tagName === 'pre') {
        if (node.properties && 'className' in node.properties && Array.isArray(node.properties.className)) {
          node.properties.className = node.properties.className.map((cls) => {
            if (typeof cls === 'string') {
              return cls.replace(/^language-vue/, 'language-html');
            }
            return cls;
          });
        }
      }
    });
  };
};

export default aliasLanguage;
