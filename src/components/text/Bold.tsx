// import { Element } from "hast";
import React, { useCallback, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Options } from "rehype-react";

type Props = {
  children?: React.ReactNode;
  callback?(e: any): any;
  node: any;
};

type Test = React.ComponentProps<
  Required<Required<Options>["components"]>["b"]
>;

const Bold: React.FC<Props> = (props) => {
  const { children, callback, node } = props;
  // console.log(props);
  const text = useRef<React.ReactNode>(children);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(() => true);
  };

  const handleBlur = () => {
    setIsFocused(() => false);
  };

  const handleChange = useCallback((e: ContentEditableEvent) => {
    text.current = e.target.value;
    // console.log(text.current);
    // node.children[0].value = e.target.value;
    // console.log(node.children[0].value);
    // console.log(e.currentTarget);
    // callback && callback(e.currentTarget);

    callback && callback(e.currentTarget);
  }, []);

  return (
    <>
      {isFocused && "**"}
      <ContentEditable
        tagName="strong"
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ width: "max-content" }}
        html={String(children)}
        onChange={handleChange}
      />
      {isFocused && "**"}
    </>
  );
};

export default Bold;
