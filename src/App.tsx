import { Box, Card, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "./App.css";
import { parse } from "./utils/parser";

const text =
  "Hi there, this is a test for some **bold** text, as well as `code` and _italics_ located in this paragraph.";

const App: React.FC = () => {
  const [parsed, setParsed] = useState<React.ReactNode>(<>{text}</>);

  useEffect(() => {
    parse(text).then((parsedText) => {
      setParsed(parsedText.result);
    });
  }, [text]);

  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>

        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>{parsed}</Card>
      </SimpleGrid>
    </Box>
  );
};

export default App;
