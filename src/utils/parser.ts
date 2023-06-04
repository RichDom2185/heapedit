import { selectAll } from "hast-util-select";
import { h } from "hastscript";
import { defaultHandlers, toHast } from "mdast-util-to-hast";
import {
  HastNodes,
  MdastRoot,
  Options as MdastToHastConverterOptions,
} from "mdast-util-to-hast/lib";
import { decorateInlineComponent } from "./editor";

const handlers: MdastToHastConverterOptions["handlers"] = {
  // Wrap all text nodes with their own span element
  text: (state, node) => {
    return h("span", defaultHandlers.text(state, node));
  },
};

export const generateHastFromMdast = (mdast: MdastRoot): HastNodes => {
  return toHast(mdast, { handlers }) ?? h();
};

export const manipulateHast = (hast: HastNodes) => {
  selectAll("h1", hast).forEach((node) => decorateInlineComponent(node, "# "));
  selectAll("h2", hast).forEach((node) => decorateInlineComponent(node, "## "));
  selectAll("h3", hast).forEach((node) =>
    decorateInlineComponent(node, "### ")
  );
  selectAll("h4", hast).forEach((node) =>
    decorateInlineComponent(node, "#### ")
  );
  selectAll("h5", hast).forEach((node) =>
    decorateInlineComponent(node, "##### ")
  );
  selectAll("h6", hast).forEach((node) =>
    decorateInlineComponent(node, "###### ")
  );
  selectAll("strong", hast).forEach((node) =>
    decorateInlineComponent(node, "**", "**")
  );
  selectAll("em", hast).forEach((node) =>
    decorateInlineComponent(node, "_", "_")
  );
  selectAll("code", hast).forEach((node) =>
    decorateInlineComponent(node, "`", "`")
  );
  selectAll("ol li", hast).forEach((node) =>
    decorateInlineComponent(node, [h("span.token-invisible", " "), "1. "])
  );
  selectAll("ul li", hast).forEach((node) =>
    decorateInlineComponent(node, [h("span.token-invisible", " "), "* "])
  );
};
