/* pong.js
   Jogo Pong simples com dois modos:
   - single: jogador usa ArrowUp/ArrowDown (paddle esquerda); CPU direita
   - multi: jogador esquerdo usa W/S; jogador direito usa ArrowUp/ArrowDown
*/

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const modeSelect = document.getElementById('modeSelect');
const scoreLeftEl = document.getElementById('scoreLeft');
const scoreRightEl = document.getElementById('scoreRight');

let cw = canvas.width;
let ch = canvas.height;

/* --- Game state --- */
let state = {
  running: false,
  mode: 'single', // 'single' or 'multi'
  leftScore: 0,
  rightScore: 0
};

/* paddles */
const paddle = {
  width: 14,
  height: 110,
  speed: 7
};

let leftPaddle = {
  x: 18,
  y: (ch - paddle.height) / 2,
  dy: 0
};

let rightPaddle = {
  x: cw - 18 - paddle.width,
  y: (ch - paddle.height) / 2,
  dy: 0
};

/* ball */
let ball = {
  x: cw / 2,
  y: ch / 2,
  radius: 9,
  speed: 6,
  velX: 6,
  velY: 0
};

function resetPositions() {
  cw = canvas.width = parseInt(canvas.getAttribute('width'));
  ch = canvas.height = parseInt(canvas.getAttribute('height'));

  leftPaddle.y = (ch - paddle.height) / 2;
  rightPaddle.y = (ch - paddle.height) / 2;

  ball.x = cw / 2;
  ball.y = ch / 2;
  ball.speed = 6;
  // random initial direction
  ball.velX = Math.random() > 0.5 ? ball.speed : -ball.speed;
  ball.velY = (Math.random() * 2 - 1) * 3;
}

/* draw helpers */
function drawRect(x, y, w, h, radius=0) {
  if (!radius) {
    ctx.fillRect(x, y, w, h);
    return;
  }
  // rounded rect
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawCircle(x,y,r){
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}

/* game loop */
let lastTime = 0;
function loop(ts){
  if(!state.running) return;
  const dt = ts - lastTime;
  lastTime = ts;
  update(dt/16.666); // normalize by approx 60fps
  render();
  requestAnimationFrame(loop);
}

/* update game logic */
function update(delta){
  // move paddles
  leftPaddle.y += leftPaddle.dy * paddle.speed * delta;
  rightPaddle.y += rightPaddle.dy * paddle.speed * delta;

  // constrain paddles
  leftPaddle.y = Math.max(0, Math.min(ch - paddle.height, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(ch - paddle.height, rightPaddle.y));

  // AI for singleplayer (moves right paddle to meet ball)
  if (state.mode === 'single') {
    const targetY = ball.y - paddle.height/2;
    // simple easing to make it beatable
    const diff = targetY - rightPaddle.y;
    rightPaddle.y += diff * 0.08 * delta;
    // clamp
    rightPaddle.y = Math.max(0, Math.min(ch - paddle.height, rightPaddle.y));
  }

  // move ball
  ball.x += ball.velX * delta;
  ball.y += ball.velY * delta;

  // top/bottom collision
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.velY = -ball.velY;
  } else if (ball.y + ball.radius > ch) {
    ball.y = ch - ball.radius;
    ball.velY = -ball.velY;
  }

  // Left paddle collision
  if (ball.x - ball.radius < leftPaddle.x + paddle.width) {
    if (ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddle.height) {
      ball.x = leftPaddle.x + paddle.width + ball.radius; // avoid sticking
      const collidePoint = (ball.y - (leftPaddle.y + paddle.height/2));
      const normalized = collidePoint / (paddle.height/2);
      const angle = normalized * (Math.PI/3); // max 60 degrees
      const direction = 1; // to the right
      ball.velX = direction * ball.speed * Math.cos(angle);
      ball.velY = ball.speed * Math.sin(angle);
      ball.speed *= 1.03; // slight speed up
    }
  }

  // Right paddle collision
  if (ball.x + ball.radius > rightPaddle.x) {
    if (ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddle.height) {
      ball.x = rightPaddle.x - ball.radius;
      const collidePoint = (ball.y - (rightPaddle.y + paddle.height/2));
      const normalized = collidePoint / (paddle.height/2);
      const angle = normalized * (Math.PI/3);
      const direction = -1; // to the left
      ball.velX = direction * ball.speed * Math.cos(angle);
      ball.velY = ball.speed * Math.sin(angle);
      ball.speed *= 1.03;
    }
  }

  // scoring
  if (ball.x - ball.radius < 0) {
    // right scores
    state.rightScore += 1;
    scoreRightEl.textContent = state.rightScore;
    serve('right');
  } else if (ball.x + ball.radius > cw) {
    // left scores
    state.leftScore += 1;
    scoreLeftEl.textContent = state.leftScore;
    serve('left');
  }
}

/* serve after point */
function serve(winner){
  // place ball at center and point to winner's side
  ball.x = cw / 2;
  ball.y = ch / 2;
  ball.speed = 6;
  const dir = winner === 'left' ? -1 : 1;
  ball.velX = dir * ball.speed;
  ball.velY = (Math.random() * 2 - 1) * 3;

  // small pause before continuing
  state.running = false;
  setTimeout(() => {
    state.running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }, 700);
}

/* rendering */
function render(){
  // clear
  ctx.clearRect(0,0,cw,ch);

  // midline dashed
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let y = 10; y < ch; y += 24) {
    drawRect(cw/2 - 2, y, 4, 14, 2);
  }

  // paddles
  ctx.fillStyle = '#dbeafe';
  drawRect(leftPaddle.x, leftPaddle.y, paddle.width, paddle.height, 6);
  drawRect(rightPaddle.x, rightPaddle.y, paddle.width, paddle.height, 6);

  // ball
  ctx.fillStyle = '#7dd3fc';
  drawCircle(ball.x, ball.y, ball.radius);
}

