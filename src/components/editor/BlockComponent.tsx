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
    const isIdle = false;
    // const isIdle = useIdle(1000);
    const [canUpdate, setCanUpdate] = useState(false);

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
      if (isIdle && isFocused && canUpdate && value.includes(lineSeparator)) {
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
        setCanUpdate(e.key !== "Enter");
        if (e.key === "Enter") {
          document.execCommand(
            "insertHTML",
            false,
            `<span class="token-newline">${lineSeparator}</span>`
          );
        }
        if (e.key === "Escape") {
          blurCallback();
          // Force a blur even when there is no change in the content
          (e.target as HTMLElement).blur();
        }
      },
      onInput: (e) => {
        const value = (e.target as HTMLElement).textContent ?? "";
        setValue(value);
      },
    };
    const Component = blockComponentToOwnComponentMap[htmlTagName];
    return React.createElement(
      Component,
      {
        ...props,
        ...overriddenProps,
        suppressContentEditableWarning: true,
        // TODO: Suppress warning
        ref: ref, // targets "normal" elements
        innerRef: ref, // targets functional elements
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
  };
};
