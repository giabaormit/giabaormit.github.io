// Game data
const cardsData = [
  { name: 'Camera', fact: 'Different cameras have varying sensor sizes that affect image quality and depth of field.', img: '📷' },
  { name: 'Laptop', fact: 'High-performance laptops with dedicated GPUs are essential for smooth video editing workflows.', img: '💻' },
  { name: 'Tripod', fact: 'Tripods not only stabilize shots but also enable consistent framing for professional results.', img: '🎥' },
  { name: 'Microphone', fact: 'Directional microphones can isolate specific sound sources while reducing background noise.', img: '🎤' },
  { name: 'Lighting Kit', fact: 'Professional lighting setups use the three-point lighting technique for optimal subject illumination.', img: '💡' },
  { name: 'Drone', fact: 'Modern drones can capture 4K footage and offer intelligent flight modes for cinematic shots.', img: '🚁' },
  { name: 'Gimbal', fact: 'Electronic gimbals use gyroscopes and motors to counteract camera shake in real-time.', img: '🎬' },
  { name: 'Green Screen', fact: 'Chroma key technology allows for seamless background replacement in post-production.', img: '🟢' },
  { name: 'Memory Card', fact: 'High-speed memory cards with fast write speeds prevent dropped frames during recording.', img: '💾' },
  { name: 'Editing Software', fact: 'Modern editing software uses GPU acceleration to handle multiple 4K video streams simultaneously.', img: '✂️' },
  { name: 'External Monitor', fact: 'Color-calibrated external monitors ensure accurate color representation during filming.', img: '🖥️' },
  { name: 'Clapperboard', fact: 'Digital clapperboards can sync with cameras and automatically log scene information.', img: '🎞️' }
];

// Game state variables
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;
let completedMatches = [];

// DOM elements
const board = document.getElementById('gameBoard');
const resetBtn = document.getElementById('resetBtn');
const hintBtn = document.getElementById('hintBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const funFactEl = document.getElementById('funFact');
const celebration = document.getElementById('celebration');
const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const themeSelect = document.getElementById('themeSelect');
const completedList = document.getElementById('completedList');

// Utility functions
function shuffle(array) {
  const doubled = [...array, ...array];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    time++;
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    timerEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function createCard(card, index) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.dataset.index = index;
  cardElement.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">
        <div style="font-size: 2rem; margin-bottom: 5px;">${card.img}</div>
        <div>${card.name}</div>
      </div>
    </div>
  `;
  cardElement.addEventListener('click', handleCardClick);
  return cardElement;
}

function updateCompletedMatches(card) {
  if (!completedMatches.find(match => match.name === card.name)) {
    completedMatches.push(card);
    const matchItem = document.createElement('div');
    matchItem.classList.add('match-item');
    matchItem.innerHTML = `
      <div class="match-item-icon">${card.img}</div>
      <span>${card.name}</span>
    `;
    completedList.appendChild(matchItem);
  }
}

// Game functions
function resetGame() {
  cards = shuffle(cardsData);
  board.innerHTML = '';
  completedList.innerHTML = '';
  flipped = [];
  matched = 0;
  moves = 0;
  time = 0;
  gameStarted = false;
  completedMatches = [];
  movesEl.textContent = '0';
  timerEl.textContent = '00:00';
  funFactEl.textContent = 'Click on matching cards to learn interesting facts!';
  funFactEl.classList.add('hidden');
  celebration.classList.add('hidden');
  stopTimer();

  cards.forEach((card, idx) => {
    board.appendChild(createCard(card, idx));
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;
  
  // Prevent clicking on already flipped cards or when 2 cards are already flipped
  if (card.classList.contains('flipped') || flipped.length === 2) return;
  
  // Start timer on first move
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }
  
  const index = parseInt(card.dataset.index);
  card.classList.add('flipped');
  flipped.push({ index, element: card });

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    
    const [first, second] = flipped;
    
    if (cards[first.index].name === cards[second.index].name) {
      // Match found
      setTimeout(() => {
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        matched += 2;
        
        // Update completed matches and show fact
        updateCompletedMatches(cards[first.index]);
        funFactEl.textContent = cards[first.index].fact;
        funFactEl.classList.remove('hidden');
        
        flipped = [];
        
        // Check if game is complete
        if (matched === cards.length) {
          stopTimer();
          finalTime.textContent = timerEl.textContent;
          finalMoves.textContent = moves;
          setTimeout(() => {
            celebration.classList.remove('hidden');
          }, 500);
        }
      }, 500);
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        first.element.classList.remove('flipped');
        second.element.classList.remove('flipped');
        flipped = [];
      }, 1000);
    }
  }
}

// Event listeners
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

hintBtn.addEventListener('click', () => {
  const unflippedCards = document.querySelectorAll('.card:not(.flipped):not(.matched)');
  unflippedCards.forEach(card => card.classList.add('flipped'));
  
  setTimeout(() => {
    unflippedCards.forEach(card => {
      if (!card.classList.contains('matched')) {
        card.classList.remove('flipped');
      }
    });
  }, 2000);
});

themeSelect.addEventListener('change', (e) => {
  document.body.classList.toggle('dark', e.target.value === 'dark');
});

// Close celebration modal when clicking outside
celebration.addEventListener('click', (e) => {
  if (e.target === celebration) {
    celebration.classList.add('hidden');
  }
});

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', resetGame);