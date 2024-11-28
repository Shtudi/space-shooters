console.log("Game script is running...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let spaceship = { x: 375, y: 500, width: 50, height: 50, color: 'red' };
let asteroids = [];
let bullets = [];
let particles = [];
let score = 0;
let timeLeft = 60;
let level = 1;
let shieldActive = false;
let paused = false;
let backgroundY = 0;

// Audio effects
const shootSound = new Audio('https://freesound.org/data/previews/323/323095_5260874-lq.mp3');
const explosionSound = new Audio('https://freesound.org/data/previews/178/178186_633166-lq.mp3');
const crashSound = new Audio('https://freesound.org/data/previews/458/458137_5901753-lq.mp3');

// Spaceship Selection
document.getElementById('spaceship1').addEventListener('click', () => (spaceship.color = 'red'));
document.getElementById('spaceship2').addEventListener('click', () => (spaceship.color = 'blue'));
document.getElementById('spaceship3').addEventListener('click', () => (spaceship.color = 'green'));

// Pause Game
document.getElementById('pauseButton').addEventListener('click', () => {
  paused = !paused;
  if (!paused) gameLoop(); // Resume game
});

// Event Listener for Mouse Movement
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  spaceship.x = e.clientX - rect.left - spaceship.width / 2;
  spaceship.y = e.clientY - rect.top - spaceship.height / 2;
});

// Event Listener for Shooting
canvas.addEventListener('click', () => {
  bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y });
  shootSound.play();
});

// Game Loop
function gameLoop() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBackground();
  drawSpaceship();
  drawBullets();
  drawAsteroids();
  drawParticles();
  handleCollisions();
  drawShield();
  updateTimer();
  checkLevelProgress();

  if (timeLeft > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    endGame();
  }
}

// Background Animation
function updateBackground() {
  backgroundY += 2;
  if (backgroundY > canvas.height) backgroundY = 0;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  for (let i = 0; i < 100; i++) {
    const starX = Math.random() * canvas.width;
    const starY = (Math.random() * canvas.height + backgroundY) % canvas.height;
    ctx.fillRect(starX, starY, 2, 2);
  }
}

// Draw Spaceship
function drawSpaceship() {
  ctx.fillStyle = spaceship.color;
  ctx.beginPath();
  ctx.moveTo(spaceship.x, spaceship.y);
  ctx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height);
  ctx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
  ctx.closePath();
  ctx.fill();
}

// Draw Shield
function drawShield() {
  if (shieldActive) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(spaceship.x, spaceship.y + spaceship.height / 2, spaceship.width, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Draw Bullets
function drawBullets() {
  ctx.fillStyle = 'white';
  bullets.forEach((bullet, index) => {
    bullet.y -= 5;
    ctx.fillRect(bullet.x, bullet.y, 4, 10);
    if (bullet.y < 0) bullets.splice(index, 1);
  });
}

// Draw Asteroids
function drawAsteroids() {
  ctx.fillStyle = 'yellow';
  if (Math.random() < 0.02 + level * 0.005) {
    const newAsteroid = { x: Math.random() * canvas.width, y: 0, size: 30 + level * 2 };
    asteroids.push(newAsteroid);
  }
  asteroids.forEach((asteroid, index) => {
    asteroid.y += 2 + level * 0.5;
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
    ctx.fill();
    if (asteroid.y > canvas.height) asteroids.splice(index, 1);
  });
}

// Handle Collisions
function handleCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    asteroids.forEach((asteroid, asteroidIndex) => {
      if (
        bullet.x > asteroid.x - asteroid.size / 2 &&
        bullet.x < asteroid.x + asteroid.size / 2 &&
        bullet.y < asteroid.y + asteroid.size / 2 &&
        bullet.y > asteroid.y - asteroid.size / 2
      ) {
        score += 1;
        document.getElementById('score').innerText = score;
        bullets.splice(bulletIndex, 1);
        asteroids.splice(asteroidIndex, 1);
        explosionSound.play();
      }
    });
  });

  asteroids.forEach((asteroid, index) => {
    if (
      spaceship.x + spaceship.width / 2 > asteroid.x - asteroid.size / 2 &&
      spaceship.x - spaceship.width / 2 < asteroid.x + asteroid.size / 2 &&
      spaceship.y < asteroid.y + asteroid.size / 2 &&
      spaceship.y + spaceship.height > asteroid.y - asteroid.size / 2
    ) {
      if (!shieldActive) {
        score -= 5;
        document.getElementById('score').innerText = score;
        asteroids.splice(index, 1);
        crashSound.play();
      }
    }
  });
}

// Update Timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft -= 1 / 60;
    document.getElementById('timer').innerText = Math.floor(timeLeft);
  }
}

// Check Level Progression
function checkLevelProgress() {
  if (timeLeft % 20 === 0 && timeLeft > 0) {
    level += 1;
    document.getElementById('level').innerText = level;
  }
}

// End Game
function endGame() {
  alert(`Game Over! Your Score: ${score}`);
  window.location.reload();
}

// Start Game
gameLoop();
