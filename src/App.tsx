import {
  AbsoluteCenter,
  Box,
  Card,
  Divider,
  Heading,
  ListItem,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Node as HastNode } from "hast";
import { selectAll } from "hast-util-select";
import { h } from "hastscript";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import React, { useCallback, useEffect, useState } from "react";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import "./App.css";
import { createBlockComponent } from "./components/editor/BlockComponent";
import { manipulateHast } from "./utils/parser";

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");

  const createReactNode = useCallback(
    (hast: HastNode) =>
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          Fragment: React.Fragment,
          components: {
            p: createBlockComponent("p", setText),
            h1: createBlockComponent("h1", setText),
            h2: createBlockComponent("h2", setText),
            h3: createBlockComponent("h3", setText),
            h4: createBlockComponent("h4", setText),
            h5: createBlockComponent("h5", setText),
            h6: createBlockComponent("h6", setText),
            ol: createBlockComponent("ol", setText),
            ul: createBlockComponent("ul", setText),
            li: ListItem,
          },
        })
        .stringify(hast as any),
    [setText]
  );

  useEffect(() => {
    const mdast = fromMarkdown(text);
    const hast = toHast(mdast) ?? h();

    selectAll("p, h1, h2, h3, h4, h5, h6, ol, ul", hast).forEach((node) => {
      node.properties = {
        ...node.properties,
        contentEditable: true,
        tabIndex: "-1",
        className: "section",
      };
    });
    manipulateHast(hast);
    setParsed(createReactNode(hast));
  }, [text]);

  return (
    <Box>
      <Stack gap={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div>{parsed}</div>
        </Card>

        <Box position="relative">
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            <Text as="i">Markdown below, content above</Text>
          </AbsoluteCenter>
        </Box>

        <Textarea
          value={text}
          height={500}
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
          placeholder="Enter markdown here"
        />
      </Stack>
    </Box>
  );
};

export default App;
