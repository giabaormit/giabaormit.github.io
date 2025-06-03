// all the cards with their info
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

// variables for the game
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;

// get all the elements from html
const board = document.getElementById('gameBoard');
const resetBtn = document.getElementById('resetBtn');
const hintBtn = document.getElementById('hintBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const funFactEl = document.getElementById('funFact');
const celebration = document.getElementById('celebration');

// more elements
const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const themeSelect = document.getElementById('themeSelect');
const completedList = document.getElementById('completedList');

let completedMatches = []; // track completed matches

// function to shuffle the cards
function shuffle(array) {
    // first make pairs by copying the array
    const doubled = [...array, ...array];
    
    // then shuffle using random
    for (let i = doubled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // swap the elements
        const temp = doubled[i];
        doubled[i] = doubled[j];
        doubled[j] = temp;
    }
    return doubled;
}

// timer function
function startTimer() {
    // clear any existing timer first
    if (timer) {
        clearInterval(timer);
    }
    
    // start new timer
    timer = setInterval(function() {
        time = time + 1; // increment time
        
        // calculate minutes and seconds
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        
        // format with leading zeros
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        
        // update display
        timerEl.textContent = minutes + ':' + seconds;
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// create a single card element
function createCard(card, index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;
    
    // create the card structure
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    
    // add emoji and name to back
    const emoji = document.createElement('div');
    emoji.style.fontSize = '2rem';
    emoji.style.marginBottom = '5px';
    emoji.textContent = card.img;
    
    const name = document.createElement('div');
    name.textContent = card.name;
    
    cardBack.appendChild(emoji);
    cardBack.appendChild(name);
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);
    
    // add click handler
    cardElement.addEventListener('click', function(e) {
        handleCardClick(e);
    });
    
    return cardElement;
}

function updateCompletedMatches(card) {
    // check if already added
    let alreadyExists = false;
    for (let i = 0; i < completedMatches.length; i++) {
        if (completedMatches[i].name === card.name) {
            alreadyExists = true;
            break;
        }
    }
    
    if (!alreadyExists) {
        completedMatches.push(card);
        
        // create new match item
        const matchItem = document.createElement('div');
        matchItem.classList.add('match-item');
        
        const icon = document.createElement('div');
        icon.classList.add('match-item-icon');
        icon.textContent = card.img;
        
        const span = document.createElement('span');
        span.textContent = card.name;
        
        matchItem.appendChild(icon);
        matchItem.appendChild(span);
        
        completedList.appendChild(matchItem);
    }
}

// reset everything and start new game
function resetGame() {
    // shuffle the cards
    cards = shuffle(cardsData);
    
    // clear the board
    board.innerHTML = '';
    
    // clear completed list
    completedList.innerHTML = '';
    
    // reset all variables
    flipped = [];
    matched = 0;
    moves = 0;
    time = 0;
    gameStarted = false;
    completedMatches = [];
    
    // reset displays
    movesEl.textContent = '0';
    timerEl.textContent = '00:00';
    funFactEl.textContent = 'Click on matching cards to learn interesting facts!';
    funFactEl.classList.add('hidden');
    celebration.classList.add('hidden');
    
    // stop timer if running
    stopTimer();

    // create all the cards and add them to board
    for (let i = 0; i < cards.length; i++) {
        const cardElement = createCard(cards[i], i);
        board.appendChild(cardElement);
    }
}

// handle when user clicks a card
function handleCardClick(e) {
    const card = e.currentTarget;
    
    // dont do anything if card already flipped or if 2 cards already flipped
    if (card.classList.contains('flipped')) {
        return;
    }
    if (flipped.length === 2) {
        return;
    }
    
    // start timer on first click
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    // get card index
    const index = parseInt(card.dataset.index);
    
    // flip the card
    card.classList.add('flipped');
    
    // add to flipped array
    flipped.push({ 
        index: index, 
        element: card 
    });

    // if we have 2 cards flipped, check for match
    if (flipped.length === 2) {
        moves = moves + 1; // increment moves
        movesEl.textContent = moves;
        
        const firstCard = flipped[0];
        const secondCard = flipped[1];
        
        // check if names match
        if (cards[firstCard.index].name === cards[secondCard.index].name) {
            // its a match!
            setTimeout(function() {
                firstCard.element.classList.add('matched');
                secondCard.element.classList.add('matched');
                matched = matched + 2;
                
                // update completed matches
                updateCompletedMatches(cards[firstCard.index]);
                
                // show fun fact
                funFactEl.textContent = cards[firstCard.index].fact;
                funFactEl.classList.remove('hidden');
                
                // clear flipped array
                flipped = [];
                
                // check if game complete
                if (matched === cards.length) {
                    // game finished!
                    stopTimer();
                    
                    // set final stats
                    finalTime.textContent = timerEl.textContent;
                    finalMoves.textContent = moves;
                    
                    // show celebration modal after short delay
                    setTimeout(function() {
                        celebration.classList.remove('hidden');
                    }, 500);
                }
            }, 500);
        } else {
            // not a match, flip cards back
            setTimeout(function() {
                firstCard.element.classList.remove('flipped');
                secondCard.element.classList.remove('flipped');
                flipped = [];
            }, 1000);
        }
    }
}

// reset button click
resetBtn.addEventListener('click', function() {
    resetGame();
});

// play again button click
playAgainBtn.addEventListener('click', function() {
    resetGame();
});

// hint button - shows all cards briefly
hintBtn.addEventListener('click', function() {
    // find all unflipped cards
    const allCards = document.querySelectorAll('.card');
    const unflippedCards = [];
    
    for (let i = 0; i < allCards.length; i++) {
        const card = allCards[i];
        if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
            unflippedCards.push(card);
        }
    }
    
    // flip them all
    for (let i = 0; i < unflippedCards.length; i++) {
        unflippedCards[i].classList.add('flipped');
    }
    
    // flip them back after 2 seconds
    setTimeout(function() {
        for (let i = 0; i < unflippedCards.length; i++) {
            const card = unflippedCards[i];
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
            }
        }
    }, 2000);
});

// theme selector
themeSelect.addEventListener('change', function(e) {
    if (e.target.value === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// close modal when clicking outside
celebration.addEventListener('click', function(e) {
    if (e.target === celebration) {
        celebration.classList.add('hidden');
    }
});

// start the game when page loads
window.addEventListener('DOMContentLoaded', function() {
    resetGame();
});