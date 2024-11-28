console.log("Game script is loaded.");

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let spaceship = { x: 375, y: 500, width: 50, height: 50, color: "red" };
let asteroids = [];
let bullets = [];
let score = 0;
let timeLeft = 30; // Game duration in seconds
let level = 1;
let paused = false;
let gameStarted = false;
let twoStreams = false; // Enable double bullet streams after 3 points
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Load saved leaderboard

// Spaceship selection buttons
document.getElementById("spaceship1").addEventListener("click", () => {
  spaceship.color = "red";
});
document.getElementById("spaceship2").addEventListener("click", () => {
  spaceship.color = "blue";
});
document.getElementById("spaceship3").addEventListener("click", () => {
  spaceship.color = "green";
});

// Start button
document.getElementById("startButton").addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    resetGame();
    gameLoop();
  }
});

// Pause button
document.getElementById("pauseButton").addEventListener("click", () => {
  paused = !paused;
  if (!paused) gameLoop(); // Resume the game if unpaused
});

// Track mouse movement for spaceship position
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  spaceship.x = e.clientX - rect.left - spaceship.width / 2;
  spaceship.y = e.clientY - rect.top - spaceship.height / 2;
});

// Shoot bullets on canvas click
canvas.addEventListener("click", () => {
  bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y });
  if (twoStreams) {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 20, y: spaceship.y });
    bullets.push({ x: spaceship.x + spaceship.width / 2 + 20, y: spaceship.y });
  }
});

// Main game loop
function gameLoop() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBackground();
  drawSpaceship();
  drawBullets();
  drawAsteroids();
  handleCollisions();
  updateTimer();
  checkLevelProgress();

  if (timeLeft > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    endGame();
  }
}

// Reset game state
function resetGame() {
  asteroids = [];
  bullets = [];
  score = 0;
  timeLeft = 30;
  level = 1;
  twoStreams = false;
  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timeLeft;
  document.getElementById("level").innerText = level;
}

// Background rendering
function updateBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Spaceship rendering
function drawSpaceship() {
  ctx.fillStyle = spaceship.color;
  ctx.beginPath();
  ctx.moveTo(spaceship.x, spaceship.y);
  ctx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height);
  ctx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
  ctx.closePath();
  ctx.fill();
}

// Bullets rendering
function drawBullets() {
  ctx.fillStyle = "white";
  bullets.forEach((bullet, index) => {
    bullet.y -= 5;
    ctx.fillRect(bullet.x, bullet.y, 4, 10);
    if (bullet.y < 0) bullets.splice(index, 1); // Remove off-screen bullets
  });
}

// Asteroids rendering
function drawAsteroids() {
  ctx.fillStyle = "yellow";
  if (Math.random() < 0.02 + level * 0.005) {
    const newAsteroid = { x: Math.random() * canvas.width, y: 0, size: 30 + level * 2 };
    asteroids.push(newAsteroid);
  }
  asteroids.forEach((asteroid, index) => {
    asteroid.y += 2 + level * 0.5; // Asteroid speed increases with level
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Remove off-screen asteroids
    if (asteroid.y > canvas.height) asteroids.splice(index, 1);

    // Check collision with spaceship
    if (
      spaceship.x < asteroid.x + asteroid.size / 2 &&
      spaceship.x + spaceship.width > asteroid.x - asteroid.size / 2 &&
      spaceship.y < asteroid.y + asteroid.size / 2 &&
      spaceship.y + spaceship.height > asteroid.y - asteroid.size / 2
    ) {
      score -= 5; // Penalize score on collision
      document.getElementById("score").innerText = score;
      asteroids.splice(index, 1);
    }
  });
}

// Handle collisions between bullets and asteroids
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
        document.getElementById("score").innerText = score;

        // Enable double bullet streams after 3 points
        if (score >= 3) twoStreams = true;

        bullets.splice(bulletIndex, 1);
        if (asteroid.size > 20) {
          // Split asteroid into smaller pieces
          asteroids.push({ x: asteroid.x - 10, y: asteroid.y, size: asteroid.size / 2 });
          asteroids.push({ x: asteroid.x + 10, y: asteroid.y, size: asteroid.size / 2 });
        }
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });
}

// Update timer display
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft -= 1 / 60; // Reduce time by 1 frame
    document.getElementById("timer").innerText = Math.floor(timeLeft);
  }
}

// Check level progress and update
function checkLevelProgress() {
  if (timeLeft % 10 === 0 && timeLeft > 0) {
    level += 1;
    document.getElementById("level").innerText = level;
  }
}

// Update leaderboard
function updateLeaderboard() {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 3); // Keep top 3 scores
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = leaderboard
    .map((score, index) => `<li>#${index + 1}: ${score}</li>`)
    .join("");
}

// End the game
function endGame() {
  updateLeaderboard();
  alert(`Game Over! Your score: ${score}`);
  gameStarted = false;
}
