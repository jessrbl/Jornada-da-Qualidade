// Contadores para tentativas e erros
let totalTentativas = 0;
let totalErros = 0;

// Manipuladores de drag
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

// Calcula percentual de acertos baseado em tentativas
function calcularAcertos() {
  const acertos = totalTentativas - totalErros;
  const percentual = totalTentativas === 0 ? 0 : Math.round((acertos / totalTentativas) * 100);
  return percentual;
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
    resultadoTexto.innerHTML = `<h2>Parabéns! 🎉</h2><p>Você acertou ${percentual}% das tentativas.</p>`;
  } else {
    resultadoTexto.innerHTML = `<h2>Ops!</h2><p>Você acertou apenas ${percentual}% das tentativas.</p>
    <button id="restart-btn">Recomeçar</button>`;

    const btn = resultadoTexto.querySelector("#restart-btn");
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "15px";

    btn.addEventListener("mouseover", () => btn.style.backgroundColor = "#45a049");
    btn.addEventListener("mouseout", () => btn.style.backgroundColor = "#4CAF50");

    btn.addEventListener("click", () => location.reload());
  }

  objectsContainer.appendChild(resultadoTexto);
}

// Verifica se todas as figuras estão em algum card
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

    // Conta tentativa
    totalTentativas++;

    if (!aceita || aceita.includes(draggedId)) {
      // Figura correta: entra no card
      card.querySelector(".card-objects").appendChild(img);
    } else {
      // Figura errada: conta erro
      totalErros++;
      alert("Figura não corresponde a este card!");
    }

    verificarFinal();
  });
});
