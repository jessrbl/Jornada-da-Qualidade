// Set para registrar figuras que já erraram
const figurasErradas = new Set();

function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.target.classList.add("dragging");
}

function dragendHandler(ev) {
  ev.target.classList.remove("dragging");
}

// Seleciona todas as figuras
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("dragstart", dragstartHandler);
  img.addEventListener("dragend", dragendHandler);
});

// IDs corretos por card
const respostasCorretas = {
  "pink": ["llis", "pure-moist", "lente", "termometro", "band-aid"],
  "blue": ["pasta-de-dente", "protetor", "perfume"],
  "gray": ["aspirina", "soro"],
  "cyan": ["alcool", "aromatizante"]
};

// Calcula percentual de acertos considerando erros
function calcularAcertos() {
  let acertos = 0;
  let total = 0;

  Object.keys(respostasCorretas).forEach(cor => {
    const card = document.querySelector(`.card.${cor} .card-objects`);
    const imgs = Array.from(card.querySelectorAll("img"));

    imgs.forEach(img => {
      total++;
      if (respostasCorretas[cor].includes(img.id) && !figurasErradas.has(img.id)) {
        acertos++;
      }
    });
  });

  return Math.round((acertos / total) * 100);
}

// Mostrar resultado dentro do container .objects
function mostrarResultadoNoObjects(percentual) {
  const objectsContainer = document.querySelector(".objects");
  objectsContainer.innerHTML = ""; // limpa figuras

  const resultadoTexto = document.createElement("div");
  resultadoTexto.style.textAlign = "center";
  resultadoTexto.style.padding = "20px";
  resultadoTexto.style.borderRadius = "12px";
  resultadoTexto.style.background = "#f0f0f0";
  resultadoTexto.style.width = "100%";

  if (percentual >= 70) {
    resultadoTexto.innerHTML = `<h2>Parabéns! 🎉</h2><p>Você acertou ${percentual}% das figuras.</p>`;
  } else {
    resultadoTexto.innerHTML = `<h2>Ops!</h2><p>Você acertou apenas ${percentual}% das figuras.</p>
    <button id="restart-btn">Recomeçar</button>`;
    resultadoTexto.querySelector("#restart-btn").addEventListener("click", () => location.reload());
  }

  objectsContainer.appendChild(resultadoTexto);
}

// Verifica se todas as figuras foram colocadas em algum card
function verificarFinal() {
  const todasFiguras = document.querySelectorAll(".draggable");
  let todasEmCards = true;

  todasFiguras.forEach(img => {
    if (!img.parentElement.classList.contains("card-objects")) {
      todasEmCards = false;
    }
  });

  if (todasEmCards) {
    const percentual = calcularAcertos();
    mostrarResultadoNoObjects(percentual);
  }
}

// Eventos de drop
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.addEventListener("dragover", ev => ev.preventDefault());

  card.addEventListener("drop", ev => {
    ev.preventDefault();
    const draggedId = ev.dataTransfer.getData("text/plain");
    const aceita = card.dataset.accept?.split(",").map(s => s.trim());
    const img = document.getElementById(draggedId);

    // Figura é aceita no card
    if (!aceita || aceita.includes(draggedId)) {
      card.querySelector(".card-objects").appendChild(img);
    } else {
      // Conta como erro
      figurasErradas.add(draggedId);
      card.querySelector(".card-objects").appendChild(img); // ainda entra no card
      alert("Figura não corresponde a este card!");
    }

    verificarFinal();
  });
});
