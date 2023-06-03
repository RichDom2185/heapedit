import React from "react";

// Higher-order component builder
export const createBlockComponent = (
  htmlTagName: string,
  handleMarkdownUpdate: React.Dispatch<React.SetStateAction<string>>
) => {
  return (props: any) => {
    const { children, ...otherProps } = props;
    const overriddenProps: {
      onBlur: React.FocusEventHandler<HTMLParagraphElement>;
    } = {
      onBlur: (e) => {
        handleMarkdownUpdate(e.target.textContent ?? "");
      },
    };
    const Tag = htmlTagName;
    return React.cloneElement(
      <Tag {...otherProps} suppressContentEditableWarning />,
      overriddenProps,
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
  };
};
