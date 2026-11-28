/**
 * Cantinho Trans - página Apoie
 * Pop-up "Quero ajudar diretamente": escolha entre ajuda não-financeira
 * (abre o e-mail do Cantinho já preenchido) ou Pix (copiar a chave).
 */

const EMAIL_CONTATO = 'ocantinhotrans@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-ajuda');
    const botaoAbrir = document.getElementById('abrir-ajuda');
    if (!modal || !botaoAbrir) return;

    const paineis = modal.querySelectorAll('.modal-painel');

    function mostrarPainel(id) {
        paineis.forEach((painel) => { painel.hidden = painel.id !== id; });
    }

    // Abrir sempre no passo 1
    botaoAbrir.addEventListener('click', () => {
        mostrarPainel('painel-escolha');
        modal.showModal();
    });

    // Fechar: botão X ou clique fora da caixa (Esc já funciona sozinho)
    modal.querySelectorAll('[data-fechar]').forEach((botao) => {
        botao.addEventListener('click', () => modal.close());
    });

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) modal.close();
    });

    // Navegar entre os passos (escolha -> extra / pix, e voltar)
    modal.querySelectorAll('[data-abrir]').forEach((botao) => {
        botao.addEventListener('click', () => mostrarPainel(botao.dataset.abrir));
    });

    // ---------- Ajuda não-financeira: monta o e-mail com o que foi marcado ----------
    const linkEmail = document.getElementById('enviar-ajuda');
    const chips = modal.querySelectorAll('#chips-ajuda input[type="checkbox"]');

    function atualizarEmail() {
        const escolhidas = Array.from(chips).filter((c) => c.checked).map((c) => c.value);
        const assunto = 'Quero ajudar o Cantinho Trans';
        let corpo = 'Olá, Cantinho! Vim pelo site e quero ajudar.\n\n';
        corpo += escolhidas.length
            ? `Gostaria de ajudar com: ${escolhidas.join(', ')}.\n\n`
            : 'Gostaria de saber como posso ajudar.\n\n';
        corpo += 'Meu nome: ';
        linkEmail.href = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    }

    chips.forEach((chip) => chip.addEventListener('change', atualizarEmail));
    atualizarEmail();

    // ---------- Pix: copiar chave ----------
    const botaoPix = document.getElementById('copiar-pix');
    const chavePix = document.getElementById('chave-pix');

    if (botaoPix && chavePix) {
        const textoOriginal = botaoPix.textContent;

        botaoPix.addEventListener('click', async () => {
            const chave = chavePix.textContent.trim();
            try {
                await navigator.clipboard.writeText(chave);
            } catch (erro) {
                // Alternativa para navegadores sem acesso à área de transferência
                const campo = document.createElement('textarea');
                campo.value = chave;
                document.body.appendChild(campo);
                campo.select();
                document.execCommand('copy');
                campo.remove();
            }
            botaoPix.textContent = 'chave copiada!';
            setTimeout(() => { botaoPix.textContent = textoOriginal; }, 2000);
        });
    }
});
