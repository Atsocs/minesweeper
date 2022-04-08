import {
  Button,
  Center,
  HStack,
  SimpleGrid,
  Square,
  Text,
  useEventListener,
  VStack,
} from "@chakra-ui/react";
import { useGame } from "./useGame";
import { STATUS, colors } from "./constants";
import Icon from "@mdi/react";
import { mdiBomb, mdiFlag } from "@mdi/js";
import handler from "./handler";

export default function App() {
  const game = useGame();
  useEventListener("keydown", (e) => handler(e, game));
  return <Board {...game} />;
}

function Board({
  cells,
  onClick,
  onContextMenu,
  over,
  won,
  flagCount,
  restart,
}) {
  const bg = (i, j, revealed) =>
    (!revealed ? colors : colors.revealed)[(i + j) % 2];

  const Head = (
    <Center
      w="50vmin"
      h={16}
      bg={colors.head}
      color={colors.text.head}
      fontSize="xl"
    >
      <HStack>
        <Square size={12}>
          <Flag />
        </Square>
        <Text>{flagCount}</Text>
      </HStack>
    </Center>
  );

  const overType = won ? "won" : "lost";

  const Over = (
    <Square
      as={VStack}
      position="absolute"
      bottom={"5vmin"}
      size="40vmin"
      bg={colors.over[overType]}
      borderRadius="full"
      zIndex={1}
    >
      <Text fontSize="5xl">You {overType}.</Text>
      <Button onClick={restart}>Play Again</Button>
    </Square>
  );
  return (
    <Center as={VStack} spacing={0} fontFamily="serif" position="relative">
      {Head}
      {over && Over}
      <SimpleGrid
        as={Square}
        columns={cells[0].length}
        size={"50vmin"}
        gap={0}
        autoRows="1fr"
        opacity={over ? 0.5 : undefined}
      >
        {cells.map((row, i) =>
          row.map((cell, j) => {
            return (
              <Center
                h="100%"
                onClick={() => onClick(i, j)}
                onContextMenu={(e) => onContextMenu(e, i, j)}
                cursor={
                  !over
                    ? cell.status === STATUS.hidden
                      ? "pointer"
                      : "default"
                    : "default"
                }
                key={[i, j]}
              >
                <Cell
                  bg={bg(i, j, cell.status === STATUS.revealed)}
                  {...cell}
                  over={over}
                />
              </Center>
            );
          })
        )}
      </SimpleGrid>
    </Center>
  );
}

function Cell({ bg, bombs, status, hasBomb, over }) {
  const isShowingBomb = status === STATUS.revealed && hasBomb;
  const isShowingFlag = status === STATUS.flag;
  return (
    <Center
      w="100%"
      h="100%"
      bg={!isShowingBomb ? bg : "red"}
      _hover={{
        bg: !over && status !== STATUS.revealed ? colors.hover : undefined,
      }}
    >
      <Text fontSize="xl" fontWeight="bold" color={colors.text[bombs]}>
        {status === STATUS.revealed && !hasBomb && bombs !== 0 && bombs}
      </Text>
      {isShowingBomb && <Bomb />}
      {isShowingFlag && <Flag />}
    </Center>
  );
}

function Bomb() {
  return <Icon path={mdiBomb} color={colors.bomb} />;
}

function Flag() {
  return <Icon path={mdiFlag} color={colors.flag} />;
}
