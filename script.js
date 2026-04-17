"use strict";

/* =============================================
   Configuration
   ============================================= */
const CONFIG = {
  gridColumns: 20,
  gridRows: 20,
  tickIntervalMs: 130,          // game speed (ms per move)
  maxHighScores: 10,            // leaderboard depth
  storageKey: "snakeHighScores",
  colors: {
    background: "#050505",
    gridLine: "#0d0d0d",
    snakeHead: "#00ff41",
    snakeBody: "#007a20",
    snakeOutline: "#003d10",
    food: "#ff3333",
    foodGlow: "rgba(255,51,51,0.35)",
  },
};

/* =============================================
   DOM references
   ============================================= */
const canvas        = document.getElementById("game-canvas");
const ctx           = canvas.getContext("2d");
const scoreEl       = document.getElementById("current-score");
const overlayEl     = document.getElementById("overlay");
const overlayTitle  = document.getElementById("overlay-title");
const overlayScore  = document.getElementById("overlay-score");
const restartBtn    = document.getElementById("restart-btn");
const highScoreList = document.getElementById("high-score-list");

/* =============================================
   Computed cell dimensions
   ============================================= */
const cellWidth  = canvas.width  / CONFIG.gridColumns;
const cellHeight = canvas.height / CONFIG.gridRows;

/* =============================================
   Direction constants
   ============================================= */
const Direction = Object.freeze({
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
});

const keyToDirection = {
  ArrowUp:    Direction.UP,
  ArrowDown:  Direction.DOWN,
  ArrowLeft:  Direction.LEFT,
  ArrowRight: Direction.RIGHT,
};

const opposites = new Map([
  [Direction.UP,    Direction.DOWN],
  [Direction.DOWN,  Direction.UP],
  [Direction.LEFT,  Direction.RIGHT],
  [Direction.RIGHT, Direction.LEFT],
]);

/* =============================================
   Game state
   ============================================= */
let snake        = [];       // array of {x, y} — head is index 0
let direction    = Direction.RIGHT;
let nextDirection = Direction.RIGHT;
let food         = null;     // {x, y}
let score        = 0;
let gameRunning  = false;
let gameLoopId   = null;

/* =============================================
   Utility helpers
   ============================================= */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cellsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function snakeOccupies(cell) {
  return snake.some(segment => cellsEqual(segment, cell));
}

/* =============================================
   Food placement
   ============================================= */
function placeFood() {
  let candidate;
  let attempts = 0;
  const totalCells = CONFIG.gridColumns * CONFIG.gridRows;

  // Protect against full board (extremely unlikely with a 20x20 grid)
  if (snake.length >= totalCells) return;

  do {
    candidate = {
      x: randomInt(0, CONFIG.gridColumns - 1),
      y: randomInt(0, CONFIG.gridRows - 1),
    };
    attempts++;
  } while (snakeOccupies(candidate) && attempts < totalCells * 2);

  food = candidate;
}

/* =============================================
   Game initialisation
   ============================================= */
