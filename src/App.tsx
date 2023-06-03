import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import { selectAll } from "hast-util-select";
import { h } from "hastscript";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import React, { useEffect, useState } from "react";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import "./App.css";
import { createBlockComponent } from "./components/editor/BlockComponent";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");

  useEffect(() => {
    const mdast = fromMarkdown(text);
    const hast = toHast(mdast, {});
    selectAll("p", hast).forEach((node) => {
      node.properties = {
        ...node.properties,
        contentEditable: true,
        tabIndex: "-1",
        className: "section",
      };
    });
    selectAll("strong", hast).forEach((node) => {
      node.children = [
        h("span.token-prefix", "**"),
        ...node.children,
        h("span.token-suffix", "**"),
      ];
    });
    selectAll("em", hast).forEach((node) => {
      node.children = [
        h("span.token-prefix", "_"),
        ...node.children,
        h("span.token-suffix", "_"),
      ];
    });
    selectAll("code", hast).forEach((node) => {
      node.children = [
        h("span.token-prefix", "`"),
        ...node.children,
        h("span.token-suffix", "`"),
      ];
    });
    setParsed(
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          Fragment: React.Fragment,
          passNode: true,
          components: {
            p: createBlockComponent("p", setText),
          },
        })
        .stringify(hast as any)
    );
  }, [text]);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div>{parsed}</div>
        </Card>

        {/* FOR DEBUGGING PURPOSES */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
        />
      </SimpleGrid>
    </Box>
  );
};

export default App;
