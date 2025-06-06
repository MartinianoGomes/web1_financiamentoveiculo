const inputValue = document.querySelector('#value');
const selectBank = document.querySelector('#bank');
const selectMonths = document.querySelector('#months');
const btnSimulator = document.querySelector('#simulator');

const valueInstallment = document.querySelector('.value-installment');
const valueTotal = document.querySelector('.value-total');
const installments = document.querySelector('.installments');
const btnSimulateAgain = document.querySelector('.btn-simulate-again');

const banks = {
    caixa: 1.0487,
    santander: 1.0567,
    bradesco: 1.0532,
    itau: 1.0519,
    nubank: 1.0595,
    inter: 1.0602
};

function formatBRL(num) {
    return Number(num).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}

function formatarCampo(e) {
    const numeric = e.target.value.replace(/\D/g, '');
    if (!numeric) return (e.target.value = '');
    e.target.value = formatBRL(parseFloat(numeric) / 100);
}

function validar() {
    if (!inputValue.value) { alert('Informe o valor do veículo'); inputValue.focus(); return false; }
    if (!selectBank.value) { alert('Selecione um banco'); selectBank.focus(); return false; }
    if (!selectMonths.value) { alert('Selecione o prazo'); selectMonths.focus(); return false; }
    return true;
}

function simular(e) {
    e.preventDefault();
    if (!validar()) return;

    const principal = parseFloat(inputValue.value.replace(/\s|[R$\.]/g, '').replace(',', '.'));
    const months = parseInt(selectMonths.value, 10);
    const bankKey = selectBank.value.toLowerCase();
    const factor = banks[bankKey];

    if (!factor) { alert('Banco inválido.'); return; }

    const rate = factor - 1;
    const installment = (principal * rate) / (1 - Math.pow(1 + rate, -months));
    const total = installment * months;

    localStorage.setItem('installment', installment.toString());
    localStorage.setItem('total', total.toString());
    localStorage.setItem('months', months.toString());

    window.location.href = 'pages/result.html';
}

function carregarResultados() {
    if (!valueInstallment || !valueTotal || !installments) return;

    const installment = localStorage.getItem('installment');
    const total = localStorage.getItem('total');
    const months = localStorage.getItem('months');

    if (!(installment && total && months)) {
        valueInstallment.textContent = '‑‑';
        valueTotal.textContent = '‑‑';
        installments.textContent = 'Dados não encontrados.';
        return;
    }

    valueInstallment.textContent = formatBRL(installment);
    valueTotal.textContent = formatBRL(total);
    installments.textContent = `* Financiamento em ${months} meses`;
}

function botaoVoltar() {
    if (!btnSimulateAgain) return;
    btnSimulateAgain.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (inputValue && btnSimulator) {
        inputValue.addEventListener('input', formatarCampo);
        btnSimulator.addEventListener('click', simular);
    }

    carregarResultados();
    botaoVoltar();
});
