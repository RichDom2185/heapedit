// TODO: Support more
export type BlockComponent = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const blockComponentToOwnComponentMap = Object.freeze({
  p: "p",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
}) satisfies Readonly<{
  // FIXME: Type this properly
  [key in BlockComponent]: any;
}>;
