import {
  Box,
  Card,
  Divider,
  Heading,
  ListItem,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Node as HastNode } from "hast";
import { selectAll } from "hast-util-select";
import { Root as MdastRoot } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import React, { useCallback, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import "./App.css";
import defaultText from "./assets/defaultText.md?raw";
import { createBlockComponent } from "./components/editor/BlockComponent";
import { generateHastFromMdast, manipulateHast } from "./utils/parser";

const blockComponents = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ol",
  "ul",
  "pre",
] as const;

const App: React.FC = () => {
  const [text, setText] = useState(defaultText);
  const [mdastNodes, setMdastNodes] = useState<MdastRoot[]>([]);
  const [hastNodes, setHastNodes] = useState<HastNode[]>([]);

  const createReactNode = useCallback(
    (hast: HastNode, index: number) => {
      const callback = (updatedText: string[]) => {
        setText(() => {
          const newNodes = mdastNodes.flatMap((node, i) =>
            i !== index ? [node] : updatedText.map((v) => fromMarkdown(v))
          );

          return newNodes
            .map((node) => unified().use(remarkStringify).stringify(node))
            .join("\n");
        });
      };
      return unified()
        .use(rehypeReact, {
          ...runtime,
          components: {
            ...Object.fromEntries(
              blockComponents.map((c) => [c, createBlockComponent(c, callback)])
            ),
            li: ListItem,
          },
          // Typecast needed due to custom components
        } as any)
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
        // TODO: Refactor
        const hast = generateHastFromMdast(mdast);
        selectAll(blockComponents.join(", "), hast).forEach((node) => {
          node.properties = {
            ...node.properties,
            contentEditable: true,
            tabIndex: 0,
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

        <Stack direction="row" gap={3}>
          <Textarea
            value={text}
            h={500}
            w="100%"
            onChange={(e) => setText(e.currentTarget.value)}
            placeholder="Enter markdown here"
          />

          <Box position="relative">
            <Divider orientation="vertical" />
          </Box>

          <Card sx={{ paddingBlock: 3, paddingInline: 2, w: "100%" }}>
            <Stack gap={2}>
              {hastNodes.map((node, i) => {
                const reactElement = createReactNode(node, i);
                return <React.Fragment key={i}>{reactElement}</React.Fragment>;
              })}
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};

export default App;
