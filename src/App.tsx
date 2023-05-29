import { Box, Card, Code, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import FocusableSpan from "./components/FocusableSpan";

const text =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel sunt harum quia dignissimos assumenda voluptas eaque quo distinctio eos aliquid molestiae facilis nisi enim, deleniti rerum eius aliquam est reiciendis sed? Eligendi, nemo officia rerum ab nam provident repellat deleniti numquam enim modi impedit minima omnis id ut at ad facere? Earum, suscipit rem! Id, odio enim? Quasi quia nisi suscipit consequatur, vero unde quos est doloremque. Eveniet laborum laudantium officia. Iste fuga minima accusantium provident. Enim reprehenderit, laborum amet repudiandae distinctio, saepe repellendus adipisci porro temporibus nesciunt consequuntur error quidem eaque accusantium corrupti ullam libero, ea doloremque. Quasi, atque.";

const App: React.FC = () => {
  return (
    <Box>
      <SimpleGrid spacingY={4}>
        <Heading>heapedit</Heading>
        <Card sx={{ paddingBlock: 2, paddingInline: 3 }}>
          <Code as="pre">
            {text.split(". ").map((sentence) => (
              <>
                <FocusableSpan value={sentence} />
                <br />
              </>
            ))}
          </Code>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default App;
