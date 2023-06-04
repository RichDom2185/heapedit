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
          const selection = window.getSelection();
          const { anchorNode, anchorOffset = 0 } = selection ?? {};
          const tokenLength = anchorNode?.textContent?.length ?? 0;
          if (anchorOffset === 0 || anchorOffset === tokenLength) {
            alert(
              "I'm sorry, due to current limitations, you can't create new lines at the start/end of a paragraph 😔. Please add dummy letter, then split the paragraph, then (only after adding your actual text to both paragraphs) remove the dummy letters.\n\nThank you for understanding!"
            );
            e.preventDefault();
            return;
          }

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
      <Component {...props} suppressContentEditableWarning />,
      overriddenProps
    );
  };
};
