console.log("Game script is running...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let spaceship = { x: 375, y: 500, width: 50, height: 50 };
let asteroids = [];
let bullets = [];
let score = 0;
let timeLeft = 60;

// Debugging: Check if canvas is set up correctly
console.log("Canvas initialized:", canvas, ctx);

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

// Draw Spaceship (Cool Triangle Shape)
function drawSpaceship() {
  ctx.fillStyle = 'red'; // Spaceship is red
  ctx.beginPath();
  ctx.moveTo(spaceship.x, spaceship.y); // Top point of the triangle
  ctx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height); // Bottom-left
  ctx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height); // Bottom-right
  ctx.closePath();
  ctx.fill();
}

// Draw Bullets
function drawBullets() {
  ctx.fillStyle = 'white'; // Bullets are white
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
  ctx.fillStyle = 'yellow'; // Asteroids are yellow
  if (Math.random() < 0.02) {
    const newAsteroid = { x: Math.random() * canvas.width, y: 0, size: 30 };
    asteroids.push(newAsteroid);
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
  // Check collisions between bullets and asteroids
  bullets.forEach((bullet, bulletIndex) => {
    asteroids.forEach((asteroid, asteroidIndex) => {
      if (
        bullet.x > asteroid.x - asteroid.size / 2 &&
        bullet.x < asteroid.x + asteroid.size / 2 &&
        bullet.y < asteroid.y + asteroid.size / 2 &&
        bullet.y > asteroid.y - asteroid.size / 2
      ) {
        // Collision detected
        score += 1; // +1 point per asteroid
        document.getElementById('score').innerText = score;
        bullets.splice(bulletIndex, 1);
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });

  // Check collisions between spaceship and asteroids
  asteroids.forEach((asteroid, index) => {
    if (
      spaceship.x < asteroid.x + asteroid.size / 2 &&
      spaceship.x + spaceship.width > asteroid.x - asteroid.size / 2 &&
      spaceship.y < asteroid.y + asteroid.size / 2 &&
      spaceship.y + spaceship.height > asteroid.y - asteroid.size / 2
    ) {
      // Collision with spaceship
      score -= 5; // -5 points per collision
      document.getElementById('score').innerText = score;
      console.log("Strike! -5 points.");
      asteroids.splice(index, 1); // Remove asteroid after collision
    }
  });
}

// Update Timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft -= 1 / 60; // Decrease by 1 frame
    document.getElementById('timer').innerText = Math.floor(timeLeft);
  }
}

// End Game
function endGame() {
  alert(`Game Over! Your Score: ${score}`);
  console.log("Game Over! Final Score:", score);
  window.location.reload();
}

// Start Game
gameLoop();
