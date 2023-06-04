import { Heading, OrderedList, Text, UnorderedList } from "@chakra-ui/react";

// TODO: Support more
export type BlockComponent =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol";

export const blockComponentToOwnComponentMap = Object.freeze({
  p: Text,
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
  ol: OrderedList,
  ul: UnorderedList,
}) satisfies Readonly<{
  // FIXME: Type this properly
  [key in BlockComponent]: any;
}>;
