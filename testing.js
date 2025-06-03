// Array containing all card data with names, facts, and emoji icons
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

    // Global game state variables
    let cards = []; // Array holding the current shuffled cards
    let flipped = []; // Array tracking currently flipped cards (max 2)
    let matched = 0; // Counter for total matched cards
    let moves = 0; // Counter for total moves made
    let time = 0; // Time elapsed in seconds
    let timer; // Reference to the timer interval
    let gameStarted = false; // Flag to track if game has begun
    let completedMatches = []; // Array of completed matches to avoid duplicates

    // DOM element references for efficient access
    const board = document.getElementById('gameBoard'); // Main game board container
    const resetBtn = document.getElementById('resetBtn'); // Reset button
    const hintBtn = document.getElementById('hintBtn'); // Hint button
    const playAgainBtn = document.getElementById('playAgainBtn'); // Play again button in modal
    const timerEl = document.getElementById('timer'); // Timer display element
    const movesEl = document.getElementById('moves'); // Moves counter display
    const funFactEl = document.getElementById('funFact'); // Fun fact display area
    const celebration = document.getElementById('celebration'); // Victory modal
    const finalTime = document.getElementById('finalTime'); // Final time in modal
    const finalMoves = document.getElementById('finalMoves'); // Final moves in modal
    const themeSelect = document.getElementById('themeSelect'); // Theme selector dropdown
    const completedList = document.getElementById('completedList'); // Completed matches list

    // Fisher-Yates shuffle algorithm to randomize card order
    function shuffle(array) {
      const doubled = [...array, ...array]; // Creates pairs by duplicating array
      for (let i = doubled.length - 1; i > 0; i--) { // Iterate backwards through array
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [doubled[i], doubled[j]] = [doubled[j], doubled[i]]; // Swap elements (condition for loop)
      }
      return doubled; // Return shuffled array with pairs
    }

    // Starts the game timer and updates display every second
    function startTimer() {
      if (timer) clearInterval(timer); // Clear existing timer if any
      timer = setInterval(() => { // Create new interval
        time++; // Increment time counter
        const min = String(Math.floor(time / 60)).padStart(2, '0'); // Calculate minutes with leading zero
        const sec = String(time % 60).padStart(2, '0'); // Calculate seconds with leading zero (change interger to string for easier display)
        timerEl.textContent = `${min}:${sec}`; // Update display (take variables/const from real time to the congratulation panel)
      }, 1000); // Run every 1000ms (1 second)
    }

    // Stops the game timer
    function stopTimer() {
      if (timer) { // Check if timer exists
        clearInterval(timer); // Stop the interval
        timer = null; // Reset timer reference
      }
    }

    // Creates a card element with flip animation and click handler
    function createCard(card, index)  { //Identify card and its positions for function
      const cardElement = document.createElement('div'); // Create card container
      cardElement.classList.add('card'); // Add card styling class
      cardElement.dataset.index = index; // Store array index for identification
      cardElement.innerHTML = ` 
        <div class="card-inner"> 
          <div class="card-front"></div> 
          <div class="card-back"> 
            <div style="font-size: 2rem; margin-bottom: 5px;">${card.img}</div> 
            <div>${card.name}</div> 
          </div>
        </div>
      `;
      cardElement.addEventListener('click', handleCardClick); // Add click event listener
      return cardElement; // Return completed card element
    }

    // Adds a completed match to the sidebar list
    function updateCompletedMatches(card) {
      if (!completedMatches.find(match => match.name === card.name)) { // Check for duplicates
        completedMatches.push(card); // Add to completed array
        const matchItem = document.createElement('div'); // Create list item
        matchItem.classList.add('match-item'); // Add styling class
        matchItem.innerHTML = `
          <div class="match-item-icon">${card.img}</div> 
          <span>${card.name}</span> 
        `;
        completedList.appendChild(matchItem); // Add to DOM
      }
    }

    // Resets all game state and regenerates the board
    function resetGame() {
      cards = shuffle(cardsData); // Shuffle cards for new game
      board.innerHTML = ''; // Clear game board
      completedList.innerHTML = ''; // Clear completed matches list
      flipped = []; // Reset flipped cards array
      matched = 0; // Reset match counter
      moves = 0; // Reset move counter
      time = 0; // Reset time
      gameStarted = false; // Reset game started flag
      completedMatches = []; // Reset completed matches array
      movesEl.textContent = '0'; // Reset moves display
      timerEl.textContent = '00:00'; // Reset timer display
      funFactEl.textContent = 'Click on matching cards to learn interesting facts!'; // Reset fact display
      funFactEl.classList.add('hidden'); // Hide fact display
      celebration.classList.add('hidden'); // Hide victory modal
      stopTimer(); // Stop any running timer

      // Create and add all cards to the board
      cards.forEach((card, idx) => {
        board.appendChild(createCard(card, idx)); // Add each card to board
      });
    }

    // Handles card click events and game logic
    function handleCardClick(e) {
      const card = e.currentTarget; // Get clicked card element
      
      // Prevent invalid clicks: already flipped cards or when 2 cards are flipped
      if (card.classList.contains('flipped') || flipped.length === 2) return;
      
      // Start timer on first move
      if (!gameStarted) {
        gameStarted = true; // Set game started flag
        startTimer(); // Begin timing
      }
      
      const index = parseInt(card.dataset.index); // Get card's array index
      card.classList.add('flipped'); // Add flip animation class
      flipped.push({ index, element: card }); // Add to flipped cards array

      // Check for match when two cards are flipped
      if (flipped.length === 2) {
        moves++; // Increment move counter
        movesEl.textContent = moves; // Update moves display
        
        const [first, second] = flipped; // Destructure flipped cards
        
        // Check if cards match by comparing names    
        if (cards[first.index].name === cards[second.index].name) {
          // Match found - handle successful match
          setTimeout(() => {
            first.element.classList.add('matched'); // Mark first card as matched
            second.element.classList.add('matched'); // Mark second card as matched
            matched += 2; // Increment matched counter by 2
            
            // Update UI with match information
            updateCompletedMatches(cards[first.index]); // Add to completed list
            funFactEl.textContent = cards[first.index].fact; // Show fact
            funFactEl.classList.remove('hidden'); // Make fact visible
            
            flipped = []; // Clear flipped cards array
            
            // Check if all cards are matched (game complete)
            if (matched === cards.length) {
              stopTimer(); // Stop the timer
              finalTime.textContent = timerEl.textContent; // Set final time in modal
              finalMoves.textContent = moves; // Set final moves in modal
              setTimeout(() => {
                celebration.classList.remove('hidden'); // Show victory modal after delay
              }, 500);
            }
          }, 500); // Delay for visual feedback
        } else {
          // No match - flip cards back after delay
          setTimeout(() => {
            first.element.classList.remove('flipped'); // Remove flip class from first card
            second.element.classList.remove('flipped'); // Remove flip class from second card
            flipped = []; // Clear flipped cards array
          }, 1000); // 1 second delay to let player see the cards
        }
      }
    }

    // Event listeners for user interactions
    resetBtn.addEventListener('click', resetGame); // Reset button starts new game
    playAgainBtn.addEventListener('click', resetGame); // Play again button starts new game

    // Hint button temporarily shows all unmatched cards
    hintBtn.addEventListener('click', () => {
      const unflippedCards = document.querySelectorAll('.card:not(.flipped):not(.matched)'); // Get all face-down cards
      unflippedCards.forEach(card => card.classList.add('flipped')); // Flip all unmatched cards
      
      setTimeout(() => { // After 2 seconds, flip them back
        unflippedCards.forEach(card => {
          if (!card.classList.contains('matched')) { // Only flip back if not matched
            card.classList.remove('flipped'); // Remove flip class
          }
        });
      }, 2000); // 2 second hint duration
    });

    // Theme selector changes between light and dark modes (create 2 layout of light/dark theme in css and this button will change the layout in html)
    themeSelect.addEventListener('change', (e) => {
      document.body.classList.toggle('dark', e.target.value === 'dark'); // Toggle dark class based on selection
    });

    // Close celebration modal when clicking outside the content area
    celebration.addEventListener('click', (e) => {
      if (e.target === celebration) { // Check if click was on the overlay, not the modal content
        celebration.classList.add('hidden'); // Hide the modal
      }
    });
 
    // Initialize game when page loads
    window.addEventListener('DOMContentLoaded', resetGame); // Start new game when DOM is ready