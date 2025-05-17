const board = document.getElementById("board");
const diceResult = document.getElementById("diceResult");
const rollDice = document.getElementById("rollDice");
const turnIndicator = document.getElementById("turnIndicator");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const answersDiv = document.getElementById("answers");
const timerDiv = document.getElementById("timer");
const winnerDiv = document.getElementById("winner");

let currentPlayer = 1;
let positions = [0, 0];
const totalCells = 100;
let isQuestionActive = false;
let timer;

const questionPoints = [5, 13, 22, 31, 39, 48, 56, 67, 74, 88];

function createBoard() {
  for (let i = 100; i > 0; i--) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = i;
    cell.id = `cell-${i}`;
    if (questionPoints.includes(i)) cell.classList.add("question");
    board.appendChild(cell);
  }
}

function movePiece(player, to) {
  const piece = document.querySelector(`.p${player}`) || createPiece(player);
  const cell = document.getElementById(`cell-${to}`);
  cell.appendChild(piece);
}

function createPiece(player) {
  const piece = document.createElement("div");
  piece.className = `piece p${player}`;
  document.body.appendChild(piece);
  return piece;
}

function roll() {
  if (isQuestionActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = roll;
  const playerIdx = currentPlayer - 1;
  let newPos = positions[playerIdx] + roll;
  if (newPos > totalCells) newPos = positions[playerIdx];
  positions[playerIdx] = newPos;
  movePiece(currentPlayer, newPos);

  if (questionPoints.includes(newPos)) {
    askQuestion(currentPlayer);
  } else {
    checkWin(currentPlayer);
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnIndicator.textContent = `Giliran: Pemain ${currentPlayer} ${currentPlayer === 1 ? '🔴' : '🟡'}`;
  }
}

function askQuestion(player) {
  isQuestionActive = true;
  const q = questions[Math.floor(Math.random() * questions.length)];
  questionBox.classList.remove("hidden");
  questionText.textContent = q.question;
  answersDiv.innerHTML = "";

  q.choices.forEach((c, idx) => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = () => answerQuestion(player, idx === q.answer);
    answersDiv.appendChild(btn);
  });

  let timeLeft = 10;
  timerDiv.textContent = `Waktu: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Waktu: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      answerQuestion(player, false);
    }
  }, 1000);
}

function answerQuestion(player, correct) {
  clearInterval(timer);
  if (!correct) {
    alert("Jawaban salah atau waktu habis! Mundur 3 langkah.");
    positions[player - 1] = Math.max(1, positions[player - 1] - 3);
    movePiece(player, positions[player - 1]);
  } else {
    alert("Jawaban benar!");
  }
  questionBox.classList.add("hidden");
  isQuestionActive = false;
  checkWin(player);
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnIndicator.textContent = `Giliran: Pemain ${currentPlayer} ${currentPlayer === 1 ? '🔴' : '🟡'}`;
}

function checkWin(player) {
  if (positions[player - 1] === 100) {
    winnerDiv.textContent = `🎉 Pemain ${player} menang! 🎉`;
    winnerDiv.classList.remove("hidden");
    rollDice.disabled = true;
  }
}

rollDice.onclick = roll;
createBoard();
 
