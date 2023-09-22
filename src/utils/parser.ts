import { selectAll } from "hast-util-select";
import { Child, h } from "hastscript";
import { defaultHandlers, toHast } from "mdast-util-to-hast";
import {
  HastNodes,
  MdastNodes,
  Options as MdastToHastConverterOptions,
} from "mdast-util-to-hast/lib";
import { affixChildren } from "./editor";

const handlers: MdastToHastConverterOptions["handlers"] = {
  // Wrap all code#text with their own span element
  inlineCode: (state, node) => {
    const element = defaultHandlers.inlineCode(state, node);
    element.children = element.children.map((child) =>
      child.type === "text" ? h("span", child) : child
    );
    return element;
  },
  // Wrap all text nodes with their own span element
  text: (state, node) => {
    return h("span", defaultHandlers.text(state, node));
  },
};

export const generateHastFromMdast = (mdast: MdastNodes): HastNodes => {
  return toHast(mdast, { handlers }) ?? h();
};

/** Tokens to be affixed with either a prefix or suffix. */
const targets = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "*:not(pre) code",
  "ol li",
  "ul li",
] as const;

type Prefix = string | Child;
type Suffix = string | Child;
/** The prefix or suffix to be affixed to the tokens. */
const affixes = Object.freeze({
  h1: ["# "] as const,
  h2: ["## "] as const,
  h3: ["### "] as const,
  h4: ["#### "] as const,
  h5: ["##### "] as const,
  h6: ["###### "] as const,
  strong: ["**", "**"] as const,
  em: ["_", "_"] as const,
  "*:not(pre) code": ["`", "`"] as const,
  "ol li": ["1. "] as const,
  "ul li": ["* "] as const,
}) satisfies {
  readonly [key in (typeof targets)[number]]: readonly [Prefix?, Suffix?];
};

export const manipulateHast = (hast: HastNodes) => {
  targets.forEach((target) =>
    selectAll(target, hast).forEach((node) =>
      affixChildren(node, ...affixes[target])
    )
  );
};
