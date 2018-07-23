/* eslint-env browser */

/*
 * Array that holds all of the cards
 */
const deck = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt',
  'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];

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
  card.classList.add('open', 'show');
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
  const card = event.target;
  displayCard(card);
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
    const cardI = document.createElement('i');
    cardI.classList.add('fa', `fa-${card}`);

    const cardLi = document.createElement('li');

    cardLi.classList.add('card');
    cardLi.appendChild(cardI);
    cardLi.addEventListener('click', handleCardClick);

    deckUl.appendChild(cardLi);
  });
}

displayCards();
