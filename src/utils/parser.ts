import { Root } from "mdast";
import React from "react";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import Bold from "../components/text/Bold";

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
    passNode: true,
    components: {
      strong: (props: any) =>
        React.createElement(
          Bold,
          {
            callback: (v) => {
              // console.log(v);
            },
            ...props,
          }
          // props.children
        ),
    },
  });

const parser2 = unified()
  .use(remarkParse)
  .use(remarkRehype)
  // .use(logger)
  .use(rehypeStringify);

const parser3 = unified()
  .use(rehypeParse)
  .use(rehypeRemark)
  .use(remarkStringify);

export const parse = async (markdown: string) => await parser.process(markdown);
export const parse3 = async (markdown: string) =>
  await parser3.process(markdown);

export const parse2 = async (markdown: string) =>
  await parser2.process(markdown);
