// Dados (copiados do main.py, mantive exatamente as perguntas e explicações)
const questions = {
  "Geografia": [
    {"question":"Qual a capital do Brasil?","options":["Brasília","São Paulo","Rio de Janeiro","Salvador"],"answer":"Brasília","explanation":"A capital do Brasil é Brasília, fundada em 1960, onde fica o governo federal."},
    {"question":"Qual o maior país do mundo em território?","options":["Rússia","Canadá","China","EUA"],"answer":"Rússia","explanation":"A Rússia é o maior país do mundo em área territorial."},
    {"question":"Qual a capital dos Estados Unidos?","options":["New York","Washington D.C.","Califórnia","Texas"],"answer":"Washington D.C.","explanation":"Whashington é a capital dos Estados Unido da América."},
    {"question":"Qual o maior continente do mundo?","options":["América do Sul","Ásia","Oceania","Africa"],"answer":"Ásia","explanation":"A Ásia é o continente mais extenso."},
    {"question":"Qual o maior oceano da terra?","options":["Atlântico","Pacífico","Índico","Mar Morto"],"answer":"Pacífico","explanation":"Ele é maior que todos os outros oceanos"},
    {"question":"O Brasil fica em qual continente?","options":["Africa","Oceania","América do Norte","América do Sul"],"answer":"América do Sul","explanation":"O Brasil está na parte sul das Américas."},
    {"question":"Qual o rio mais extenso do Mundo?","options":["Rio Tietê","Rio Nilo","Rio Amazonas","Rio Senna"],"answer":"Rio Amazonas","explanation":"Ele passa pelo Brasil e em extensão de água, é o maior do mundo."},
    {"question":"Qual pais tem formato parecido com a de uma bota?","options":["Chile","China","Itália","França"],"answer":"Itália","explanation":"No mapa, a Itália parece uma bota"},
    {"question":"Qual é o deserto mais famoso do mundo?","options":["Deserto do Saara","Deserto do Atacama","Deserto de Gobi","Deserto da Arábia"],"answer":"Deserto do Saara","explanation":"Ele é enorme e fica na África"},
    {"question":"O que cobre a maior parte da Terra: Água ou Terra?","options":["Água","Terra"],"answer":"Água","explanation":"Cerca de 70% do planeta é Água"},
    {"question":"Qual a maior montanha do Mundo?","options":["Monte Everest","Monte Fuji","Cordilheira dos Andes","Monte Kilimanjaro"],"answer":"Monte Everest","explanation":"Ele fica na Ásia e é o mais alto do mundo"},
    {"question":"Qual é a Capital da Argentina?","options":["Buenos Aires","Bariloche","Mendonza","Ushuaia"],"answer":"Buenos Aires","explanation":"É a principal cidade do pais vizinho"}
  ],
  "Ciências":[
    {"question":"Qual planeta é conhecido como planeta vermelho?","options":["Marte","Júpiter","Vênus","Saturno"],"answer":"Marte","explanation":"Marte é chamado de planeta vermelho por causa do óxido de ferro em sua superfície."},
    {"question":"Qual astro é chamado de astro rei no nosso sistema solar?","options":["Sol","Vênus","Jupter","Lua"],"answer":"Sol","explanation":"O Sol é a estrela que ilumina e aquece a terra"},
    {"question":"Quantos planetas temos no nosso sistema solar?","options":["12","8","10","9"],"answer":"8","explanation":"São: Mercurio, Vênus, Terra, Marte, Júpter, Saturno, Urano e Netuno."},
    {"question":"Qual planeta em que vivemos, e quantas luas possui?","options":["Terra, 5","Marte, 1","Jupter, 3","Terra, 1"],"answer":"Terra, 1","explanation":"Terra, com apenas uma lua orbitando"},
    {"question":"Do que os peixes precisam para respirar?","options":["Oxigênio","Gás Carbonico","Nitrogenio","Gás Hélio"],"answer":"Oxigênio","explanation":"Eles respiram o oxigenio dissolvido na água"},
    {"question":"Qual parte do corpo humano é responsavel por bombear o sangue?","options":["Cérebro","Rim","Coração","Pulmão"],"answer":"Coração","explanation":"Ele funciona como uma bomba que nunca para"},
    {"question":"Do que as plantas NÃO PRECISAM para fazer a fotossintese?","options":["Luz do Sol","Água","Gás Carbonico","Fertilizantes"],"answer":"Fertilizantes","explanation":"Não é necessario fertilizantes para que a planta faça a fotossintese"},
    {"question":"Qual o maior orgão do corpo Humano?","options":["Olho","Intestino","Pele","Pancreas"],"answer":"Pele","explanation":"Ela cobre todo o nosso corpo e nos protege contra doenças."},
    {"question":"A água ferve a quantos graus celcius?","options":["200°C","75°C","100°C","100°F"],"answer":"100°C","explanation":"Essa é a temperatura em que vira vapor"},
    {"question":"Qual o maior animal do Mundo?","options":["Baleia Azul","Tigre","Elefante","Girafa"],"answer":"Baleia Azul","explanation":"Machos dessa especie ja foram registrados com mais de 30m de comprimento."},
    {"question":"O que usamos para respirar e qual gás é necessario para isso?","options":["Pulmão, Gás Nitrogenio","Pulmão, Gás Oxigenio","Traqueia, Gás Hidrogenio","Boca, Gás Oxigenio"],"answer":"Pulmão, Gás Oxigenio","explanation":"Pulmão é o orgão responsavel pela nossa respiração e sem o gás oxigenio, não conseguimos respirar."}
  ],
  "Matemática":[
    {"question":"Quanto é 7 x 8?","options":["56","64","48","54"],"answer":"56","explanation":"7 vezes 8 é igual a 56."},
    {"question":"Quanto é 6 x 7?","options":["42","35","44","50"],"answer":"42","explanation":"multiplicar é somar varias vezes: 6 + 6 + 6 + 6 + 6 + 6 + 6 = 42"},
    {"question":"Se tenho 48 balas e divido igualmente entre 8 amigos, cada um fica com quantas balas?","options":["4","3","6","8"],"answer":"6","explanation":"48 ÷ 8 = 6"},
    {"question":"Quanto é 35 ÷ 5?","options":["6","7","4","5"],"answer":"7","explanation":"É como perguntar quantas vezes o 5 cabe dentro do 35"},
    {"question":"Qual é o resultado de 12 x 9?","options":["108","100","98","140"],"answer":"108","explanation":"12 vezes 9 dá 108. Uma dica: 12 × 10 = 120, depois tira 12 → 108."},
    {"question":"Se uma pizza tem 12 fatias e 4 crianças vão dividir igualmente, quantas fatias cada uma vai comer?","options":["4","3","2","6"],"answer":"3","explanation":"12 ÷ 4 = 3 fatias para cada criança."},
    {"question":"Qual é a metade de 144?","options":["72","77","75","73"],"answer":"72","explanation":"Metade é dividir por 2 → 144 ÷ 2 = 72."},
    {"question":"Um pacote tem 96 figurinhas e Pedro quer guardar em 12 caixas iguais. Quantas figurinhas vão em cada caixa?","options":["8","10","7","9"],"answer":"8","explanation":"96 ÷ 12 = 8."},
    {"question":"Quanto é 9 × 9?","options":["81","88","83","84"],"answer":"81","explanation":"A tabuada do 9 termina em 81 nesse caso."},
    {"question":"Quanto é 25 x 4?","options":["120","100","255","101"],"answer":"100","explanation":"25 + 25 + 25 + 25 = 100"},
    {"question":"Se João tem R$ 60 e compra 5 brinquedos iguais, quanto custou cada brinquedo?","options":["R$12","R$5","R$30","R$3"],"answer":"R$12","explanation":"60 ÷ 5 = 12."}
  ],
  "História":[
    {"question":"Quem foi o primeiro presidente do Brasil?","options":["Marechal Deodoro da Fonseca","Getúlio Vargas","Dom Pedro II","Floriano Peixoto"],"answer":"Marechal Deodoro da Fonseca","explanation":"Marechal Deodoro da Fonseca foi o primeiro presidente após a Proclamação da República."},
    {"question":"Quem foi o presidente do Brasil nos anos de 1956 - 1961?","options":["Gentúlio Vargas","Juscelino Kubitschek","Jânio Quadros","Castello Branco"],"answer":"Juscelino Kubitschek","explanation":"Assumiu sua prescidencia na data de 31 de Janeiro de 1956 e saio do mantado na data de 31 de Janeiro de 1961."},
    {"question":"Quem foi o descobridor do Brasil em 1500?","options":["Pedro Álvares Cabral","Dom Pedro II","Cristóvão Colombo","Dom Pedro I"],"answer":"Pedro Álvares Cabral","explanation":"Ele chegou ao Brasil com suas caravelas"},
    {"question":"Quem foi a princesa que assinou a Lei Áurea, libertando os escravos?","options":["Princesa Isabel","Rainha Elizabeth","Princesa Dayana","Princesa Charlotte"],"answer":"Princesa Isabel","explanation":"Em 1888, ela assinou a lei"},
    {"question":"Qual civilização construiu as pirâmides do deserto?","options":["Egípicios","Incas","Maias","Astecas"],"answer":"Egípicios","explanation":"As piramides eram túmulos para os faraós"},
    {"question":"Quem foi o grande líder da independência do Brasil em 1822?","options":["Dom Pedro I","Dom Pedro II","Maria Leopoldina","Maria Quitéria"],"answer":"Dom Pedro I","explanation":"Ele gritou “Independência ou Morte!” no Ipiranga."},
    {"question":"Quem pintou o famoso quadro da Monalisa e onde ele está sendo exposto?","options":["Leonardo da Vinci, Museu do Louvre","Michelangelo, Metropolitan Museum of Art","Sandro Botticelli, Museu Hermitage","Caravaggio, Museu do Vaticano"],"answer":"Leonardo da Vinci, Museu do Louvre","explanation":"Ele foi um artista do Renascimento e sua obra esta na França, sendo expostra no Museo do Louvre"},
    {"question":"Qual povo inventou a escrita?","options":["Sumérios","Romanos","Egipicios","Japoneses"],"answer":"Sumérios","explanation":"Eles criaram a escrita cuneiforme"},
    {"question":"Quem foi o herói grego famoso pela sua força?","options":["Hércules","Ades","Platão","Zeus"],"answer":"Hércules","explanation":"Ele fazia os 12 trabalhos da mitologia"},
    {"question":"Quem foi o grande líder negro da África do Sul que lutou contra o racismo?","options":["Nelson Mandela","Barack Obama","Osama Bin Laden","Roosevelt"],"answer":"Nelson Mandela","explanation":"Ele lutou contra o Apartheid"},
    {"question":"Quem foi o inventor da lampada elétrica?","options":["Thomas Edson","Albert Einstein","Nikola Tesla","Robert Oppenheimer"],"answer":"Thomas Edson","explanation":"Ele ajudou a iluminar o mundo"}
  ]
};

