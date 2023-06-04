import { Element, ElementContent } from "hast";
import { Child, h } from "hastscript";

export const affixChildren = (
  node: Element,
  prefix?: Child,
  suffix?: Child
) => {
  const newChildren: ElementContent[] = [];
  // We match both null and undefined
  if (prefix != null) {
    newChildren.push(h("span.token-prefix", prefix));
  }
  newChildren.push(...node.children);
  if (suffix != null) {
    newChildren.push(h("span.token-suffix", suffix));
  }
  node.children = newChildren;
};
