export default function handler(event, game) {
  switch (event.type) {
    case "keydown":
      switch (event.key) {
        case "r":
        case "R":
          game.restart();
          break;
        default:
      }
      break;
    default:
  }
}
