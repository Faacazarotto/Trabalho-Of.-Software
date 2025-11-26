'use strict';

// --- ELEMENTOS DO HTML ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nicknameInput = document.getElementById('nickname');
const startSinglePlayerButton = document.getElementById('start-singleplayer');
const startMultiplayerButton = document.getElementById('start-multiplayer');
const scoreList = document.getElementById('score-list');

// --- CONFIGURAÇÕES GLOBAIS ---
const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRID_W = CANVAS_WIDTH / GRID_SIZE;
const GRID_H = CANVAS_HEIGHT / GRID_SIZE;

// --- ESTADO DO JOGO ---
let gameState = {
    running: false,
    gameOver: false,
    mode: 'single',
    nickname: 'Player1',
    snakes: [],
    food: {},
    gameInterval: null,
};

// --- FUNÇÕES DE DESENHO ---
function drawGridItem(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
}

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameState.snakes.forEach(snake => {
        snake.body.forEach((segment, index) => {
            const color = (index === 0) ? snake.colorHead : snake.colorBody;
            drawGridItem(segment.x, segment.y, color);
        });
    });

    drawGridItem(gameState.food.x, gameState.food.y, 'red');
}

// --- LÓGICA DO JOGO ---
function placeFood() {
    let foodPosition;
    while (true) {
        foodPosition = {
            x: Math.floor(Math.random() * GRID_W),
            y: Math.floor(Math.random() * GRID_H)
        };

        const isOnSnake = gameState.snakes.some(snake =>
            snake.body.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)
        );

        if (!isOnSnake) {
            gameState.food = foodPosition;
            return;
        }
    }
}

function createSnake(x, y, dx, dy, colorHead, colorBody, controls) {
    return {
        body: [{ x, y }],
        dx, dy,
        colorHead, colorBody,
        controls
    };
}

function resetGame(mode) {
    if (gameState.gameInterval) clearInterval(gameState.gameInterval);

    gameState.running = true;
    gameState.gameOver = false;
    gameState.mode = mode;
    gameState.snakes = [];

    const snake1Controls = {
        'ArrowUp': { dx: 0, dy: -1 },
        'ArrowDown': { dx: 0, dy: 1 },
        'ArrowLeft': { dx: -1, dy: 0 },
        'ArrowRight': { dx: 1, dy: 0 }
    };
    gameState.snakes.push(createSnake(10, 10, 1, 0, '#00FF00', '#00AA00', snake1Controls));

    if (mode === 'multi') {
        const snake2Controls = {
            'w': { dx: 0, dy: -1 },
            's': { dx: 0, dy: 1 },
            'a': { dx: -1, dy: 0 },
            'd': { dx: 1, dy: 0 }
        };
        gameState.snakes.push(createSnake(GRID_W - 10, GRID_H - 10, -1, 0, '#00FFFF', '#00AAAA', snake2Controls));
    }

    placeFood();
}

function moveSnakes() {
    gameState.snakes.forEach(snake => {
        const head = { ...snake.body[0] };

        // Movimento NORMAL (sem atravessar paredes)
        head.x = head.x + snake.dx;
        head.y = head.y + snake.dy;

        snake.body.unshift(head);

        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            snake.score = (snake.score || 0) + 10;
            placeFood();
        } else {
            snake.body.pop();
        }
    });
}

function checkCollisions() {
    for (const [snakeIndex, snake] of gameState.snakes.entries()) {
        const head = snake.body[0];

        // --- 🟥 COLISÃO COM PAREDES ---
        if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
            return `A Cobra ${snakeIndex + 1} bateu na parede!`;
        }

        // --- COLISÃO CONSIGO MESMA ---
        for (let i = 1; i < snake.body.length; i++) {
            if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
                return `A Cobra ${snakeIndex + 1} colidiu consigo mesma!`;
            }
        }

        // --- COLISÃO ENTRE COBRAS ---
        if (gameState.mode === 'multi') {
            for (const [otherSnakeIndex, otherSnake] of gameState.snakes.entries()) {
                if (snakeIndex === otherSnakeIndex) continue;
                for (const segment of otherSnake.body) {
                    if (head.x === segment.x && head.y === segment.y) {
                        return `Colisão! A Cobra ${snakeIndex + 1} bateu na Cobra ${otherSnakeIndex + 1}.`;
                    }
                }
            }
        }
    }

    return null;
}

function gameLoop() {
    if (!gameState.running) return;

    moveSnakes();

    const collisionMessage = checkCollisions();

    if (collisionMessage) {
        gameState.running = false;
        gameState.gameOver = true;
        clearInterval(gameState.gameInterval);

        const finalScore = Math.max(...gameState.snakes.map(s => s.score || 0));
        alert(`FIM DE JOGO!\n${collisionMessage}\nPontuação final: ${finalScore}`);

        saveScore(gameState.nickname, finalScore);
        loadScores();
        return;
    }

    drawGame();
}

// --- PLACAR ---
function loadScores() {
    const scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
    scoreList.innerHTML = '';

    scores.slice(0, 10).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name} - ${score.score}`;
        scoreList.appendChild(li);
    });
}

function saveScore(name, score) {
    if (!name || score === 0) return;

    const scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);

    localStorage.setItem('snakeScores', JSON.stringify(scores.slice(0, 10)));
}

// --- INICIALIZAÇÃO ---
function startGame(mode) {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
        alert('Por favor, digite um nickname para começar!');
        return;
    }

    gameState.nickname = nickname;
    resetGame(mode);
    gameState.gameInterval = setInterval(gameLoop, 100);
}

window.addEventListener('keydown', function(e){
    const keysToBlock = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ''];

    if(keysToBlock.includes(e.key)){
        e.preventDefault();
    }
}, {passive: false});

document.addEventListener('keydown', event => {
    const key = event.key;

    gameState.snakes.forEach(snake => {
        if (snake.controls[key]) {
            const newDirection = snake.controls[key];

            if (newDirection.dx !== -snake.dx || newDirection.dy !== -snake.dy) {
                snake.dx = newDirection.dx;
                snake.dy = newDirection.dy;
            }
        }
    });
});

startSinglePlayerButton.addEventListener('click', () => startGame('single'));
startMultiplayerButton.addEventListener('click', () => startGame('multi'));

loadScores();
console.log("Jogo da Cobrinha em JS pronto!");
