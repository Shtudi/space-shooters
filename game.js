console.log("Game script is running...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let spaceship = { x: 400, y: 500, width: 50, height: 50 };
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
  console.log(`Spaceship Position Updated: x=${spaceship.x}`);
});

// Event Listener for Shooting
canvas.addEventListener('click', () => {
  bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y });
  console.log("Bullet fired:", bullets[bullets.length - 1]);
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
  ctx.fillStyle = 'red'; // Spaceship is red
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
  console.log("Spaceship drawn at:", spaceship.x, spaceship.y);
}

// Draw Bullets
function drawBullets() {
  ctx.fillStyle = 'white'; // Bullets are white
  bullets.forEach((bullet, index) => {
    bullet.y -= 5;
    ctx.fillRect(bullet.x, bullet.y, 4, 10);

    if (bullet.y < 0) {
      bullets.splice(index, 1);
      console.log("Bullet removed (out of screen):", bullet);
    }
  });
}

// Draw Asteroids
function drawAsteroids() {
  ctx.fillStyle = 'yellow'; // Asteroids are yellow
  if (Math.random() < 0.02) {
    const newAsteroid = { x: Math.random() * canvas.width, y: 0, size: 30 };
    asteroids.push(newAsteroid);
    console.log("New asteroid created:", newAsteroid);
  }

  asteroids.forEach((asteroid, index) => {
    asteroid.y += 2;
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
    ctx.fill();

    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
      console.log("Asteroid removed (out of screen):", asteroid);
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
        // Collision detected
        score += 10;
        document.getElementById('score').innerText = score;
        console.log(`Collision! Score: ${score}`);
        bullets.splice(bulletIndex, 1);
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });
}

// Update Timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft -= 1 / 60; // Decrease by 1 frame
    document.getElementById('timer').innerText = Math.floor(timeLeft);
    console.log("Time Left:", Math.floor(timeLeft));
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
