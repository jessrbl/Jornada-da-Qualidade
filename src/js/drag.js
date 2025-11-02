
  // ==============================
  // Jogo Drag & Drop Mobile
  // ==============================

  let totalTentativas = 0;
  let totalErros = 0;

  let draggedElement = null;
  let originalParent = null;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  // ----------------------
  // Touch Start
  // ----------------------
  function touchStartHandler(ev) {
    draggedElement = ev.target;
    draggedElement.classList.add("dragging");
    originalParent = draggedElement.parentNode;

    const touch = ev.touches[0];
    const rect = draggedElement.getBoundingClientRect();

    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    draggedElement.style.position = "absolute";
    draggedElement.style.zIndex = 1000;
    draggedElement.style.transition = "none";

    draggedElement.style.left = touch.clientX - touchOffsetX + "px";
    draggedElement.style.top = touch.clientY - touchOffsetY + "px";
  }

  // ----------------------
  // Touch Move
  // ----------------------
  function touchMoveHandler(ev) {
    ev.preventDefault();
    const touch = ev.touches[0];

    draggedElement.style.left = touch.clientX - touchOffsetX + "px";
    draggedElement.style.top = touch.clientY - touchOffsetY + "px";
  }

  // ----------------------
  // Touch End
  // ----------------------
  function touchEndHandler(ev) {
    draggedElement.classList.remove("dragging");
    const touch = ev.changedTouches[0];

    // Detecta card sob o dedo
    const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
    let cardEncontrado = elementsAtPoint.find(el => el.classList.contains("card"));

    const draggedId = draggedElement.id;
    totalTentativas++;

    if (cardEncontrado) {
      const aceita = cardEncontrado.dataset.accept?.split(",").map(s => s.trim());
      if (aceita && aceita.includes(draggedId)) {
        // animação suave para o card
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
    touchOffsetX = 0;
    touchOffsetY = 0;

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
  // Eventos touch
  // ----------------------
  const figures = document.querySelectorAll(".draggable");
  figures.forEach(img => {
    img.addEventListener("touchstart", touchStartHandler, { passive: false });
    img.addEventListener("touchmove", touchMoveHandler, { passive: false });
    img.addEventListener("touchend", touchEndHandler);
  });
