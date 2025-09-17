const board = document.getElementById("game-board");
const playerNameInput = document.getElementById("playerName");
const levelSelect = document.getElementById("level");
const menuSection = document.getElementById("menu");
const gameSection = document.getElementById("game");
const winModal = document.getElementById("winModal");
const winMessage = document.getElementById("winMessage");

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let currentLevel = "easy";

// Rankings separados
let rankings = { easy: [], medium: [], hard: [] };

const colors = [
  { name: "Red", color: "red" },
  { name: "Blue", color: "blue" },
  { name: "Green", color: "green" },
  { name: "Yellow", color: "yellow" },
  { name: "Purple", color: "purple" },
  { name: "Orange", color: "orange" },
  { name: "Pink", color: "pink" },
  { name: "Brown", color: "brown" },
  { name: "Black", color: "black" },
  { name: "White", color: "white" },
];

const numbers = [
  { num: "1", name: "One" }, { num: "2", name: "Two" },
  { num: "3", name: "Three" }, { num: "4", name: "Four" },
  { num: "5", name: "Five" }, { num: "6", name: "Six" },
  { num: "7", name: "Seven" }, { num: "8", name: "Eight" },
  { num: "9", name: "Nine" }, { num: "10", name: "Ten" }
];

function generateDeck(level) {
  let deck = [];
  if (level === "easy") {
    colors.forEach(c => deck.push(
      { type: "color", value: c.color, text: "" },
      { type: "color", value: c.color, text: c.name }
    ));
  } else if (level === "medium") {
    numbers.forEach(n => deck.push(
      { type: "number", value: n.num, text: "" },
      { type: "number", value: n.num, text: n.name }
    ));
  } else {
    const mixed = colors.slice(0,5).flatMap(c => [{type:"color",value:c.color,text:""},{type:"color",value:c.color,text:c.name}])
      .concat(numbers.slice(0,5).flatMap(n => [{type:"number",value:n.num,text:""},{type:"number",value:n.num,text:n.name}]));
    deck = mixed;
  }
  return shuffle(deck);
}

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function startGame() {
  const player = playerNameInput.value.trim();
  if (!player) { alert("Digite seu nome!"); return; }

  currentLevel = levelSelect.value;
  moves = 0;
  board.innerHTML = "";
  let deck = generateDeck(currentLevel);

  deck.forEach(cardData => {
    const card = document.createElement("div");
    card.className = "card w-24 h-24";
    card.dataset.value = cardData.value;

    card.innerHTML = `
      <div class="inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back flex justify-center items-center text-lg font-bold"
             style="${cardData.type==='color'?`background:${cardData.value}`:'background:#475569'}">
          ${cardData.text || cardData.value}
        </div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });

  menuSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flip")) return;
  card.classList.add("flip");
  if (!firstCard) firstCard = card;
  else { secondCard = card; moves++; checkMatch(); }
}

function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;
  if (isMatch) {
    resetTurn();
    if (document.querySelectorAll(".card:not(.flip)").length === 0) saveRanking();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() { [firstCard, secondCard, lockBoard] = [null, null, false]; }

function saveRanking() {
  const player = playerNameInput.value.trim();
  rankings[currentLevel].push({ name: player, moves });
  rankings[currentLevel].sort((a,b)=>a.moves-b.moves);
  rankings[currentLevel] = rankings[currentLevel].slice(0,5);
  updateRanking();
  winMessage.textContent = `${player}, você venceu em ${moves} jogadas!`;
  winModal.classList.remove("hidden");
}

function updateRanking() {
  ["easy","medium","hard"].forEach((level)=>{
    const list = document.getElementById(`ranking-list-${level}`);
    list.innerHTML = "";
    rankings[level].forEach((r,i)=>{
      const li = document.createElement("li");
      li.textContent = `${r.name} - ${r.moves} jogadas`;
      if(i===0) li.classList.add("text-yellow-400","font-bold");
      else if(i===1) li.classList.add("text-gray-300","font-semibold");
      else if(i===2) li.classList.add("text-yellow-700","font-semibold");
      list.appendChild(li);
    });
  });
}

function showRanking(level) {
  document.querySelectorAll(".ranking-list").forEach(div=>div.classList.add("hidden"));
  document.getElementById(`ranking-${level}`).classList.remove("hidden");
}

function closeModal() {
  winModal.classList.add("hidden");
  gameSection.classList.add("hidden");
  menuSection.classList.remove("hidden");
}

updateRanking();
