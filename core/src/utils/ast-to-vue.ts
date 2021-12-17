import { VNodeChild, h, Fragment, isVNode } from 'vue';
import { Element, DocType, Comment, Root, Text, Properties } from 'hast';
import { Position } from 'unist';
import { whitespace } from 'hast-util-whitespace';
import { Schema, svg, find } from 'property-information';
import { stringify as spaces } from 'space-separated-tokens';
import { stringify as commas } from 'comma-separated-tokens';
import style from 'style-to-object';
import { MarkdownPreviewProps } from '../';

export type Components = Record<string, (node: Properties | { node: Element }) => VNodeChild>;
export type Raw = {
  type: 'raw';
  value: string;
};
export interface Options {
  listDepth: number;
  schema: Schema;
  components: MarkdownPreviewProps['components'];
  skipHtml: MarkdownPreviewProps['skipHtml'];
  sourcePos: MarkdownPreviewProps['sourcePos'];
  rawSourcePos: MarkdownPreviewProps['rawSourcePos'];
  includeElementIndex: MarkdownPreviewProps['includeElementIndex'];
  linkTarget: MarkdownPreviewProps['linkTarget'];
  transformLinkUri: MarkdownPreviewProps['transformLinkUri'];
  transformImageUri: MarkdownPreviewProps['transformImageUri'];
}

const own = {}.hasOwnProperty;

// The table-related elements that must not contain whitespace text according
// to Vue.
const tableElements = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr']);
export function childrenToVue(node: Element | Root, options: Options) {
  const children: VNodeChild[] = [];
  let childIndex = -1;
  let child: Comment | DocType | Element | Text | Raw;

  while (++childIndex < node.children.length) {
    child = node.children[childIndex];
    if (child.type === 'element') {
      children.push(toVue(options, child, childIndex, node));
    } else if (child.type === 'text') {
      // Currently, a warning is triggered by react for *any* white space in
      // tables.
      // So we drop it.
      if (node.type !== 'element' || !tableElements.has(node.tagName) || !whitespace(child)) {
        children.push(child.value);
      }
    } else if (child.type === 'raw' && !options.skipHtml) {
      // Default behavior is to show (encoded) HTML.
      children.push(child.value);
    }
  }

  return children;
}

export function toVue(options: Options, node: Element, childIndex: number, parent: Element | Root): VNodeChild {
  const parentSchema = options.schema;
  // assume a known HTML/SVG element.
  const name = node.tagName;
  // const properties: Record<string, unknown> = {};
  const properties: Record<string, unknown> = {};
  let schema = parentSchema;
  let property: string;

  if (parentSchema.space === 'html' && name === 'svg') {
    schema = svg;
    options.schema = schema;
  }
  if (node.properties) {
    for (property in node.properties) {
      if (own.call(node.properties, property)) {
        addProperty(properties, property, node.properties[property], options);
      }
    }
  }

  if (name === 'ol' || name === 'ul') {
    options.listDepth++;
  }
  const children = childrenToVue(node, options);
  if (name === 'ol' || name === 'ul') {
    options.listDepth--;
  }
  // Restore parent schema.
  options.schema = parentSchema;

  // Nodes created by plugins do not have positional info, in which case we use
  // an object that matches the position interface.
  const position = node.position || {
    start: { line: null, column: null, offset: null },
    end: { line: null, column: null, offset: null },
  };

  const component = options.components && own.call(options.components, name) ? options.components[name] : name;
  // @ts-ignore
  const basic = typeof component === 'string' || component === Fragment;

  if (name === 'a' && options.linkTarget) {
    properties.target =
      typeof options.linkTarget === 'function'
        ? options.linkTarget(
            String(properties.href || ''),
            node.children,
            typeof properties.title === 'string' ? properties.title : null,
          )
        : options.linkTarget;
  }
  if (name === 'a' && options.transformLinkUri) {
    properties.href = options.transformLinkUri(
      String(properties.href || ''),
      node.children,
      typeof properties.title === 'string' ? properties.title : null,
    );
  }

  if (!basic && name === 'code' && parent.type === 'element' && parent.tagName !== 'pre') {
    properties.inline = true;
  }
  if (!basic && (name === 'h1' || name === 'h2' || name === 'h3' || name === 'h4' || name === 'h5' || name === 'h6')) {
    properties.level = Number.parseInt(name.charAt(1), 10);
  }
  if (name === 'img' && options.transformImageUri) {
    properties.src = options.transformImageUri(
      String(properties.src || ''),
      String(properties.alt || ''),
      typeof properties.title === 'string' ? properties.title : null,
    );
  }

  if (!basic && name === 'li' && parent.type === 'element') {
    const input = getInputElement(node);
    properties.checked = input && input.properties ? Boolean(input.properties.checked) : null;
    properties.index = getElementsBeforeCount(parent, node);
    properties.ordered = parent.tagName === 'ol';
  }

  if (!basic && (name === 'ol' || name === 'ul')) {
    properties.ordered = name === 'ol';
    properties.depth = options.listDepth;
  }

  if (name === 'td' || name === 'th') {
    if (properties.align) {
      if (!properties.style) properties.style = {};
      // @ts-expect-error assume `style` is an object
      properties.style.textAlign = properties.align;
      delete properties.align;
    }

    if (!basic) {
      properties.isHeader = name === 'th';
    }
  }

  if (!basic && name === 'tr' && parent.type === 'element') {
    properties.isHeader = Boolean(parent.tagName === 'thead');
  }
  // If `sourcePos` is given, pass source information (line/column info from markdown source).
  if (options.sourcePos) {
    properties['data-sourcepos'] = flattenPosition(position);
  }
  if (!basic && options.rawSourcePos) {
    properties.sourcePosition = node.position;
  }

  // If `includeElementIndex` is given, pass node index info to components.
  if (!basic && options.includeElementIndex) {
    properties.index = getElementsBeforeCount(parent, node);
    properties.siblingCount = getElementsBeforeCount(parent);
  }

  if (!basic) {
    properties.node = node;
  }
  if (typeof component === 'function') {
    const cnode: Properties | { node: Element } = { node, ...properties };
    const vnode = component(cnode);
    if (vnode && isVNode(vnode)) {
      return vnode;
    }
  }
  if (typeof component === 'string') {
    return children.length > 0 ? h(component, properties, children) : h(component, properties);
  }
  // return component()
  console.log(component);
}

