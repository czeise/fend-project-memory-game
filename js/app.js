/* eslint-env browser */

/*
 * Array that holds all of the cards
 */
const deck = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt',
  'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];

let openCards = [];
let moveCount = 0;
let matchCount = 0;
let gameWon = false;
let timerId;
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
  card.classList.add('is-flipped');
}

function hideCard(card) {
  card.classList.remove('is-flipped');
}

function startTimer() {
  let count = 1;
  const timerElement = document.querySelector('.timer');

  timerId = setInterval(() => {
    timerElement.textContent = count;
    count += 1;

    if (gameWon) {
      clearInterval(timerId);
    }
  }, 1000);
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
    displayCard(card);
  }

  if (openCards.length === 2) {
    moveCount += 1;
    document.querySelector('.moves').textContent = moveCount;

    if (openCards[0].firstChild === openCards[1].firstChild) {
      console.log('same exact card');

      openCards.pop();
      return;
    }
    if (openCards[0].firstChild.className === openCards[1].firstChild.className) {
      console.log('match');
      openCards = [];
      matchCount += 1;
      if (matchCount === 8) {
        console.log('You win!');
        gameWon = true;
      }
    } else {
      console.log('mismatch');

      openCards.forEach((c) => {
        // Display "mismatch style"
        setTimeout(() => {
          // c.classList.add('shake');
          c.firstChild.classList.add('mismatch');
        }, 1000);

        // Wait a second so user can see card, then remove "mismatch" style
        setTimeout(() => {
          c.firstChild.classList.remove('mismatch');
          // c.classList.remove('shake');
          hideCard(c);
        }, 2000);
      });

      openCards = [];
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

displayCards();