// --- utilidades ---
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// --- elementos DOM ---
const startScreen = document.getElementById('start-screen');
const categoryButtons = document.getElementById('category-buttons');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');

const questionCountEl = document.getElementById('question-count');
const timerEl = document.getElementById('timer');
const questionBox = document.getElementById('question-box');
const optionsEl = document.getElementById('options');

const scoreText = document.getElementById('score-text');
const timeText = document.getElementById('time-text');
const reviewContent = document.getElementById('review-content');
const restartBtn = document.getElementById('restart-btn');

// --- estado do jogo ---
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];
let startTime = 0;
let timerInterval = null;

// --- criar botões de categoria ---
const categoryList = Object.keys(questions).concat(['Misturado']);
categoryList.forEach(cat => {
  const btn = document.createElement('button');
  btn.textContent = cat;
  btn.addEventListener('click', () => startGame(cat));
  categoryButtons.appendChild(btn);
});

// --- iniciar jogo ---
function startGame(category) {
  // selecionar perguntas
  if (category === 'Misturado') {
    selectedQuestions = [];
    Object.values(questions).forEach(arr => selectedQuestions.push(...arr));
  } else {
    selectedQuestions = questions[category].slice();
  }
  shuffle(selectedQuestions);
  // limitar a 10
  selectedQuestions = selectedQuestions.slice(0, 10);

  // estado
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  startTime = Date.now();

  // UI
  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  showQuestion();
  startTimer();
}

