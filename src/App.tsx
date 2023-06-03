import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import React, { useEffect, useRef, useState } from "react";
import { Remark } from "react-remark";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import "./App.css";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App: React.FC = () => {
  const [text, setText] = useState(
    "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph." +
      "\n\n\n" +
      "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph."
  );
  const [parsed, setParsed] = useState<React.ReactNode>("");

  const testRef = useRef<any[]>([]);

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
                <p {...otherProps} className="akjsdhks" />,
                {},
                React.Children.map(children, (child, i) => {
                  // if (typeof child === "string" || typeof child === "number") {
                  //   return <span key={i}>{child}</span>;
                  // }
                  // const newElement = React.cloneElement(child as any, {
                  //   ref: (node: any) => {
                  //     if (testRef.current) {
                  //       testRef.current[i] = node;
                  //     }
                  //   },
                  // });
                  // console.log(newElement);
                  // return newElement;

                  const element =
                    typeof child === "string" || typeof child === "number" ? (
                      <span key={i}>{child}</span>
                    ) : (
                      child
                    );
                  const newElement = React.cloneElement(element as any, {
                    ref: (node: any) => {
                      if (testRef.current) {
                        testRef.current.push(node);
                      }
                    },
                  });
                  return newElement;
                })
              );
            },
            // strong: (props: any) =>
            //   React.createElement(Bold, {
            //     ...props,
            //     callback: ({ val, node, e }) => {
            //       console.log(e.target.outerHTML);
            //       // const index = hastNodes.findIndex((n) => n === node);
            //       visitParents(hast as any, node, (node, ancestors) => {
            //         const immediateParent = ancestors[ancestors.length - 1];
            //         console.log(node.type, immediateParent);
            //       });
            //       // console.log(index);
            //       // // console.log(hastNodes);
            //       // console.log(mdastNodes[index]);
            //     },
            //   }),
          },
        })
        .stringify(hast as any)
    );
  }, [text]);

  const ref = useRef<HTMLDivElement>(null);
  // console.log(ref.current?.innerHTML);

  console.log(testRef.current?.map((e) => e?.tagName === "SPAN"));

  const [isFocused, setIsFocused] = useState(true);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div ref={ref}>{parsed}</div>
        </Card>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <button onClick={() => setIsFocused((prev) => !prev)}>
            {isFocused ? "true" : "false"}
          </button>
        </Card>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <div ref={ref}>
            <Remark
              rehypeReactOptions={{
                passNode: true,
                components: {
                  p: (props: any) => {
                    const { children, ...otherProps } = props;
                    return React.cloneElement(
                      <p {...otherProps} className="akjsdhks" />,
                      {},
                      React.Children.map(children, (child, i) => {
                        const element =
                          typeof child === "string" ||
                          typeof child === "number" ? (
                            <span key={i}>{child}</span>
                          ) : (
                            child
                          );
                        const newElement = React.cloneElement(element as any, {
                          ref: (node: any) => {
                            if (testRef.current) {
                              testRef.current.push(node);
                            }
                          },
                          contentEditable: true,
                          onInput: (e) => {
                            console.log(e);
                            const el = e.target as HTMLElement;
                            console.log(el.innerHTML);
                            console.log(i);
                            console.log(testRef.current.map((e) => e.ref));
                            // console.log(element);
                            const ind = testRef.current?.findIndex(
                              (n) => n === element
                            );
                            console.log(ind);
                          },
                          onFocus: (node: any) => {
                            console.log(node);
                          },
                          dangerouslySetInnerHTML: {
                            __html: element.props?.children,
                          },
                          children: undefined,
                        });
                        return newElement;
                      })
                    );
                  },
                  // strong: (props: any) =>
                  //   React.createElement(Bold, {
                  //     ...props,
                  //     isFocused,
                  //     callback: ({ val, node, e }) => {
                  //       console.log(ref.current?.innerText);
                  //     },
                  //   }),
                  // em: (props: any) =>
                  //   React.createElement(Italic, {
                  //     ...props,
                  //     isFocused,
                  //     callback: ({ val, node, e }) => {
                  //       console.log(ref.current?.innerText);
                  //     },
                  //   }),
                },
              }}
            >
              {text}
            </Remark>
          </div>
        </Card>

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
