import { useState } from "react";
import { STATUS } from "./constants";

const array = (n, x = 0) => [...Array(n).keys()].map(() => x);

const emptyState = (n) => array(n).map(() => array(n));

function getRandomBombs(n, b) {
  const bucket = emptyState(n)
    .map((row, i) => row.map((_, j) => [i, j]))
    .flat();

  function getRandomFromBucket() {
    var randomIndex = Math.floor(Math.random() * bucket.length);
    return bucket.splice(randomIndex, 1)[0];
  }

  const chosen = [];
  for (let i = 0; i < b; i++) {
    chosen.push(getRandomFromBucket());
  }

  const bombs = emptyState(n);
  for (let index = 0; index < chosen.length; index++) {
    const [i, j] = chosen[index];
    bombs[i][j] = 1;
  }
  return bombs;
}

function getNeighbors(bombs, i, j) {
  const m = bombs.length;
  const n = bombs[0].length;
  const v = [-1, 0, 1];

  const neighbors = v
    .map((x) => v.map((y) => [i + x, j + y]))
    .flat()
    .filter(([x, y]) => {
      if (x === i && y === j) return false;
      if (x < 0 || x >= m || y < 0 || y >= n) return false;
      return true;
    });

  return neighbors;
}

function countBombs(bombs, neighbors) {
  let ans = 0;
  for (const [x, y] of neighbors) {
    if (bombs[x][y]) ans++;
  }
  return ans;
}

const getCells = (bombs) => {
  return bombs.map((row, i) =>
    row.map((_, j) => {
      const neighbors = getNeighbors(bombs, i, j);
      return {
        bombs: countBombs(bombs, neighbors),
        status: "hidden", // 'hidden' | 'flag' | 'revealed'
        hasBomb: !!bombs[i][j],
        neighbors,
      };
    })
  );
};

export function useGame(n = 10, b = 10) {
  const [cells, setCells] = useState(getCells(getRandomBombs(n, b)));

  const restart = () => {
    setCells(getCells(getRandomBombs(n, b)));
  };

  const bombCount = cells
    .flat()
    .filter(
      ({ hasBomb, status }) => status === STATUS.revealed && hasBomb
    ).length;

  const flagCount = cells
    .flat()
    .filter(({ status }) => status === STATUS.flag).length;

  const revealedCount = cells
    .flat()
    .filter(({ status }) => status === STATUS.revealed).length;

  const won = revealedCount + b === n * n;
  const lost = bombCount > 0;
  const over = won || lost;

  const setStatus = (i, j, status) => {
    setCells((cells) =>
      cells.map((row, x) =>
        row.map((cell, y) => {
          if (x === i && y === j) return { ...cell, status };
          return cell;
        })
      )
    );
  };

  const onClick = (row, col) => {
    if (over) return;
    const status = cells[row][col].status;
    if (status === STATUS.hidden)
      setCells((cells) => [...revealCell(cells, row, col)]);
  };

  const onContextMenu = (e, row, col) => {
    e.preventDefault();
    if (over) return;
    const status = cells[row][col].status;
    if (status !== STATUS.revealed)
      setStatus(row, col, status === STATUS.flag ? STATUS.hidden : STATUS.flag);
  };

  return {
    cells,
    onClick,
    onContextMenu,
    over,
    won,
    lost,
    flagCount: b - flagCount,
    restart,
  };
}

function revealCell(cells, row, col) {
  if (cells[row][col].status === STATUS.revealed) return cells;
  cells[row][col].status = STATUS.revealed;
  if (cells[row][col].hasBomb) return cells;
  if (cells[row][col].bombs !== 0) return cells;
  for (const [x, y] of cells[row][col].neighbors)
    cells = revealCell(cells, x, y);
  return cells;
}
