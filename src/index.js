import { render } from "react-dom";
import { Center, ChakraProvider, CSSReset } from "@chakra-ui/react";
import App from "./App";
const root = document.getElementById("root");
render(
  <ChakraProvider>
    <CSSReset />
    <Center h="100vh">
      <App />
    </Center>
  </ChakraProvider>,
  root
);
