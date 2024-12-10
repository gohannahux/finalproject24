const canvas = document.getElementById('bubble-canvas');
const backgroundSelector = document.getElementById('background');
const wands = document.querySelectorAll('.wand');
let currentWand = ''; // No wand selected initially


// Function to Change Background with Transition
backgroundSelector.addEventListener('change', () => {
  document.body.style.background = backgroundSelector.value; // Apply selected background
  document.body.style.backgroundSize = 'cover'; // Ensure proper sizing
  document.body.style.backgroundRepeat = 'no-repeat'; // Prevent tiling
});

// Wand Selection
wands.forEach(wand => {
  wand.addEventListener('click', () => {
    currentWand = wand.getAttribute('data-wand'); // Assign the wand color
    wands.forEach(w => w.classList.remove('selected')); // Clear previous selection
    wand.classList.add('selected'); // Highlight the selected wand
  });
});

// Bubble Creation
canvas.addEventListener('mousemove', (event) => {
  if (event.buttons === 1 && currentWand) { // Only create bubbles if a wand is selected
    createBubble(event.clientX, event.clientY);
  }
});

function createBubble(x, y) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${currentWand}`;
  bubble.style.left = `${x - 25}px`; // Position bubble
  bubble.style.top = `${y - 25}px`;
  bubble.style.width = `${getRandomSize()}px`;
  bubble.style.height = `${getRandomSize()}px`;

  canvas.appendChild(bubble);

  setTimeout(() => {
    bubble.remove(); // Remove bubble after animation
  }, 5000); // Matches animation duration
}

function getRandomSize() {
  return Math.floor(Math.random() * 30) + 20; // Random size between 20 and 50px
}


