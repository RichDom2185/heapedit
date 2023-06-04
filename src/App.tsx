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
import { Root as MdastRoot } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import React, { useCallback, useEffect, useState } from "react";
import rehypeReact from "rehype-react";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import "./App.css";
import { createBlockComponent } from "./components/editor/BlockComponent";
import { manipulateHast } from "./utils/parser";

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [mdastNodes, setMdastNodes] = useState<MdastRoot[]>([]);
  const [hastNodes, setHastNodes] = useState<HastNode[]>([]);

  const createReactNode = useCallback(
    (hast: HastNode, index: number) => {
      const callback = (updatedText: string) => {
        setText(() => {
          const newNodes = mdastNodes.map((node, i) =>
            i !== index ? node : fromMarkdown(updatedText)
          );

          return newNodes
            .map((node) => unified().use(remarkStringify).stringify(node))
            .join("\n");
        });
      };
      return unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          Fragment: React.Fragment,
          components: {
            p: createBlockComponent("p", callback),
            h1: createBlockComponent("h1", callback),
            h2: createBlockComponent("h2", callback),
            h3: createBlockComponent("h3", callback),
            h4: createBlockComponent("h4", callback),
            h5: createBlockComponent("h5", callback),
            h6: createBlockComponent("h6", callback),
            ol: createBlockComponent("ol", callback),
            ul: createBlockComponent("ul", callback),
            li: ListItem,
          },
        })
        .stringify(hast as any);
    },
    [text, mdastNodes]
  );

  useEffect(() => {
    const mdast = fromMarkdown(text);
    // Create an AST for each top-level element
    const topLevelElements: MdastRoot[] = [];
    visit(mdast, (node) => {
      if (node.type === "root") {
        node.children.forEach((child) => {
          topLevelElements.push({ ...node, children: [child] });
        });
      }
    });
    setMdastNodes(topLevelElements);

    setHastNodes(
      topLevelElements.map((mdast) => {
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
        return hast;
      })
    );
  }, [text]);

  return (
    <Box>
      <Stack gap={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div>{hastNodes.map(createReactNode)}</div>
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
