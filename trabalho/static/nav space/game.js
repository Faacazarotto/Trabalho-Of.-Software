window.addEventListener('load', function() {
    /** CONFIGURAÇÕES GERAIS **/
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Define tamanho do canvas fixo para consistência do jogo
    canvas.width = 800;
    canvas.height = 600;

    // Elementos do DOM
    const scoreDisplay = document.getElementById('scoreDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const highScoreList = document.getElementById('highScoreList');

    // Chave para salvar no LocalStorage
    const HIGH_SCORE_KEY = 'emoji_shooter_v1_ranking';

    /** CLASSES DO JOGO **/

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.projectiles = [];
            this.enemies = [];
            this.obstacles = [];
            this.particles = [];
            this.stars = []; // Background
            this.powerUps = [];
            
            // Timers
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.obstacleTimer = 0;
            this.obstacleInterval = 4000;
            this.powerUpTimer = 0;
            this.powerUpInterval = 10000;

            // Estado
            this.score = 0;
            this.gameOver = false;
            this.gameRunning = false;
            this.mouseTargetX = this.width / 2;

            // Otimização: Limite de partículas para não travar
            this.maxParticles = 20; 

            // Inicializa estrelas do fundo
            for(let i = 0; i < 50; i++) {
                this.stars.push(new Star(this));
            }

            // Input Mouse
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width; // Ajuste de escala se CSS redimensionar
                this.mouseTargetX = (e.clientX - rect.left) * scaleX;
            });

            // Input Click (Tiro)
            canvas.addEventListener('mousedown', (e) => {
                if (this.gameRunning && !this.gameOver) {
                    this.player.shoot();
                }
            });

            this.updateRankingDisplay();
        }

        update(deltaTime) {
            if (this.gameOver) return;

            // Fundo
            this.stars.forEach(star => star.update());

            // Player
            this.player.update(deltaTime);

            // Projéteis
            this.projectiles.forEach(proj => proj.update());
            this.projectiles = this.projectiles.filter(proj => !proj.markedForDeletion);

            // Partículas (Efeitos)
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => !p.markedForDeletion);

            // Inimigos
            if (this.enemyTimer > this.enemyInterval) {
                this.enemies.push(new Enemy(this));
                this.enemyTimer = 0;
                // Aumenta dificuldade gradualmente
                if (this.enemyInterval > 500) this.enemyInterval -= 10;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update();
                if (enemy.markedForDeletion && !this.gameOver) {
                    // Se passou da tela sem morrer (e não foi colisão), perde vida
                    if (enemy.y > this.height) {
                        this.player.takeDamage();
                    }
                }
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            // Obstáculos (Meteoros)
            if (this.obstacleTimer > this.obstacleInterval) {
                this.obstacles.push(new Obstacle(this));
                this.obstacleTimer = 0;
            } else {
                this.obstacleTimer += deltaTime;
            }
            this.obstacles.forEach(obs => obs.update());
            this.obstacles = this.obstacles.filter(obs => !obs.markedForDeletion);

            // PowerUps
            if (this.powerUpTimer > this.powerUpInterval) {
                this.powerUps.push(new PowerUp(this));
                this.powerUpTimer = 0;
                this.powerUpInterval = Math.random() * 10000 + 10000;
            } else {
                this.powerUpTimer += deltaTime;
            }
            this.powerUps.forEach(pu => pu.update());
            this.powerUps = this.powerUps.filter(pu => !pu.markedForDeletion);

            // Colisões
            this.checkCollisions();

            // UI Updates
            scoreDisplay.innerText = this.score;
        }

        draw(context) {
            // Limpa tela
            context.fillStyle = '#0f172a'; // Slate-900
            context.fillRect(0, 0, this.width, this.height);

            this.stars.forEach(star => star.draw(context));

            if (!this.gameOver) {
                this.player.draw(context);
                this.projectiles.forEach(p => p.draw(context));
                this.enemies.forEach(e => e.draw(context));
                this.obstacles.forEach(o => o.draw(context));
                this.powerUps.forEach(pu => pu.draw(context));
            }

            this.particles.forEach(p => p.draw(context));
        }

        checkCollisions() {
            // Helper: Check Box Collision
            const check = (rect1, rect2) => {
                return (
                    rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y
                );
            };

            // Projétil vs Inimigo
            this.projectiles.forEach(proj => {
                this.enemies.forEach(enemy => {
                    if (!proj.markedForDeletion && !enemy.markedForDeletion && check(proj, enemy)) {
                        proj.markedForDeletion = true;
                        enemy.lives--;
                        // Efeito de impacto removido para performance
                        
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            this.score += enemy.scoreValue;
                            // Efeito de explosão removido para performance
                        }
                    }
                });
            });

            // Player vs Inimigo
            this.enemies.forEach(enemy => {
                if (!enemy.markedForDeletion && check(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    if (!this.player.shieldActive) {
                        this.player.takeDamage();
                    } else {
                        this.player.shieldActive = false; // Perde escudo
                    }
                }
            });

            // Player vs Obstáculo
            this.obstacles.forEach(obs => {
                if (!obs.markedForDeletion && check(this.player, obs)) {
                    obs.markedForDeletion = true;
                    if (!this.player.shieldActive) {
                        this.player.takeDamage();
                    } else {
                        this.player.shieldActive = false;
                    }
                }
            });

            // Player vs PowerUp
            this.powerUps.forEach(pu => {
                if (!pu.markedForDeletion && check(this.player, pu)) {
                    pu.markedForDeletion = true;
                    this.player.activatePowerUp(pu.type);
                    this.createParticles(this.player.x + this.player.width/2, this.player.y, 5, '⚡');
                }
            });
        }

        createParticles(x, y, amount, emoji) {
            if (this.particles.length > this.maxParticles) return;
            
            for(let i = 0; i < amount; i++) {
                this.particles.push(new Particle(this, x, y, emoji));
            }
        }

        endGame() {
            if (this.gameOver) return;
            this.gameOver = true;
            this.gameRunning = false;
            
            // Salva Score
            this.saveHighScore();
            
            // UI
            finalScoreDisplay.innerText = this.score;
            this.updateRankingDisplay();
            gameOverScreen.classList.remove('hidden');
        }

        reset() {
            this.player = new Player(this);
            this.projectiles = [];
            this.enemies = [];
            this.obstacles = [];
            this.particles = [];
            this.powerUps = [];
            this.score = 0;
            this.enemyInterval = 2000;
            this.gameOver = false;
            this.gameRunning = true;
            
            scoreDisplay.innerText = "0";
            livesDisplay.innerText = "❤️❤️❤️";
            
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
        }

        saveHighScore() {
            let scores = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY)) || [];
            scores.push(this.score);
            scores.sort((a, b) => b - a);
            scores = scores.slice(0, 5); // Mantém top 5
            localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
        }

        updateRankingDisplay() {
            let scores = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY)) || [];
            highScoreList.innerHTML = '';
            
            if(scores.length > 0) {
                highScoreDisplay.innerText = scores[0];
            } else {
                highScoreDisplay.innerText = '0';
            }

            scores.forEach((sc, index) => {
                const li = document.createElement('li');
                li.className = "flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700";
                let rankIcon = `${index + 1}.`;
                if(index === 0) rankIcon = '🥇';
                if(index === 1) rankIcon = '🥈';
                if(index === 2) rankIcon = '🥉';

                li.innerHTML = `
                    <span class="font-bold text-slate-400 w-8">${rankIcon}</span>
                    <span class="font-mono text-yellow-400 font-bold">${sc}</span>
                `;
                highScoreList.appendChild(li);
            });
            
            if(scores.length === 0) {
                highScoreList.innerHTML = '<li class="text-gray-500 text-center italic text-sm mt-4">Nenhum recorde ainda.</li>';
            }
        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 40;
            this.height = 40;
            this.x = this.game.width / 2 - this.width / 2;
            this.y = this.game.height - 80;
            this.lives = 3;
            this.shieldActive = false;
            this.doubleShot = false;
            this.powerUpTimer = 0;
        }

        update(deltaTime) {
            // Movimento suave seguindo o mouse
            const target = this.game.mouseTargetX - this.width / 2;
            const dx = target - this.x;
            this.x += dx * 0.15; // Fator de suavização

            // Limites da tela
            if (this.x < 0) this.x = 0;
            if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

            // PowerUp Timer
            if (this.doubleShot) {
                this.powerUpTimer += deltaTime;
                if (this.powerUpTimer > 5000) { // 5 segundos
                    this.doubleShot = false;
                    this.powerUpTimer = 0;
                }
            }
        }

        draw(context) {
            context.font = '40px Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText('🚀', this.x, this.y);

            if (this.shieldActive) {
                context.strokeStyle = 'cyan';
                context.lineWidth = 2;
                context.beginPath();
                context.arc(this.x + 20, this.y + 20, 30, 0, Math.PI * 2);
                context.stroke();
            }
        }

        shoot() {
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width/2, this.y));
            
            if(this.doubleShot) {
                this.game.projectiles.push(new Projectile(this.game, this.x, this.y + 10));
                this.game.projectiles.push(new Projectile(this.game, this.x + this.width, this.y + 10));
            }
        }

        activatePowerUp(type) {
            if (type === 'shield') this.shieldActive = true;
            if (type === 'doubleshot') this.doubleShot = true;
        }

        takeDamage() {
            this.lives--;
            livesDisplay.innerText = '❤️'.repeat(Math.max(0, this.lives));
            if (this.lives <= 0) {
                this.game.endGame();
            }
        }
    }

    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x - 5; // Centraliza
            this.y = y;
            this.width = 10;
            this.height = 20;
            this.speed = 10;
            this.markedForDeletion = false;
        }
        update() {
            this.y -= this.speed;
            if (this.y < 0) this.markedForDeletion = true;
        }
        draw(context) {
            context.font = '15px Arial';
            context.fillText('🟢', this.x, this.y);
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.width = 40;
            this.height = 40;
            this.x = Math.random() * (this.game.width - this.width);
            this.y = -this.height;
            this.speedY = Math.random() * 2 + 1;
            this.lives = 2;
            this.scoreValue = 10;
            this.markedForDeletion = false;
        }
        update() {
            this.y += this.speedY;
            if (this.y > this.game.height) this.markedForDeletion = true;
        }
        draw(context) {
            context.font = '40px Arial';
            context.fillText('👾', this.x, this.y);
        }
    }

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.size = Math.random() * 30 + 30;
            this.width = this.size;
            this.height = this.size;
            this.x = Math.random() * (this.game.width - this.width);
            this.y = -this.height;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.markedForDeletion = false;
        }
        update() {
            this.y += this.speedY;
            if (this.y > this.game.height) this.markedForDeletion = true;
        }
        draw(context) {
            context.font = `${this.size}px Arial`;
            context.fillText('☄️', this.x, this.y);
        }
    }

    class PowerUp {
        constructor(game) {
            this.game = game;
            this.width = 30;
            this.height = 30;
            this.x = Math.random() * (this.game.width - this.width);
            this.y = -this.height;
            this.speedY = 2;
            this.markedForDeletion = false;
            this.type = Math.random() > 0.5 ? 'shield' : 'doubleshot';
        }
        update() {
            this.y += this.speedY;
            if (this.y > this.game.height) this.markedForDeletion = true;
        }
        draw(context) {
            const icon = this.type === 'shield' ? '🛡️' : '⚡';
            context.font = '30px Arial';
            context.fillText(icon, this.x, this.y);
        }
    }

    class Particle {
        constructor(game, x, y, emoji) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.emoji = emoji;
            this.size = Math.random() * 20 + 10;
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 4 - 2;
            this.life = 1; 
            this.decay = Math.random() * 0.02 + 0.02;
            this.markedForDeletion = false;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.life <= 0) this.markedForDeletion = true;
        }
        draw(context) {
            context.save();
            context.globalAlpha = this.life;
            context.font = `${this.size}px Arial`;
            context.fillText(this.emoji, this.x, this.y);
            context.restore();
        }
    }

    class Star {
        constructor(game) {
            this.game = game;
            this.x = Math.random() * game.width;
            this.y = Math.random() * game.height;
            this.size = Math.random() * 2;
            this.speed = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y += this.speed;
            if (this.y > this.game.height) {
                this.y = 0;
                this.x = Math.random() * this.game.width;
            }
        }
        draw(context) {
            context.fillStyle = 'white';
            context.globalAlpha = Math.random() * 0.5 + 0.3;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI*2);
            context.fill();
            context.globalAlpha = 1;
        }
    }

    /** LOOP DO JOGO **/
    let lastTime = 0;
    const game = new Game(canvas.width, canvas.height);

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw(ctx);

        requestAnimationFrame(animate);
    }

    // Event Listeners dos Botões
    startButton.addEventListener('click', () => game.reset());
    restartButton.addEventListener('click', () => game.reset());

    // Inicia loop
    animate(0);
});