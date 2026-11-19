const form = document.getElementById('formInscricao');
const nascimento = document.getElementById('nascimento');
const sucesso = document.getElementById('mensagemSucesso');
const apenasNumeros = valor => valor.replace(/\D/g, '');
const campo = id => document.getElementById(id);
function cpfValido(valor) {
    const cpf = apenasNumeros(valor);
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
    for (let pos = 9; pos <= 10; pos++) {
        let soma = 0;
        for (let i = 0; i < pos; i++) soma += Number(cpf[i]) * (pos + 1 - i);
        const digito = (soma * 10) % 11;
        if (Number(cpf[pos]) !== (digito === 10 ? 0 : digito)) return false;
    }
    return true;
}
function idadeEmAnos(data) {
    if (!data) return null;
    const hoje = new Date();
    const n = new Date(data + 'T12:00:00');
    if (Number.isNaN(n.getTime()) || n > hoje) return null;
    let idade = hoje.getFullYear() - n.getFullYear();
    if (hoje.getMonth() < n.getMonth() || (hoje.getMonth() === n.getMonth() && hoje.getDate() < n.getDate())) idade--;
    return idade;
}
function formatarTelefone(v) {
    const x = apenasNumeros(v).slice(0, 11);
    if (x.length <= 2) return x ? '(' + x : '';
    return '(' + x.slice(0, 2) + ') ' + (x.length > 10 ? x.slice(2, 7) : x.slice(2, 6)) + (x.length > 10 ? (x.length > 7 ? '-' + x.slice(7) : '') : (x.length > 6 ? '-' + x.slice(6) : ''));
}
function atualizarResponsavel() {
    const idade = idadeEmAnos(nascimento.value), obrigatorio = idade !== null && idade < 18;
    document.querySelectorAll('.responsavel').forEach(el => { el.required = obrigatorio; });
    campo('asteriscoResponsavel').textContent = obrigatorio ? '*' : '';
    campo('asteriscoTelefoneResponsavel').textContent = obrigatorio ? '*' : '';
    campo('asteriscoParentesco').textContent = obrigatorio ? '*' : '';
    campo('ajudaResponsavel').textContent = idade === null ? 'Informe a data de nascimento para verificar se os dados do responsável são obrigatórios.' : obrigatorio ? 'O estudante é menor de 18 anos: informe nome, WhatsApp e tipo de parentesco do responsável.' : 'O estudante tem 18 anos ou mais: nome, WhatsApp e parentesco do responsável são opcionais.';
}


document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formInscricao");

    const preenchimento = document.getElementById("progressoPreenchimento");
    const texto = document.getElementById("progressoTexto");
    const camposTexto = document.getElementById("progressoCampos");
    const trilho = document.getElementById("progressoTrilho");

    if (!formulario || !preenchimento) return;

    function atualizarProgresso() {

        // Busca todos os campos obrigatórios
        const camposObrigatorios = Array.from(
            formulario.querySelectorAll("input, select, textarea")
        ).filter(campo =>
            campo.required &&
            !campo.disabled &&
            campo.type !== "hidden"
        );

        const total = camposObrigatorios.length;

        // Verifica quais campos foram preenchidos corretamente
        const preenchidos = camposObrigatorios.filter(campo =>
            campo.checkValidity()
        ).length;

        // Calcula a porcentagem
        const porcentagem = total > 0
            ? Math.round((preenchidos / total) * 100)
            : 0;

        // Atualiza a barra
        preenchimento.style.width = porcentagem + "%";

        // Atualiza o texto
        texto.textContent = porcentagem + "%";

        // Atualiza a acessibilidade
        trilho.setAttribute("aria-valuenow", porcentagem);

        // Atualiza a quantidade de campos
        camposTexto.textContent =
            preenchidos + " de " + total + " campos preenchidos";
    }

    // Atualiza ao digitar ou selecionar opções
    formulario.addEventListener("input", atualizarProgresso);
    formulario.addEventListener("change", atualizarProgresso);

    // Atualiza depois de limpar o formulário
    formulario.addEventListener("reset", function () {
        requestAnimationFrame(atualizarProgresso);
    });

    // Observa alterações nos atributos required
    // Útil para os campos do responsável
    const observador = new MutationObserver(atualizarProgresso);

    observador.observe(formulario, {
        subtree: true,
        attributes: true,
        attributeFilter: ["required", "disabled"]
    });

    // Primeira atualização
    atualizarProgresso();

});