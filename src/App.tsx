import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import { selectAll } from "hast-util-select";
import { h } from "hastscript";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import React, { useEffect, useState } from "react";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import "./App.css";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");

  // const testRef = useRef<any[]>([]);

  useEffect(() => {
    const mdast = fromMarkdown(text);
    // const mdastNodes: any[] = [];
    // visit(mdast, (node: any) => {
    //   if (node.value !== undefined) {
    //     // console.log(node);
    //     mdastNodes.push(node);
    //   }
    // });
    const hast = toHast(mdast, {});
    const hastNodes: any[] = [];
    visit(hast as any, (node) => {
      // console.log(node);
      // if (node.value !== undefined && node.value !== "\n") {
      hastNodes.push(node);
      // }
    });
    selectAll("p", hast).forEach((node) => {
      console.log(node);
      node.properties = {
        ...node.properties,
        contentEditable: true,
        tabIndex: "-1",
        className: "section",
      };
    });
    selectAll("strong", hast).forEach((node) => {
      console.log(node.children);
      node.children = [
        h("span.prefix", "**"),
        ...node.children,
        h("span.suffix", "**"),
      ];
    });
    // testRef.current = [];
    // len.current = 0;
    setParsed(
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          Fragment: React.Fragment,
          passNode: true,
          components: {
            p: (props: any) => {
              const { children, ...otherProps } = props;
              return React.cloneElement(
                <p {...otherProps} />,
                {
                  onBlur: (e: any) => {
                    setText(e.target.textContent);
                    console.log(e);
                  },
                },
                React.Children.map(children, (child, i) => {
                  const element =
                    typeof child === "string" || typeof child === "number" ? (
                      <span key={i}>{child}</span>
                    ) : (
                      child
                    );
                  return element;
                })
              );
            },
          },
        })
        .stringify(hast as any)
    );
  }, [text]);

  // const ref = useRef<HTMLDivElement>(null);
  // console.log(ref.current?.innerHTML);

  // console.log(testRef.current?.map((e) => e?.tagName === "SPAN"));

  // const [isFocused, setIsFocused] = useState(true);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          {/* <div ref={ref}>{parsed}</div> */}
          <div>{parsed}</div>
        </Card>

        {/* <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <button onClick={() => setIsFocused((prev) => !prev)}>
            {isFocused ? "true" : "false"}
          </button>
        </Card> */}

        {/* <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div ref={ref}>
            <Remark
              rehypeReactOptions={{
                components: {
                  p: (props: any) => {
                    const { children, ...otherProps } = props;
                    return React.cloneElement(
                      <p {...otherProps} className="akjsdhks" />,
                      {},
                      React.Children.map(children, (child) => {
                        const element =
                          typeof child === "string" ||
                          typeof child === "number" ? (
                            <span key={len.current}>{child}</span>
                          ) : (
                            child
                          );
                        len.current += 1;
                        const newElement = React.cloneElement(element as any, {
                          ref: (node: any) => {
                            if (testRef.current) {
                              testRef.current.push(node);
                            }
                          },
                          className: `token ${element.type}`,
                          // contentEditable: true,
                          onInput: (e) => {
                            console.log(element);
                            const el = e.target as HTMLElement;
                            console.log(el.outerHTML);
                            // const test =
                            //   testRef.current[Math.floor(element.key / 2)];
                            // console.log(test);
                          },
                          onFocus: (node: any) => {
                            console.log(node);
                          },
                          // dangerouslySetInnerHTML: {
                          //   __html: element.props?.children,
                          // },
                          // children: undefined,
                        });
                        return newElement;
                      })
                    );
                  },
                },
              }}
            >
              {text}
            </Remark>
          </div>
        </Card> */}

        {/* <textarea
          value={text}
          onChange={(e) => {
            testRef.current = [];
            setText(e.currentTarget.value);
          }}
        /> */}
      </SimpleGrid>
    </Box>
  );
};

export default App;
