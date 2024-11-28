const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let spaceship = { x: 400, y: 500, width: 50, height: 50 };
let asteroids = [];
let bullets = [];
let score = 0;
let timeLeft = 60;

// Event Listener for Mouse Movement
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  spaceship.x = e.clientX - rect.left - spaceship.width / 2;
});

// Event Listener for Shooting
canvas.addEventListener('click', () => {
  bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y });
});

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  drawBullets();
  drawAsteroids();
  handleCollisions();
  updateTimer();

  if (timeLeft > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    endGame();
  }
}

// Draw Spaceship
function drawSpaceship() {
  ctx.fillStyle = 'white';
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Draw Bullets
function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach((bullet, index) => {
    bullet.y -= 5;
    ctx.fillRect(bullet.x, bullet.y, 4, 10);

    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Draw Asteroids
function drawAsteroids() {
  ctx.fillStyle = 'gray';
  if (Math.random() < 0.02) {
    asteroids.push({ x: Math.random() * canvas.width, y: 0, size: 30 });
  }

  asteroids.forEach((asteroid, index) => {
    asteroid.y += 2;
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
    ctx.fill();

    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
    }
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
        score += 10;
        document.getElementById('score').innerText = score;
        bullets.splice(bulletIndex, 1);
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });
}

// Update Timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft -= 1 / 60;
    document.getElementById('timer').innerText = Math.floor(timeLeft);
  }
}

// End Game
function endGame() {
  alert(`Game Over! Your Score: ${score}`);
  window.location.reload();
}

// Start Game
gameLoop();
