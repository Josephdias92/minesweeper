
const canvas = document.querySelector('#canvas');

const ROWS = 8;
const COLS = 8;
const CELL_SIZE = 80;
const cells = [];

createBoard = () => {
  canvas.style.height = COLS * CELL_SIZE;
  canvas.style.width = ROWS * CELL_SIZE;
  for (let i = 0; i < ROWS; i++) {
    cells[i] = new Array(COLS).fill(0);
    for (let j = 0; j < COLS; j++) {
      const btn = document.createElement('button');
      btn.style.height = CELL_SIZE;
      btn.style.width = CELL_SIZE;
      btn.classList = ['btn'];
      btn.oncontextmenu = (e) => e.preventDefault();
      btn.onclick = (e) => {
        propogateCells(i, j);
      };
      cells[i][j] = { value: 0, el: btn, visited: false };
      canvas.appendChild(btn);
    }
  }
};
getKey = (key) => key.split('-').map(Number);

bounds = ([row, col]) => {
  if (row < 0 || col < 0) return false;
  if (row >= ROWS || col >= COLS) return false;
  return true;
};

getNeighbor = (i, j) => {
  return [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],

    [i, j - 1],
    [i, j + 1],

    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ].filter(bounds);
};

setNeighbour = (i, j) => {
  for (let [row, col] of getNeighbor(i, j)) {
    if (cells[row][col].value != '💣') {
      cells[row][col].value++;
    }
  }
};

setBomb = (bombs) => {
  for (let bomb of bombs) {
    const [i, j] = this.getKey(bomb);
    cells[i][j].value = '💣';
    setNeighbour(i, j);
  }
};

const generatorBombs = (size = ROWS) => {
  let bombs = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      bombs.push(`${i}-${j}`);
    }
  }
  bombs.sort(() => 0.5 - Math.random());
  return bombs.slice(0, size);
};

propogateCells = (i, j) => {
  const cell = cells[i][j];
  if (cell.visited) {
    return;
  }
  cell.visited = true;
  if (cell.value === '💣') {
    gameOver();
  }
  if (cell.value === 0) {
    for (let [row, col] of getNeighbor(i, j)) {
      propogateCells(row, col);
    }
  } else {
    cell.el.textContent = cell.value;
  }
  cell.el.disabled = true;
};

gameOver = () => {};
createBoard();
setBomb(generatorBombs());
