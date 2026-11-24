/**
 * Cantinho Trans - Gerenciamento de Links Internos, Navegação e Guias
 * Intercepta apenas links em desenvolvimento sem página (#),
 * permitindo navegação fluida para as novas páginas de Guias (Retificação, Saúde, Recursos).
 */

document.addEventListener('DOMContentLoaded', () => {

    // Gerenciamento do menu mobile (hambúrguer)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });
    }

    /**
     * Função que gerencia o clique em links internos e botões em desenvolvimento.
     */
    function handleInternalLinkClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');

        // Se o link apontar para uma página real (.html ou externa), deixa o navegador abrir normalmente!
        if (href && (href.endsWith('.html') || href.includes('.html#') || (!href.startsWith('#') && !href.startsWith('javascript:')))) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            return; // Permite a navegação normal entre páginas
        }

        // Impede o recarregamento ou salto brusco para o topo (#)
        event.preventDefault();

        // Fecha o menu mobile caso esteja aberto
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        }

        // Se for a logo ou voltar ao topo
        if (link.classList.contains('logo-box') || href === '#topo') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        // Se for o botão "Saiba Mais", rola suavemente até a seção Quem Somos
        if (link.textContent.trim().toUpperCase() === 'SAIBA MAIS') {
            const quemSomos = document.getElementById('quem-somos');
            if (quemSomos) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const topPos = quemSomos.getBoundingClientRect().top + window.pageYOffset - (navHeight + 10);
                window.scrollTo({ top: topPos, behavior: 'smooth' });
                return;
            }
        }

        // Se o destino for uma seção existente na mesma página (#quem-somos, #eventos)
        if (href && href.startsWith('#') && href.length > 1) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - (navHeight + 10);
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                return;
            }
        }

        // Para links cujas páginas ainda serão implementadas pelos demais membros da equipe:
        // ('Blog', 'Apoie', 'Participe', 'Quem Somos detalhes', 'Participar')
        console.log(`[Em desenvolvimento] Ação interceptada para: "${link.textContent.trim()}" (${href})`);
    }

    // Seleciona todos os links internos do menu, botões das seções e abas dos guias
    const internalElements = document.querySelectorAll(`
        .nav-links a,
        .logo-box,
        .hero-section .btn-rosa,
        #quem-somos .btn-rosa,
        #eventos .btn-rosa,
        .guide-tab-item,
        .guide-card-preview .btn-rosa
    `);

    internalElements.forEach(element => {
        element.addEventListener('click', handleInternalLinkClick);
    });

    // Acordeão interativo para as Dúvidas Frequentes (FAQ) nos guias
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const header = card.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isCurrentlyOpen = card.classList.contains('open');
                // Fecha os outros para manter leitura limpa
                faqCards.forEach(c => c.classList.remove('open'));
                if (!isCurrentlyOpen) {
                    card.classList.add('open');
                }
            });
        }
    });

});