/* input handling */
const keys = {};

function keyDown(e){
  keys[e.key] = true;
  updateControls();
}

function keyUp(e){
  keys[e.key] = false;
  updateControls();
}

function updateControls(){
  // reset velocities
  leftPaddle.dy = 0;
  rightPaddle.dy = 0;

  if (state.mode === 'single') {
    // player uses ArrowUp/ArrowDown on left paddle
    if (keys['ArrowUp']) leftPaddle.dy = -1;
    if (keys['ArrowDown']) leftPaddle.dy = 1;
    // right paddle is controlled by AI (no player keys)
  } else if (state.mode === 'multi') {
    // left player: W/S
    if (keys['w'] || keys['W']) leftPaddle.dy = -1;
    if (keys['s'] || keys['S']) leftPaddle.dy = 1;
    // right player: ArrowUp/ArrowDown
    if (keys['ArrowUp']) rightPaddle.dy = -1;
    if (keys['ArrowDown']) rightPaddle.dy = 1;
  }
}

/* start or restart game */
function startGame(){
  state.mode = modeSelect.value;
  state.leftScore = 0;
  state.rightScore = 0;
  scoreLeftEl.textContent = state.leftScore;
  scoreRightEl.textContent = state.rightScore;

  resetPositions();
  state.running = true;
  lastTime = performance.now();

  requestAnimationFrame(loop);
}

/* responsive: if canvas CSS changes size (mobile), keep internal drawing consistent
   We'll not scale internal coords — canvas width/height attributes control actual resolution.
   If you want high-DPI support, you can scale by devicePixelRatio (not essential here).
*/
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
startBtn.addEventListener('click', () => {
  // if already running, restart positions and scores
  startGame();
});

// change mode while running: update behavior immediately
modeSelect.addEventListener('change', () => {
  state.mode = modeSelect.value;
  // If switched to single, clear right player's input (AI takes over)
  if (state.mode === 'single') {
    keys['ArrowUp'] = false;
    keys['ArrowDown'] = false;
  }
  updateControls();
});

/* initialize sizes and positions */
resetPositions();
render();
