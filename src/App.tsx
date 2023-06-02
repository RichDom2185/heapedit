import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { parse3 } from "./utils/parser";

import { Root as HastRoot } from "hast";
import { Root as MdastRoot } from "mdast";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import Bold from "./components/text/Bold";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");
  const [content, setContent] = useState("");

  useEffect(() => {
    parse2(text).then((parsedText) => {
      // setParsed(String(parsedText));
      parse(String(parsedText)).then((parsedText) => {
        setParsed(parsedText.result);
      });
    });
  }, [text]);

  const ref = useRef<HTMLDivElement>(null);
  // console.log(ref.current?.innerHTML);

  let i = 0;
  const nodes: any[] = [];
  const nodes2: any[] = [];
  const logger = () => (tree: HastRoot) => {
    visit(tree, (node: any) => {
      if (node.type === "text") {
        node.id = i++;
        // console.log(node);
        nodes.push(node);
      }
    });
  };

  const parser = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(logger)
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      passNode: true,
      components: {
        strong: (props: any) =>
          React.createElement(
            Bold,
            {
              blurCallback: (e: EventTarget & Element) => {
                console.log(e.innerHTML);
              },
              callback: async (node) => {
                // console.log(ref.current?.innerHTML);
                // console.log(tokenRef.current?.innerText);
                // const offset = node.position.start.offset;
                const id = node.id;
                // console.log(id);
                console.log(nodes.length);
                console.log(nodes2.length);
                console.log(nodes);
                console.log(nodes2);

                // const val = e.innerHTML;
                // console.log(val);
                // e.outerHTML = val;
                // e.blur();
                // await sleep(0);
                // // parse2(`**${val}**`).then((text) => {
                // //   e.outerHTML = String(text);
                // // })
                // e.innerText = val;
                // console.log(ref.current?.innerHTML);
                parse3(ref.current?.innerHTML ?? "").then((text) => {
                  // console.log(text);
                  // setText(String(text));
                  // e.focus();
                });
                // console.log(node);
              },
              ...props,
            }
            // props.children
          ),
      },
    });
  const parse = async (markdown: string) => await parser.process(markdown);

  const logger2 = () => (tree: MdastRoot) => {
    visit(tree, (node) => {
      if ((node.type === "text") | (node.type === "inlineCode")) {
        // node.id = i++;
        // console.log(node);
        // console.log(node.type);
        nodes2.push(node);
      }
    });
  };

  const parser2 = unified().use(remarkParse).use(logger2).use(remarkStringify);

  const parse2 = async (markdown: string) => await parser2.process(markdown);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div ref={ref}>{parsed}</div>
        </Card>

        <textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </SimpleGrid>
    </Box>
  );
};

export default App;
