import { Root } from "mdast";
import React from "react";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const logger = () => (tree: Root) => {
  visit(tree, (node) => {
    console.log(node);
  });
};

const parser = unified()
  .use(remarkParse)
  .use(remarkRehype)
  // .use(logger)
  .use(rehypeReact, {
    createElement: React.createElement,
    Fragment: React.Fragment,
  });

export const parse = async (markdown: string) => await parser.process(markdown);
