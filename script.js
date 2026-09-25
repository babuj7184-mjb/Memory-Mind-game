// ==========================================
// MEMORY MASTER
// ==========================================

// Emoji cards
const symbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍍",
    "🥝",
    "🥭"
];

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

let moves = 0;
let score = 0;

let seconds = 0;
let timerInterval = null;

let gameStarted = false;
let lockBoard = false;

// HTML elements
const gameBoard = document.getElementById("gameBoard");

const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");

const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");

const message = document.getElementById("message");

// ==========================================
// GET BEST SCORE
// ==========================================

function getBestScore() {

    const best = localStorage.getItem("memoryBestScore");

    if (best) {
        bestScoreDisplay.textContent = best;
    } else {
        bestScoreDisplay.textContent = "0";
    }
}

// ==========================================
// START GAME
// ==========================================

function startGame() {

    clearInterval(timerInterval);

    seconds = 0;

    moves = 0;

    score = 0;

    matchedPairs = 0;

    flippedCards = [];

    gameStarted = false;

    lockBoard = false;

    timerDisplay.textContent = "00:00";

    movesDisplay.textContent = "0";

    scoreDisplay.textContent = "0";

    message.textContent = "";

    gameBoard.innerHTML = "";

    createCards();

}

// ==========================================
// CREATE CARDS
// ==========================================

function createCards() {

    const difficulty = difficultySelect.value;

    let pairCount;

    if (difficulty === "easy") {
        pairCount = 4;
    }

    else if (difficulty === "medium") {
        pairCount = 6;
    }

    else {
        pairCount = 8;
    }

    const selectedSymbols = symbols.slice(0, pairCount);

    cards = [...selectedSymbols, ...selectedSymbols];

    shuffle(cards);

    gameBoard.style.gridTemplateColumns =
        pairCount === 4
            ? "repeat(4, 1fr)"
            : "repeat(4, 1fr)";

    cards.forEach((symbol, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front">
                    ?
                </div>

                <div class="card-back">
                    ${symbol}
                </div>

            </div>
        `;

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);

    });

}

// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

}

// ==========================================
// FLIP CARD
// ==========================================

function flipCard(card) {

    // Don't allow invalid clicks
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    // Start timer on first click
    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }

    card.classList.add("flipped");

    flippedCards.push(card);

    if (flippedCards.length === 2) {

        moves++;

        movesDisplay.textContent = moves;

        checkMatch();

    }

}

// ==========================================
// CHECK MATCH
// ==========================================

function checkMatch() {

    const [firstCard, secondCard] = flippedCards;

    const firstSymbol = firstCard.dataset.symbol;

    const secondSymbol = secondCard.dataset.symbol;

    if (firstSymbol === secondSymbol) {

        // Match
        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matchedPairs++;

        score += 100;

        scoreDisplay.textContent = score;

        flippedCards = [];

        if (matchedPairs === cards.length / 2) {

            gameWon();

        }

    }

    else {

        // Not match
        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            flippedCards = [];

            lockBoard = false;

        }, 900);

    }

}

// ==========================================
// TIMER
// ==========================================

function startTimer() {

    timerInterval = setInterval(() => {

        seconds++;

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0");

    }, 1000);

}

// ==========================================
// GAME WON
// ==========================================

function gameWon() {

    clearInterval(timerInterval);

    // Time bonus
    const timeBonus =
        Math.max(0, 500 - seconds * 5);

    // Move bonus
    const moveBonus =
        Math.max(0, 300 - moves * 10);

    score += timeBonus + moveBonus;

    scoreDisplay.textContent = score;

    const oldBest =
        Number(localStorage.getItem("memoryBestScore")) || 0;

    if (score > oldBest) {

        localStorage.setItem(
            "memoryBestScore",
            score
        );

        bestScoreDisplay.textContent = score;

        message.textContent =
            "🎉 New High Score! 🏆";

    }

    else {

        message.textContent =
            "🎉 Congratulations! You completed the game!";

    }

}

// ==========================================
// RESTART BUTTON
// ==========================================

restartBtn.addEventListener(
    "click",
    startGame
);

// ==========================================
// DIFFICULTY CHANGE
// ==========================================

difficultySelect.addEventListener(
    "change",
    startGame
);

// ==========================================
// INITIALIZE
// ==========================================

getBestScore();

startGame();
