// Descrições de cada card
const descriptions = {
  "DISPOSITIVOS MÉDICOS": `
    <div class="card-content">
      <p><strong>Dispositivo Médico</strong> é qualquer instrumento, aparelho, equipamento, implante, 
      dispositivo para diagnóstico in vitro, software, material ou outro artigo destinado pelo fabricante 
      a ser utilizado, isoladamente ou em conjunto, em seres humanos, para algum dos seguintes propósitos médicos específicos:</p>
      <ul>
        <li>Diagnóstico, prevenção, monitoramento, tratamento ou alívio de uma doença;</li>
        <li>Diagnóstico, monitoramento, tratamento ou reparação de uma lesão ou deficiência;</li>
        <li>Investigação, substituição ou modificação da anatomia, ou de um processo/estado fisiológico ou patológico;</li>
        <li>Suporte ou manutenção da vida;</li>
        <li>Controle ou apoio à concepção;</li>
        <li>Fornecimento de informações por meio de exame in vitro de amostras provenientes do corpo humano, incluindo doações de órgãos e tecidos.</li>
      </ul>
      <p class="note"><em> A principal ação pretendida não deve ser alcançada por meios farmacológicos, imunológicos ou metabólicos, 
      embora possa ser auxiliada por esses meios.</em></p>
      <p class="ref"><strong>Referência:</strong> Resolução RDC nº 751, de 15 de setembro de 2022.</p>
    </div>
  `,
  "COSMÉTICOS": `
    <div class="card-content">
      <p><strong>Cosméticos</strong> são
preparações constituídas por substâncias naturais ou sintéticas,
de uso externo nas diversas partes do corpo humano, pele,
sistema capilar, unhas, lábios, órgãos genitais externos, dentes
e membranas mucosas da cavidade oral, com o objetivo
exclusivo ou principal de limpá-los, perfumá-los, alterar sua
aparência e ou corrigir odores corporais e ou protegê-los ou
mantê-los em bom estado</p>
      <p class="ref"><strong>Referência:</strong> Resolução RDC nº 752, de 19 de setembro de 2022.</p>
    </div>
  `,
  "MEDICAMENTOS": `
    <div class="card-content">
      <p><strong>Medicamentos</strong> são produtos farmacêuticos, tecnicamente obtidos ou
elaborados, com finalidade profilática, curativa, paliativa ou para
fins de diagnóstico.</p>
      <p class="ref"><strong>Referência:</strong> Lei Nº. 5.991, de 17 de dezembro de 1973</p>


    </div>
  `,
  "SANEANTES": `
    <div class="card-content">
      <p><strong> Saneantes </strong> domissanitários
são “substâncias ou preparações destinadas à higienização,
desinfecção ou desinfestação domiciliar, em ambientes
coletivos e/ou públicos, em lugares de uso comum e no
tratamento da água”. Também podem ser definidos como 
“substâncias ou preparações destinadas à
aplicação em objetos, tecidos, superfícies inanimadas e
ambientes, com finalidade de limpeza e afins, desinfecção,
desinfestação, sanitização, desodorização e odorização, além
de desinfecção de água para o consumo humano,
hortifrutícolas e piscinas”.</p>
      <p class="ref"><strong>Referência:</strong> Lei nº. 6.360/1976 e RDC nº. 59/2010</p>
    </div>
  `
};

document.querySelectorAll(".card").forEach(card => {
  // Guarda o título original no atributo data-titulo
  const titulo = card.querySelector("h3").textContent;
  card.setAttribute("data-titulo", titulo);

  card.addEventListener("click", () => {
    // Verifica se o card está mostrando o título ou a descrição
    const temConteudo = card.querySelector(".card-content");

    if (temConteudo) {
      // Se está mostrando a descrição, volta para o título
      card.innerHTML = `<h3>${card.getAttribute("data-titulo")}</h3>`;
    } else {
      // Se está mostrando o título, mostra a descrição
      card.innerHTML = descriptions[card.getAttribute("data-titulo")];
    }
  });
});