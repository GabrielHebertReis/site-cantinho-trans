// Para adicionar eventos, preencha a const EVENTOS com por ex:
// { data: "2026-12-05", titulo: "Encontro mensal", descricao: "Praça tal, 15h" }
const EVENTOS = [];

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
               "agosto", "setembro", "outubro", "novembro", "dezembro"];
const ABREV = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

const hoje = new Date();
let atual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

const pad = (n) => String(n).padStart(2, "0");

function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
}

function desenharCalendario() {
    const ano = atual.getFullYear();
    const mes = atual.getMonth();
    document.getElementById("mes-atual").textContent = MESES[mes] + " " + ano;

    const grade = document.getElementById("dias");
    grade.innerHTML = "";

    ["D", "S", "T", "Q", "Q", "S", "S"].forEach((d) => grade.appendChild(criar("div", "dow", d)));

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) grade.appendChild(criar("div"));

    for (let d = 1; d <= totalDias; d++) {
        const chave = ano + "-" + pad(mes + 1) + "-" + pad(d);
        const dia = criar("div", "dia", d);
        if (EVENTOS.some((e) => e.data === chave)) dia.classList.add("evento");
        if (ano === hoje.getFullYear() && mes === hoje.getMonth() && d === hoje.getDate()) {
            dia.classList.add("hoje");
        }
        grade.appendChild(dia);
    }
}

function desenharLista() {
    if (!EVENTOS.length) return; // cards de exemplo 

    const limite = hoje.getFullYear() + "-" + pad(hoje.getMonth() + 1) + "-" + pad(hoje.getDate());
    const proximos = EVENTOS
        .filter((e) => e.data >= limite)
        .sort((a, b) => (a.data < b.data ? -1 : 1))
        .slice(0, 4);

    const lista = document.getElementById("lista-eventos");
    lista.innerHTML = "";

    proximos.forEach((e) => {
        const [, m, d] = e.data.split("-");
        const item = criar("article", "item-evento");
        const data = criar("div", "data-evento");
        data.appendChild(criar("small", "", ABREV[Number(m) - 1]));
        data.appendChild(criar("span", "", d));
        const texto = criar("div");
        texto.appendChild(criar("h3", "", e.titulo));
        texto.appendChild(criar("p", "", e.descricao || ""));
        item.appendChild(data);
        item.appendChild(texto);
        lista.appendChild(item);
    });
}

document.getElementById("mes-anterior").addEventListener("click", () => {
    atual.setMonth(atual.getMonth() - 1);
    desenharCalendario();
});

document.getElementById("mes-proximo").addEventListener("click", () => {
    atual.setMonth(atual.getMonth() + 1);
    desenharCalendario();
});

desenharCalendario();
desenharLista();
