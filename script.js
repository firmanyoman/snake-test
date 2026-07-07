const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

const size = 20;
const tiles = canvas.width / size;
const speed = 120;

let snake;
let food;
let direction;
let nextDirection;
let score;
let started;
let gameOver;

function reset() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  food = placeFood();
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  started = false;
  gameOver = false;
  scoreEl.textContent = score;
  messageEl.textContent = "Press any arrow key to start.";
  restartBtn.hidden = true;
  draw();
}

function placeFood() {
  while (true) {
    const next = {
      x: Math.floor(Math.random() * tiles),
      y: Math.floor(Math.random() * tiles),
    };
    if (!snake || snake.every((part) => part.x !== next.x || part.y !== next.y)) {
      return next;
    }
  }
}

function setDirection(x, y) {
  if (direction.x === -x && direction.y === -y) return;
  nextDirection = { x, y };
  if (!started) {
    started = true;
    messageEl.textContent = "";
  }
}

function tick() {
  if (gameOver || !started) return;

  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tiles ||
    head.y >= tiles ||
    snake.some((part) => part.x === head.x && part.y === head.y)
  ) {
    gameOver = true;
    messageEl.textContent = "Game over.";
    restartBtn.hidden = false;
    draw();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = score;
    food = placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
}

function draw() {
  ctx.fillStyle = "#161b22";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, "#ff7b72");
  snake.forEach((part, index) => drawCell(part.x, part.y, index ? "#3fb950" : "#7ee787"));
}

document.addEventListener("keydown", (event) => {
  const moves = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };

  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  setDirection(...move);
});

restartBtn.addEventListener("click", reset);

reset();
setInterval(tick, speed);
