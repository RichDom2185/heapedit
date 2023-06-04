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
  h1: (props: any) => <Heading as="h1" size="xl" {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" {...props} />,
  h4: (props: any) => <Heading as="h4" size="sm" {...props} />,
  h5: (props: any) => <Heading as="h5" size="xs" {...props} />,
  h6: (props: any) => <Heading as="h6" size="xs" {...props} />,
  ol: (props: any) => (
    <Text>
      <OrderedList {...props} />
    </Text>
  ),
  ul: (props: any) => (
    <Text>
      <UnorderedList {...props} />
    </Text>
  ),
}) satisfies Readonly<{
  // FIXME: Type this properly
  [key in BlockComponent]: any;
}>;
