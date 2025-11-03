// ==============================
// Jogo Drag & Drop (PC + Mobile)
// ==============================

let totalTentativas = 0;
let totalErros = 0;

let draggedElement = null;
let originalParent = null;
let offsetX = 0;
let offsetY = 0;

// ----------------------
// Função para iniciar arraste
// ----------------------
function startDrag(ev, isTouch) {
  ev.preventDefault();
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
  originalParent = draggedElement.parentNode;

  let clientX, clientY;
  if (isTouch) {
    clientX = ev.touches[0].clientX;
    clientY = ev.touches[0].clientY;
  } else {
    clientX = ev.clientX;
    clientY = ev.clientY;
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  const rect = draggedElement.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  draggedElement.style.position = "absolute";
  draggedElement.style.zIndex = 1000;
  draggedElement.style.transition = "none";

  draggedElement.style.left = clientX - offsetX + "px";
  draggedElement.style.top = clientY - offsetY + "px";
}

// ----------------------
// Função para mover arraste
// ----------------------
function moveDrag(ev, isTouch) {
  ev.preventDefault();
  if (!draggedElement) return;

  let clientX, clientY;
  if (isTouch) {
    clientX = ev.touches[0].clientX;
    clientY = ev.touches[0].clientY;
  } else {
    clientX = ev.clientX;
    clientY = ev.clientY;
  }

  draggedElement.style.left = clientX - offsetX + "px";
  draggedElement.style.top = clientY - offsetY + "px";
}

// ----------------------
// Função para finalizar arraste
// ----------------------
function endDrag(ev, isTouch) {
  if (!draggedElement) return;
  draggedElement.classList.remove("dragging");

  let clientX, clientY;
  if (isTouch) {
    clientX = ev.changedTouches[0].clientX;
    clientY = ev.changedTouches[0].clientY;
  } else {
    clientX = ev.clientX;
    clientY = ev.clientY;
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

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
// Resetar figura para container original
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
// Mostrar resultado dentro de .objects
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

  if (percentual >= 70) {
    resultado.innerHTML = `<h2>Parabéns! 🎉</h2><p>Você acertou ${percentual}% das tentativas.</p>`;
  } else {
    resultado.innerHTML = `<h2>Ops!</h2><p>Você acertou apenas ${percentual}% das tentativas.</p>
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
  }

  objectsContainer.appendChild(resultado);
}

// ----------------------
// Handlers específicos para mouse
// ----------------------
function mouseMoveHandler(ev) { moveDrag(ev, false); }
function mouseUpHandler(ev) { endDrag(ev, false); }

// ----------------------
// Adicionando eventos para todas as figuras
// ----------------------
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  // Mobile
  img.addEventListener("touchstart", ev => startDrag(ev, true), { passive: false });
  img.addEventListener("touchmove", ev => moveDrag(ev, true), { passive: false });
  img.addEventListener("touchend", ev => endDrag(ev, true));

  // PC
  img.addEventListener("mousedown", ev => startDrag(ev, false));
});
