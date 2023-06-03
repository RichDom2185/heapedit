// import { Element } from "hast";
import React, { useCallback } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Options } from "rehype-react";

type Props = {
  children?: React.ReactNode;
  callback?(e: any): any;
  blurCallback?(e: any): any;
  node: any;
  isFocused: boolean;
};

type Test = React.ComponentProps<
  Required<Required<Options>["components"]>["b"]
>;

const Bold: React.FC<Props> = (props) => {
  const { children, callback, node, blurCallback, isFocused } = props;
  // const [isFocused, setIsFocused] = useState(false);

  // const handleFocus = () => {
  //   setIsFocused(() => true);
  // };

  // const handleBlur: React.FocusEventHandler = (e) => {
  //   setIsFocused(() => false);
  //   blurCallback && blurCallback(e.currentTarget);
  // };

  const handleChange = useCallback((e: ContentEditableEvent) => {
    const val = e.target.value;
    callback && callback({ val, node, e });
  }, []);

  return (
    <strong>
      {isFocused && "**"}
      <ContentEditable
        tagName="span"
        // onBlur={handleBlur}
        // onFocus={handleFocus}
        style={{ width: "max-content" }}
        html={String(children)}
        onChange={handleChange}
      />
      {isFocused && "**"}
    </strong>
  );
};

export default Bold;
