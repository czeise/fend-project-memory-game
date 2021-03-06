/* eslint-env browser */

/*
 * Array that holds all of the cards
 */
const deck = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt',
  'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];

let openCards = [];
let moveCount = 0;
let starsCount = 3;
let matchCount = 0;
let gameWon = false;
let timerId;
let count = 1;
let gameRunning = false;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  const shuffledArray = array;
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    shuffledArray[currentIndex] = array[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }

  return shuffledArray;
}

function displayCard(card) {
  if (card.classList.contains('is-flipped')) {
    return false;
  }

  card.classList.add('is-flipped');
  return true;
}

function hideCard(card) {
  card.classList.remove('is-flipped');
}

function startTimer() {
  const timerElement = document.querySelector('.timer');

  timerId = setInterval(() => {
    timerElement.textContent = count;
    count += 1;
  }, 1000);
}

function decreaseStars() {
  const stars = document.querySelectorAll('.fa-star');
  const star = stars[stars.length - 1];
  star.classList.remove('fa-star');
  star.classList.add('fa-star-o');

  starsCount -= 1;
  document.querySelector('.stars-count').textContent = starsCount;
}

function resetStars() {
  starsCount = 3;

  const stars = document.querySelectorAll('.fa-star-o');

  stars.forEach((star) => {
    star.classList.remove('fa-star-o');
    star.classList.add('fa-star');

    document.querySelector('.stars-count').textContent = starsCount;
  });
}

function handleMatch() {
  openCards = [];
  matchCount += 1;
  if (matchCount === 8) {
    clearInterval(timerId);
    gameWon = true;
    document.querySelector('#win .timer').textContent = count;
    document.querySelector('#win').showModal();
  }
}

function handleMismatch() {
  openCards.forEach((c) => {
    // Display "mismatch style"
    setTimeout(() => {
      c.firstChild.classList.add('mismatch');
    }, 1000);

    // Wait a second so user can see card, then remove "mismatch" style
    setTimeout(() => {
      c.firstChild.classList.remove('mismatch');
      hideCard(c);
    }, 2000);
  });

  openCards = [];
}

function incrementMoves() {
  moveCount += 1;
  document.querySelectorAll('.moves').forEach((moveSpan) => {
    const span = moveSpan;
    span.textContent = moveCount;
  });

  // Decrease the star rating after 13 and 20 moves. Per the rubric, 1 star is the minimum score,
  // not 0.
  if ([14, 21].includes(moveCount)) {
    decreaseStars();
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this
 *    one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you
 *    call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in
 *      another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put
 *      this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another
 *      function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in
 *      another function that you call from this one)
 */
function handleCardClick(event) {
  if (gameWon) {
    return;
  }

  if (!gameRunning) {
    startTimer();
    gameRunning = true;
  }

  const card = event.target.parentNode;
  openCards.push(card);

  if (openCards.length < 3) {
    // If the card is already flipped, don't do anything. It's either already matched, the first
    // open card in the queue, or it's currently being flipped back.
    if (!displayCard(card)) {
      openCards.pop();
      return;
    }
  }

  if (openCards.length === 2) {
    incrementMoves();

    if (openCards[0].firstChild.className === openCards[1].firstChild.className) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }
}

/*
 * Display the cards on the page
 *   - Shuffles the list of cards using the "shuffle" method
 *   - Loops through each card and creates its HTML
 *   - Adds each card's HTML to the page
 */
function displayCards() {
  const shuffledDeck = shuffle(deck);
  const deckUl = document.querySelector('.deck');

  while (deckUl.firstChild) {
    deckUl.removeChild(deckUl.firstChild);
  }

  shuffledDeck.forEach((card) => {
    const front = document.createElement('i');
    front.classList.add('face', 'front', 'fa', `fa-${card}`);

    const back = document.createElement('i');
    back.classList.add('face', 'back');

    const cardLi = document.createElement('li');

    cardLi.classList.add('card');
    cardLi.appendChild(front);
    cardLi.appendChild(back);
    cardLi.addEventListener('click', handleCardClick);

    deckUl.appendChild(cardLi);
  });
}

function resetMoveCount() {
  moveCount = 0;

  document.querySelectorAll('.moves').forEach((moveSpan) => {
    const span = moveSpan;
    span.textContent = moveCount;
  });
}

function resetTimer() {
  clearInterval(timerId);
  document.querySelector('.timer').textContent = 0;
  count = 1;
}

function restart() {
  openCards = [];
  matchCount = 0;
  gameRunning = false;
  gameWon = false;

  resetStars();
  resetMoveCount();
  resetTimer();
  displayCards();

  document.querySelector('#win').close();
}

// Initialize game
displayCards();
document.querySelector('#restart').addEventListener('click', restart);
document.querySelector('.restart').addEventListener('click', restart);
