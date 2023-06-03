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
    selectAll("p, h1, h2, h3, h4, h5, h6", hast).forEach((node) => {
      node.properties = {
        ...node.properties,
        contentEditable: true,
        tabIndex: "-1",
        className: "section",
      };
    });
    selectAll("h1", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "# "), ...node.children];
    });
    selectAll("h2", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "## "), ...node.children];
    });
    selectAll("h3", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "### "), ...node.children];
    });
    selectAll("h4", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "#### "), ...node.children];
    });
    selectAll("h5", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "##### "), ...node.children];
    });
    selectAll("h6", hast).forEach((node) => {
      node.children = [h("span.token-prefix", "###### "), ...node.children];
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
            h1: createBlockComponent("h1", setText),
            h2: createBlockComponent("h2", setText),
            h3: createBlockComponent("h3", setText),
            h4: createBlockComponent("h4", setText),
            h5: createBlockComponent("h5", setText),
            h6: createBlockComponent("h6", setText),
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
