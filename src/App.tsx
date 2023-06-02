import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { parse2, parse3 } from "./utils/parser";

import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import Bold from "./components/text/Bold";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");
  const [content, setContent] = useState("");

  useEffect(() => {
    parse(text).then((parsedText) => {
      setParsed(parsedText.result);
    });
    parse2(text).then((parsedText2) => {
      setContent(String(parsedText2));
    });
  }, [text]);

  const ref = useRef<HTMLDivElement>(null);
  console.log(ref.current?.innerHTML);

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
              callback: async (e: HTMLElement) => {
                // console.log(ref.current?.innerHTML);
                // console.log(e);

                const val = e.innerHTML;
                console.log(val);
                e.blur();
                await sleep(0);
                e.innerHTML = val;
                console.log(ref.current?.innerHTML);
                parse3(ref.current?.innerHTML ?? "").then((text) => {
                  console.log(text);
                  setText(String(text));
                  e.focus();
                });
              },
              ...props,
            }
            // props.children
          ),
      },
    });

  const parse = async (markdown: string) => await parser.process(markdown);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div ref={ref}>{parsed}</div>
        </Card>

        {/* <textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        /> */}
      </SimpleGrid>
    </Box>
  );
};

export default App;
