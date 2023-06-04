import React, { useCallback, useState } from "react";
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
    const [value, setValue] = useState("");

    const blurCallback: React.FocusEventHandler = useCallback(
      (e) => {
        handleMarkdownUpdate(
          value
            .split(new RegExp(`${lineSeparator}{2,}`))
            .map((s) => s.replaceAll(lineSeparator, "\n"))
        );
      },
      [value, handleMarkdownUpdate]
    );

    const overriddenProps: {
      onBlur: React.FocusEventHandler;
      onKeyDown: React.KeyboardEventHandler;
      onInput: React.FormEventHandler;
    } = {
      onBlur: blurCallback,
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          document.execCommand(
            "insertHTML",
            false,
            `<span class="token-newline">${lineSeparator}</span>`
          );
        }
      },
      onInput: (e) => {
        const value = (e.target as HTMLElement).textContent ?? "";
        setValue(value);
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