function showQuestion() {
  if (currentQuestion >= selectedQuestions.length) {
    endGame();
    return;
  }
  const q = selectedQuestions[currentQuestion];
  questionCountEl.textContent = `Pergunta ${currentQuestion + 1} / ${selectedQuestions.length}`;
  questionBox.textContent = q.question;

  // preparar opções (embaralhar)
  const opts = q.options.slice();
  shuffle(opts);

  // limpar
  optionsEl.innerHTML = '';

  // criar botões conforme número de opções (pode ser 2 a 4)
  opts.forEach(optText => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optText;
    btn.addEventListener('click', () => handleAnswer(btn, optText, q));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(btn, selected, question) {
  // desabilitar todas
  const btns = Array.from(optionsEl.querySelectorAll('button'));
  btns.forEach(b => b.disabled = true);

  // marcar certo e errado
  btns.forEach(b => {
    if (b.textContent === question.answer) {
      b.classList.add('correct');
    }
  });

  if (selected === question.answer) {
    score++;
  } else {
    btn.classList.add('wrong');
    wrongAnswers.push({
      question: question.question,
      chosen: selected,
      correct: question.answer,
      explanation: question.explanation
    });
  }

  currentQuestion++;
  // ir para a próxima após 1.5s
  setTimeout(() => {
    showQuestion();
  }, 1500);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `Tempo: ${elapsed}s`;
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  quizScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  scoreText.textContent = `Pontuação: ${score} / ${selectedQuestions.length}`;
  timeText.textContent = `Tempo total: ${elapsed}s`;

  // preencher revisão
  reviewContent.innerHTML = '';
  if (wrongAnswers.length === 0) {
    const p = document.createElement('p');
    p.style.color = 'green';
    p.textContent = 'Parabéns! Você acertou todas! 🎉';
    reviewContent.appendChild(p);
  } else {
    const title = document.createElement('p');
    title.style.color = 'red';
    title.textContent = 'Revisão dos erros:';
    reviewContent.appendChild(title);

    wrongAnswers.forEach(w => {
      const div = document.createElement('div');
      div.className = 'review-item';
      const pq = document.createElement('p'); pq.textContent = `P: ${w.question}`; div.appendChild(pq);
      const ps = document.createElement('p'); ps.textContent = `   Sua resposta: ${w.chosen}`; ps.style.color = 'red'; div.appendChild(ps);
      const pc = document.createElement('p'); pc.textContent = `   Correta: ${w.correct}`; pc.style.color = 'green'; div.appendChild(pc);
      const pe = document.createElement('p'); pe.textContent = `   Explicação: ${w.explanation}`; div.appendChild(pe);
      reviewContent.appendChild(div);
    });
  }
}

// reiniciar
restartBtn.addEventListener('click', () => {
  endScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  // reset timer display
  timerEl.textContent = 'Tempo: 0s';
});
