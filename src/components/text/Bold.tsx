// import { Element } from "hast";
import React, { useCallback, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Options } from "rehype-react";

type Props = {
  children?: React.ReactNode;
  callback?(e: any): any;
  blurCallback?(e: any): any;
  node: any;
};

type Test = React.ComponentProps<
  Required<Required<Options>["components"]>["b"]
>;

const Bold: React.FC<Props> = (props) => {
  const { children, callback, node, blurCallback } = props;

  // const parser = unified()
  //   .use(remarkParse)
  //   .use(remarkRehype)
  //   .use(rehypeReact, {
  //     createElement: React.createElement,
  //     Fragment: React.Fragment,
  //     passNode: true,
  //     components: {
  //       strong: (props: any) =>
  //         React.createElement(
  //           Bold,
  //           {
  //             blurCallback: (e: EventTarget & Element) => {
  //               console.log(e.innerHTML);
  //             },
  //             callback: async (tokenRef) => {
  //               // console.log(ref.current?.innerHTML);
  //               console.log(tokenRef.current?.innerText);

  //               // const val = e.innerHTML;
  //               // console.log(val);
  //               // e.outerHTML = val;
  //               // e.blur();
  //               // await sleep(0);
  //               // // parse2(`**${val}**`).then((text) => {
  //               // //   e.outerHTML = String(text);
  //               // // })
  //               // e.innerText = val;
  //               // console.log(ref.current?.innerHTML);
  //               // parse3(ref.current?.innerHTML ?? "").then((text) => {
  //               // console.log(text);
  //               // setText(String(text));
  //               // e.focus();
  //               // });
  //               // console.log(node);
  //             },
  //             ...props,
  //           }
  //           // props.children
  //         ),
  //     },
  //   });

  // const parse = async (markdown: string) => await parser.process(markdown);

  // console.log(props);
  const text = useRef<React.ReactNode>(children);
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(() => true);
  };

  const handleBlur: React.FocusEventHandler = (e) => {
    setIsFocused(() => false);
    blurCallback && blurCallback(e.currentTarget);
  };

  const handleChange = useCallback((e: ContentEditableEvent) => {
    const val = e.target.value;
    text.current = val;
    // console.log(text.current);
    // node.children[0].value = e.target.value;
    // console.log(node.children[0].value);
    // console.log(e.currentTarget);
    // callback && callback(e.currentTarget);

    // callback && callback(ref);
    callback && callback(node);
  }, []);

  const [content, setContent] = useState("");

  // useEffect(() => {
  //   parse(`**${children}**`).then((tree) => {
  //     // console.log(tree);
  //     setContent(String(tree));
  //   });
  // }, []);

  return (
    <strong ref={ref}>
      {/* {isFocused && "**"} */}
      <ContentEditable
        tagName="span"
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ width: "max-content" }}
        html={String(children)}
        onChange={handleChange}
      />
      {/* {isFocused && "**"} */}
    </strong>
  );
};

export default Bold;
