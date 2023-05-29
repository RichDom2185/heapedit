import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

type Props = {
  value: string;
};

const FocusableSpan: React.FC<Props> = ({ value }) => {
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  // if (document.activeElement === ref.current) {
  //   console.log(`Active element: ${value}`);
  // }

  console.log(ref.current);

  const handleFocus = () => {
    setIsFocused(() => true);
  };

  const handleBlur = () => {
    setIsFocused(() => false);
  };

  const process = (rawText: string) => {
    return rawText.replace(/^\*\*(.*)\*\*$/, "$1");
  };

  const spanText = isFocused ? `**${text}**` : text;

  return (
    <>
      <ContentEditable
        tabIndex={-1}
        onFocus={handleFocus}
        onBlur={handleBlur}
        innerRef={ref}
        html={spanText}
        onChange={(e) => setText(process(e.target.value))}
        tagName="span"
      />
    </>
  );
};

export default FocusableSpan;