function initGame() {
  // Start snake in the centre of the grid, 3 segments long, facing right
  const startX = Math.floor(CONFIG.gridColumns / 2);
  const startY = Math.floor(CONFIG.gridRows / 2);
  snake = [
    { x: startX,     y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  direction     = Direction.RIGHT;
  nextDirection = Direction.RIGHT;
  score         = 0;
  scoreEl.textContent = "0";

  placeFood();
  hideOverlay();

  gameRunning = true;

  if (gameLoopId) clearInterval(gameLoopId);
  gameLoopId = setInterval(tick, CONFIG.tickIntervalMs);

  render();
}

/* =============================================
   Core game tick
   ============================================= */
function tick() {
  if (!gameRunning) return;

  direction = nextDirection;

  const head    = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  // Wall collision
  if (
    newHead.x < 0 || newHead.x >= CONFIG.gridColumns ||
    newHead.y < 0 || newHead.y >= CONFIG.gridRows
  ) {
    endGame();
    return;
  }

  // Self collision (ignore the tail tip — it will move away)
  const bodyWithoutTail = snake.slice(0, snake.length - 1);
  if (bodyWithoutTail.some(seg => cellsEqual(seg, newHead))) {
    endGame();
    return;
  }

  // Move: prepend new head
  snake.unshift(newHead);

  // Check food
  if (food && cellsEqual(newHead, food)) {
    score++;
    scoreEl.textContent = score;
    placeFood();
    // Don't remove tail — snake grows by 1
  } else {
    snake.pop(); // remove tail tip
  }

  render();
}

/* =============================================
   Rendering
   ============================================= */
function render() {
  const { colors } = CONFIG;

  // Clear
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid lines
  ctx.strokeStyle = colors.gridLine;
  ctx.lineWidth = 0.5;
  for (let col = 1; col < CONFIG.gridColumns; col++) {
    ctx.beginPath();
    ctx.moveTo(col * cellWidth, 0);
    ctx.lineTo(col * cellWidth, canvas.height);
    ctx.stroke();
  }
  for (let row = 1; row < CONFIG.gridRows; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * cellHeight);
    ctx.lineTo(canvas.width, row * cellHeight);
    ctx.stroke();
  }

  // Food — solid block with glow
  if (food) {
    const fx = food.x * cellWidth;
    const fy = food.y * cellHeight;

    ctx.shadowColor  = colors.foodGlow;
    ctx.shadowBlur   = 10;
    ctx.fillStyle    = colors.food;
    ctx.fillRect(
      fx + 2,
      fy + 2,
      cellWidth  - 4,
      cellHeight - 4,
    );
    ctx.shadowBlur = 0;
  }

  // Snake segments
  snake.forEach((segment, index) => {
    const sx = segment.x * cellWidth;
    const sy = segment.y * cellHeight;
    const padding = 1;

    // Head is brighter
    ctx.fillStyle   = index === 0 ? colors.snakeHead : colors.snakeBody;
    ctx.strokeStyle = colors.snakeOutline;
    ctx.lineWidth   = 1;

    // Outer (filled) block
    ctx.fillRect(
      sx + padding,
      sy + padding,
      cellWidth  - padding * 2,
      cellHeight - padding * 2,
    );
    ctx.strokeRect(
      sx + padding,
      sy + padding,
      cellWidth  - padding * 2,
      cellHeight - padding * 2,
    );

    // Inner highlight for pixel depth
    if (index === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(
        sx + padding + 2,
        sy + padding + 2,
        cellWidth  - padding * 2 - 4,
        4,
      );
    }
  });
}

/* =============================================
   Game over
   ============================================= */
function endGame() {
  gameRunning = false;
  clearInterval(gameLoopId);
  gameLoopId = null;

  saveHighScore(score);
  renderLeaderboard();

  overlayTitle.textContent = "GAME OVER";
  overlayScore.textContent = score > 0
    ? `SCORE: ${score}`
    : "SCORE: 0";
  showOverlay();
}

/* =============================================
   Overlay helpers
   ============================================= */
function showOverlay() {
  overlayEl.classList.remove("hidden");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
}

/* =============================================
   High-score persistence
   ============================================= */
function loadHighScores() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveHighScore(newScore) {
  if (newScore === 0) return; // don't pollute leaderboard with zero-score runs

  const scores = loadHighScores();
  scores.push({ score: newScore, timestamp: Date.now() });

  // Keep only top N, sorted descending
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, CONFIG.maxHighScores);

  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors (private browsing, quota exceeded)
  }
}

function renderLeaderboard() {
  const scores = loadHighScores();
  highScoreList.innerHTML = "";

  if (scores.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet";
    empty.style.color = "#3a3a3a";
    empty.style.justifyContent = "center";
    highScoreList.appendChild(empty);
    return;
  }

  const rankClasses = ["gold", "silver", "bronze"];

  scores.forEach((entry, index) => {
    const li       = document.createElement("li");
    const rankSpan = document.createElement("span");
    const valSpan  = document.createElement("span");
    const dateSpan = document.createElement("span");

    rankSpan.classList.add("score-rank");
    if (index < 3) rankSpan.classList.add(rankClasses[index]);
    rankSpan.textContent = `#${index + 1}`;

    valSpan.classList.add("score-value");
    valSpan.textContent = entry.score;

    dateSpan.classList.add("score-date");
    dateSpan.textContent = formatDate(entry.timestamp);

    li.appendChild(rankSpan);
    li.appendChild(valSpan);
    li.appendChild(dateSpan);
    highScoreList.appendChild(li);
  });
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

/* =============================================
   Keyboard controls
   ============================================= */
window.addEventListener("keydown", function handleKey(event) {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  if (arrowKeys.includes(event.key)) {
    // Always prevent default to stop page scrolling
    event.preventDefault();

    if (!gameRunning) return;

    const requested = keyToDirection[event.key];
    if (!requested) return;

    // Prevent reversing direction into self
    if (opposites.get(direction) !== requested) {
      nextDirection = requested;
    }
  }
});

/* =============================================
   Restart button
   ============================================= */
restartBtn.addEventListener("click", initGame);

/* =============================================
   Start
   ============================================= */
renderLeaderboard(); // show stored scores before first game

// Show start overlay first
overlayTitle.textContent = "SNAKE";
overlayScore.textContent = "Press PLAY to start";
showOverlay();

// Draw an empty board so there's something to see behind the overlay
render();
