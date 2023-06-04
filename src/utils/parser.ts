import { selectAll } from "hast-util-select";
import { Child, h } from "hastscript";
import { defaultHandlers, toHast } from "mdast-util-to-hast";
import {
  HastNodes,
  MdastRoot,
  Options as MdastToHastConverterOptions,
} from "mdast-util-to-hast/lib";
import { affixChildren } from "./editor";

const handlers: MdastToHastConverterOptions["handlers"] = {
  // Wrap all text nodes with their own span element
  text: (state, node) => {
    return h("span", defaultHandlers.text(state, node));
  },
};

export const generateHastFromMdast = (mdast: MdastRoot): HastNodes => {
  return toHast(mdast, { handlers }) ?? h();
};

const targets = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "code",
] as const;

type Prefix = string | Child;
type Suffix = string | Child;
const affixes = Object.freeze({
  h1: ["# "],
  h2: ["## "],
  h3: ["### "],
  h4: ["#### "],
  h5: ["##### "],
  h6: ["###### "],
  strong: ["**", "**"],
  em: ["_", "_"],
  code: ["`", "`"],
}) satisfies {
  readonly [key in (typeof targets)[number]]: readonly [Prefix?, Suffix?];
};

export const manipulateHast = (hast: HastNodes) => {
  targets.forEach((target) =>
    selectAll(target, hast).forEach((node) =>
      affixChildren(node, ...affixes[target])
    )
  );
  selectAll("ol li", hast).forEach((node) =>
    affixChildren(node, [h("span.token-invisible", " "), "1. "])
  );
  selectAll("ul li", hast).forEach((node) =>
    affixChildren(node, [h("span.token-invisible", " "), "* "])
  );
};
