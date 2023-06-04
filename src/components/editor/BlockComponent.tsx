import React from "react";
import {
  BlockComponent,
  blockComponentToOwnComponentMap,
} from "../../types/editor";

const lineSeparator = " ";

// Higher-order component builder
export const createBlockComponent = (
  htmlTagName: BlockComponent,
  handleMarkdownUpdate: (updatedValue: string[]) => void
) => {
  return (props: any) => {
    const { children, ...otherProps } = props;
    const overriddenProps: {
      onBlur: React.FocusEventHandler;
      onKeyDown: React.KeyboardEventHandler;
    } = {
      onBlur: (e) => {
        const value = e.target.textContent ?? "";
        handleMarkdownUpdate(
          value
            .split(new RegExp(`${lineSeparator}{2,}`))
            .map((s) => s.replaceAll(lineSeparator, "\n"))
        );
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          document.execCommand(
            "insertHTML",
            false,
            `<span class="token-newline">${lineSeparator}</span>`
          );
        }
      },
    };
    const Component = blockComponentToOwnComponentMap[htmlTagName];
    return React.cloneElement(
      <Component {...otherProps} suppressContentEditableWarning />,
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