function getInputElement(node: Element | Root): Element | null {
  let index = -1;

  while (++index < node.children.length) {
    const child = node.children[index];

    if (child.type === 'element' && child.tagName === 'input') {
      return child;
    }
  }

  return null;
}

function getElementsBeforeCount(parent: Element | Root, node?: Element): number {
  let index = -1;
  let count = 0;

  while (++index < parent.children.length) {
    if (parent.children[index] === node) break;
    if (parent.children[index].type === 'element') count++;
  }

  return count;
}

function flattenPosition(
  pos:
    | Position
    | { start: { line: null; column: null; offset: null }; end: { line: null; column: null; offset: null } },
) {
  return [pos.start.line, ':', pos.start.column, '-', pos.end.line, ':', pos.end.column].map((d) => String(d)).join('');
}

function parseStyle(value: string) {
  const result: Record<string, string> = {};

  try {
    style(value, iterator);
  } catch {
    // Silent.
  }

  return result;

  /**
   * @param {string} name
   * @param {string} v
   */
  function iterator(name: string, v: string) {
    const k = name.slice(0, 4) === '-ms-' ? `ms-${name.slice(4)}` : name;
    result[k.replace(/-([a-z])/g, styleReplacer)] = v;
  }
}

function styleReplacer(_: unknown, $1: string) {
  return $1.toUpperCase();
}

function addProperty(props: Record<string, unknown>, prop: string, value: unknown, ctx: Options) {
  const info = find(ctx.schema, prop);
  let result = value;
  // Ignore nullish and `NaN` values.
  // eslint-disable-next-line no-self-compare
  if (result === null || result === undefined || result !== result) {
    return;
  }
  // Accept `array`.
  // Most props are space-separated.
  if (Array.isArray(result)) {
    result = info.commaSeparated ? commas(result) : spaces(result);
  }

  if (info.property === 'style' && typeof result === 'string') {
    result = parseStyle(result);
  }
  // if (info.space && info.property) {
  //   props[
  //     own.call(hastToReact, info.property)
  //       ? (hastToReact as any)[info.property as any] as any
  //       : info.property
  //   ] = result
  // } else if (info.attribute) {
  //   props[info.attribute] = result
  // }
  if (info.attribute) {
    props[info.attribute] = result;
  }
}
