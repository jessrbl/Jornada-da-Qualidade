function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

// Adiciona dragstart a todas as figuras
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("dragstart", dragstartHandler);
});

// Adiciona dragover e drop a todos os cards
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  // Permite o drop
  card.addEventListener("dragover", ev => ev.preventDefault());

  // Evento de drop
  card.addEventListener("drop", ev => {
    ev.preventDefault();

    const draggedId = ev.dataTransfer.getData("text/plain");
    
    // Se existir data-accept no card, verifica se a figura é aceita
    const aceita = card.dataset.accept?.split(",").map(s => s.trim());

    if (!aceita || aceita.includes(draggedId)) {
      const img = document.getElementById(draggedId);
      card.appendChild(img);
    } else {
      alert("Figura não corresponde a este card!");
    }
  });
});
