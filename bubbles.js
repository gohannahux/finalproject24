// ========== CURSOR EFFECT ==========
let cursorEffect = null;
let cursorEnabled = true;

// Initialize cursor effect
function initCursor() {
  if (!cursorEffect) {
    cursorEffect = new cursoreffects.bubbleCursor();
  }
}

// Toggle cursor effect on/off
function toggleCursor() {
  const button = document.getElementById('cursor-toggle');
  
  if (cursorEnabled) {
    // Turn OFF
    if (cursorEffect && cursorEffect.destroy) {
      cursorEffect.destroy();
    }
    cursorEffect = null;
    cursorEnabled = false;
    button.textContent = '🫧 Cursor Effect: OFF';
    button.style.background = '#94a3b8';
  } else {
    // Turn ON
    initCursor();
    cursorEnabled = true;
    button.textContent = '🫧 Cursor Effect: ON';
    button.style.background = '#6366f1';
  }
}

// Start with cursor effect enabled
initCursor();

// ========== GAME VARIABLES ==========
const container = document.getElementById('bubble-container');
const scoreDisplay = document.getElementById('score-value');
let score = 0;

// ========== CHANGE BACKGROUND FUNCTION ==========
// This changes the CSS class on the body element
function changeBackground(scene) {
  document.body.className = scene;
}

// ========== RANDOM NUMBER HELPER ==========
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// ========== CREATE A SINGLE BUBBLE ==========
function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  // Random size between 40px and 100px
  const size = random(40, 100);
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  // Random horizontal position
  const startX = random(0, window.innerWidth - size);
  bubble.style.left = `${startX}px`;

  // Start at random heights (so they appear immediately across the screen)
  const startY = random(window.innerHeight * 0.2, window.innerHeight + 100);
  bubble.style.top = `${startY}px`;
  bubble.style.setProperty('--start-y', `${startY}px`);

// Use difficulty-based speed
const settings = difficultySettings[difficulty];
const duration = random(settings.speedMin, settings.speedMax);

  // Random horizontal drift
  const drift = random(-50, 50);
  bubble.style.setProperty('--drift', `${drift}px`);

  // Apply animations with the duration
  bubble.style.animation = `float-up ${duration}s linear`;

  // Click to pop functionality
  bubble.addEventListener('click', function() {
    popBubble(bubble);
  });

  // Add bubble to container
  container.appendChild(bubble);

  // Remove bubble after it floats off screen
  setTimeout(() => {
    if (bubble.parentElement) {
      bubble.remove();
    }
  }, duration * 1000);
}

// ========== SPAWN SHARK FUNCTION ==========
function spawnShark() {
  const shark = document.createElement('div');
  shark.classList.add('shark');
  shark.textContent = '🦈';
  
  // Random position on screen
  const posX = random(100, window.innerWidth - 200);
  const posY = random(100, window.innerHeight - 200);
  shark.style.left = `${posX}px`;
  shark.style.top = `${posY}px`;
  
  container.appendChild(shark);
  
  // Fade in
  setTimeout(() => {
    shark.classList.add('fade-in');
  }, 10);
  
  // Fade out after 3 seconds
  setTimeout(() => {
    shark.classList.remove('fade-in');
    shark.classList.add('fade-out');
  }, 3000);
  
  // Remove from DOM after fade out completes
  setTimeout(() => {
    shark.remove();
  }, 4000);
}
// ========== POP BUBBLE FUNCTION ==========
function popBubble(bubble) {
  // Add popping animation
  bubble.classList.add('popping');
  
  // Increase score
  score++;
  scoreDisplay.textContent = score;
  
  // Check for shark spawn (10 points, hard mode, ocean scene)
  if (score === 10 && difficulty === 'hard' && document.body.classList.contains('ocean')) {
    spawnShark();
  }

  // Remove bubble after animation
  setTimeout(() => {
    bubble.remove();
  }, 300);
}

// ========== GAME START LOGIC ==========
let gameStarted = false;
let gameInterval;
let difficulty = 'medium';

// Difficulty settings
const difficultySettings = {
  easy: {
    spawnRate: 400,        // New bubble every 400ms (slower)
    initialBubbles: 40,    // Fewer starting bubbles
    speedMin: 8,           // Slower float speed
    speedMax: 12
  },
  medium: {
    spawnRate: 200,        // New bubble every 200ms
    initialBubbles: 60,
    speedMin: 5,
    speedMax: 10
  },
  hard: {
    spawnRate: 100,        // New bubble every 100ms (very fast!)
    initialBubbles: 80,    // More starting bubbles
    speedMin: 3,           // Faster float speed
    speedMax: 6
  }
};

// Start game function
function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty;
  
  // Remove start screen completely
  document.getElementById('start-screen').remove();
  
  // Start the game
  gameStarted = true;
  
  const settings = difficultySettings[difficulty];
  
  // Create initial bubbles
  for (let i = 0; i < settings.initialBubbles; i++) {
    createBubble();
  }
  
  // Create new bubbles continuously at difficulty speed
  gameInterval = setInterval(createBubble, settings.spawnRate);
}