import { useIdle } from "@mantine/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const [isFocused, setIsFocused] = useState(false);
    const isIdle = useIdle(1000);

    // Get the initial value from the DOM
    const [value, setValue] = useState("");
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
      if (ref.current) {
        const text = ref.current.textContent ?? "";
        setValue(text);
      }
    }, []);

    const blurCallback = useCallback(() => {
      handleMarkdownUpdate(
        value
          .split(new RegExp(`${lineSeparator}{2,}`))
          .map((s) => s.replaceAll(lineSeparator, "\n"))
      );
    }, [value, handleMarkdownUpdate]);

    useEffect(() => {
      if (isIdle && isFocused) {
        blurCallback();
      }
    }, [isIdle, isFocused, blurCallback]);

    const overriddenProps: {
      onBlur: React.FocusEventHandler;
      onFocus: React.FocusEventHandler;
      onKeyDown: React.KeyboardEventHandler;
      onInput: React.FormEventHandler;
    } = {
      onBlur: () => {
        setIsFocused(false);
        blurCallback();
      },
      onFocus: () => setIsFocused(true),
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
      <Component ref={ref} {...otherProps} suppressContentEditableWarning />,
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
