
// Blackjack Game Logic

// DOM Elements
const messageEl = document.getElementById("message_el");
const dealerCardsEl = document.getElementById("dealer-cards");
const dealerSumEl = document.getElementById("dealer-sum");
const playerCardsEl = document.getElementById("player-cards");
const playerSumEl = document.getElementById("player-sum");
const hitBtn = document.getElementById("new-card-btn");
const standBtn = document.getElementById("stand-btn");
const playerEl = document.getElementById("player-el");

// Game State
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerSum = 0;
let dealerSum = 0;
let gameOver = false;
let playerTurn = true;

const player = {
    name: "Jameel Ur Rehman",
    chips: 145
};

// Suits and Values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Initialize player display
playerEl.textContent = `${player.name}: $${player.chips}`;

// Create and shuffle deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Draw a card from deck
function drawCard() {
    return deck.pop();
}

// Calculate sum with Ace handling
function calculateSum(cards) {
    let sum = 0;
    let aces = 0;
    for (let card of cards) {
        if (card.value === 'A') {
            aces++;
            sum += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            sum += 10;
        } else {
            sum += parseInt(card.value);
        }
    }
    // Adjust for Aces
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

// Render cards to DOM
function renderCards(cards, container, showAll = true) {
    container.innerHTML = '';
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        if (['♥', '♦'].includes(card.suit)) {
            cardEl.classList.add('red');
        }
        if (!showAll && index === 0) {
            // Hide dealer's first card
            cardEl.innerHTML = '<div class="value">?</div><div class="suit">?</div>';
        } else {
            cardEl.innerHTML = `<div class="value">${card.value}</div><div class="suit">${card.suit}</div>`;
        }
        container.appendChild(cardEl);
    });
}

// Update sums
function updateSums() {
    playerSum = calculateSum(playerCards);
    dealerSum = calculateSum(dealerCards);
    playerSumEl.textContent = `Sum: ${playerSum}`;
    dealerSumEl.textContent = playerTurn ? 'Sum: ?' : `Sum: ${dealerSum}`;
}

// Check for Blackjack
function checkBlackjack(cards, sum) {
    return cards.length === 2 && sum === 21;
}

// Determine winner
function determineWinner() {
    if (playerSum > 21) {
        return "You busted! Dealer wins!";
    } else if (dealerSum > 21) {
        return "Dealer busted! You win!";
    } else if (playerSum > dealerSum) {
        return "You win!";
    } else if (dealerSum > playerSum) {
        return "Dealer wins!";
    } else {
        return "It's a tie!";
    }
}

// Dealer turn
function dealerTurn() {
    playerTurn = false;
    renderCards(dealerCards, dealerCardsEl, true);
    updateSums();
    
    while (dealerSum < 17) {
        setTimeout(() => {
            dealerCards.push(drawCard());
            dealerSum = calculateSum(dealerCards);
            renderCards(dealerCards, dealerCardsEl, true);
            updateSums();
        }, 1000);
    }
    
    setTimeout(() => {
        const result = determineWinner();
        messageEl.textContent = result;
        gameOver = true;
        hitBtn.disabled = true;
        standBtn.disabled = true;
    }, 2000);
}

// Start game
function startTheGame() {
    createDeck();
    playerCards = [drawCard(), drawCard()];
    dealerCards = [drawCard(), drawCard()];
    playerTurn = true;
    gameOver = false;
    
    renderCards(playerCards, playerCardsEl);
    renderCards(dealerCards, dealerCardsEl, false);
    updateSums();
    
    if (checkBlackjack(playerCards, playerSum)) {
        messageEl.textContent = "Blackjack! You win!";
        gameOver = true;
    } else if (checkBlackjack(dealerCards, dealerSum)) {
        messageEl.textContent = "Dealer has Blackjack! You lose!";
        gameOver = true;
        renderCards(dealerCards, dealerCardsEl, true);
    } else {
        messageEl.textContent = "Do you want another card?";
    }
    
    hitBtn.disabled = gameOver;
    standBtn.disabled = gameOver;
}

// Hit function
function hit() {
    if (!gameOver && playerTurn) {
        playerCards.push(drawCard());
        renderCards(playerCards, playerCardsEl);
        updateSums();
        
        if (playerSum > 21) {
            messageEl.textContent = "You busted! Dealer wins!";
            gameOver = true;
            hitBtn.disabled = true;
            standBtn.disabled = true;
            renderCards(dealerCards, dealerCardsEl, true);
        } else if (checkBlackjack(playerCards, playerSum)) {
            messageEl.textContent = "Blackjack! You win!";
            gameOver = true;
            hitBtn.disabled = true;
            standBtn.disabled = true;
        } else {
            messageEl.textContent = "Do you want another card?";
        }
    }
}

// Stand function
function stand() {
    if (!gameOver && playerTurn) {
        dealerTurn();
    }
}