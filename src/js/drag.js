// ==============================
// Jogo Drag & Drop (PC)
// ==============================

let totalTentativas = 0;
let totalErros = 0;

let draggedElement = null;
let originalParent = null;
let offsetX = 0;
let offsetY = 0;

// ----------------------
// Iniciar arraste
// ----------------------
function startDrag(ev) {
  ev.preventDefault();
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
  originalParent = draggedElement.parentNode;

  const clientX = ev.clientX;
  const clientY = ev.clientY;

  const rect = draggedElement.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  draggedElement.style.position = "absolute";
  draggedElement.style.zIndex = 1000;
  draggedElement.style.transition = "none";
  draggedElement.style.left = clientX - offsetX + "px";
  draggedElement.style.top = clientY - offsetY + "px";

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}

// ----------------------
// Mover arraste
// ----------------------
function moveDrag(ev) {
  if (!draggedElement) return;

  const clientX = ev.clientX;
  const clientY = ev.clientY;

  draggedElement.style.left = clientX - offsetX + "px";
  draggedElement.style.top = clientY - offsetY + "px";
}

// ----------------------
// Finalizar arraste
// ----------------------
function endDrag(ev) {
  if (!draggedElement) return;
  draggedElement.classList.remove("dragging");

  const clientX = ev.clientX;
  const clientY = ev.clientY;

  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);

  const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
  let cardEncontrado = elementsAtPoint.find(el => el.classList.contains("card"));

  const draggedId = draggedElement.id;
  totalTentativas++;

  if (cardEncontrado) {
    const aceita = cardEncontrado.dataset.accept?.split(",").map(s => s.trim());
    if (aceita && aceita.includes(draggedId)) {
      draggedElement.style.transition = "all 0.3s";
      cardEncontrado.querySelector(".card-objects").appendChild(draggedElement);
      draggedElement.style.left = "";
      draggedElement.style.top = "";
      draggedElement.style.position = "";
      draggedElement.style.zIndex = "";
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
      resetarFigura(draggedElement);
    }
  } else {
    resetarFigura(draggedElement);
  }

  draggedElement = null;
  offsetX = 0;
  offsetY = 0;

  verificarFinal();
}

// ----------------------
// Resetar figura
// ----------------------
function resetarFigura(fig) {
  fig.style.transition = "all 0.3s";
  originalParent.appendChild(fig);
  fig.style.position = "";
  fig.style.left = "";
  fig.style.top = "";
  fig.style.zIndex = "";
}

// ----------------------
// Verifica fim do jogo
// ----------------------
function verificarFinal() {
  const allCards = document.querySelectorAll(".card");
  const totalFiguras = document.querySelectorAll(".draggable").length;
  let colocadas = 0;
  let acertos = 0;

  allCards.forEach(card => {
    const figuras = card.querySelectorAll(".card-objects .draggable");
    colocadas += figuras.length;
    figuras.forEach(fig => {
      const aceita = card.dataset.accept?.split(",").map(s => s.trim());
      if (aceita && aceita.includes(fig.id)) acertos++;
    });
  });

  if (colocadas === totalFiguras) {
    const percentual = Math.round((acertos / totalTentativas) * 100);
    mostrarResultadoNoObjects(percentual);
  }
}

// ----------------------
// Mostrar resultado + gabarito
// ----------------------
function mostrarResultadoNoObjects(percentual) {
  const objectsContainer = document.querySelector(".objects");
  objectsContainer.innerHTML = "";

  const resultado = document.createElement("div");
  resultado.style.textAlign = "center";
  resultado.style.padding = "20px";
  resultado.style.borderRadius = "12px";
  resultado.style.background = "#f0f0f0";
  resultado.style.width = "100%";

  resultado.innerHTML = `<h2>Você acertou ${percentual}% das tentativas.</h2>
                         <button id="restart-btn">Recomeçar</button>`;

  const btn = resultado.querySelector("#restart-btn");
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

  btn.addEventListener("click", () => {
    totalTentativas = 0;
    totalErros = 0;
    objectsContainer.innerHTML = "";
    const allFigures = document.querySelectorAll(".draggable");
    allFigures.forEach(fig => {
      fig.style.position = "";
      fig.style.left = "";
      fig.style.top = "";
      fig.style.zIndex = "";
      document.querySelector(".objects").appendChild(fig);
    });
  });

  objectsContainer.appendChild(resultado);

  // -----------------------------
  // Mostrar gabarito completo
  // -----------------------------
  const gabaritoDiv = document.createElement("div");
  gabaritoDiv.style.textAlign = "left";
  gabaritoDiv.style.padding = "20px";
  gabaritoDiv.style.borderRadius = "12px";
  gabaritoDiv.style.background = "#f9f9f9";
  gabaritoDiv.style.width = "100%";
  gabaritoDiv.style.marginTop = "20px";

  gabaritoDiv.innerHTML = `<h2>Gabarito 📝</h2>`;

  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    const cardTitle = card.querySelector("h3").textContent;
    const aceitaveis = card.dataset.accept?.split(",").map(s => s.trim()) || [];

    const ul = document.createElement("ul");
    aceitaveis.forEach(id => {
      const figura = document.getElementById(id);
      const nome = figura ? figura.nextElementSibling?.textContent || id : id;
      const li = document.createElement("li");
      li.textContent = nome;
      ul.appendChild(li);
    });

    const cardDiv = document.createElement("div");
    cardDiv.style.marginBottom = "15px";
    cardDiv.innerHTML = `<strong>${cardTitle}:</strong>`;
    cardDiv.appendChild(ul);
    gabaritoDiv.appendChild(cardDiv);
  });

  objectsContainer.appendChild(gabaritoDiv);
}

// ----------------------
// Handlers de mouse
// ----------------------
function mouseMoveHandler(ev) { moveDrag(ev); }
function mouseUpHandler(ev) { endDrag(ev); }

// ----------------------
// Adicionando eventos para figuras
// ----------------------
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("mousedown", ev => startDrag(ev));
});
