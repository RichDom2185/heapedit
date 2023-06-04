import {
  Box,
  Heading,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

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
  | "ol"
  | "pre";

export const blockComponentToOwnComponentMap = Object.freeze({
  p: Text,
  h1: (props: any) => (
    <Heading as="h1" size="xl" {...props} ref={props.innerRef} />
  ),
  h2: (props: any) => (
    <Heading as="h2" size="lg" {...props} ref={props.innerRef} />
  ),
  h3: (props: any) => (
    <Heading as="h3" size="md" {...props} ref={props.innerRef} />
  ),
  h4: (props: any) => (
    <Heading as="h4" size="sm" {...props} ref={props.innerRef} />
  ),
  h5: (props: any) => (
    <Heading as="h5" size="xs" {...props} ref={props.innerRef} />
  ),
  h6: (props: any) => (
    <Heading as="h6" size="xs" {...props} ref={props.innerRef} />
  ),
  ol: (props: any) => (
    <Text>
      <OrderedList {...props} ref={props.innerRef} />
    </Text>
  ),
  ul: (props: any) => (
    <Text>
      <UnorderedList {...props} ref={props.innerRef} />
    </Text>
  ),
  pre: (props: any) => <Box as="pre" {...props} ref={props.innerRef} />,
}) satisfies Readonly<{
  // FIXME: Type this properly
  [key in BlockComponent]: any;
}>;
