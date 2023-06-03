import { Element, ElementContent } from "hast";
import { h } from "hastscript";

export const decorateInlineComponent = (
  node: Element,
  prefix?: string,
  suffix?: string
) => {
  const newChildren: ElementContent[] = [];
  if (prefix) {
    newChildren.push(h("span.token-prefix", prefix));
  }
  newChildren.push(...node.children);
  if (suffix) {
    newChildren.push(h("span.token-suffix", suffix));
  }
  node.children = newChildren;
};
