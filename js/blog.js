(function () {
    'use strict';

    /* ---------- Carrossel dos posts ---------- */
    const carrossel = document.querySelector('.carrossel');
    if (carrossel) {
        const slides = Array.from(carrossel.querySelectorAll('.slide'));
        const caixaPontos = document.getElementById('pontos');
        let atual = 0;
        let scrollTimer = null;
        let autoTimer = null;

        function marcarPontos(indice) {
            if (!caixaPontos) return;
            caixaPontos.querySelectorAll('.carrossel-ponto').forEach(function (botao, i) {
                botao.setAttribute('aria-current', i === indice ? 'true' : 'false');
            });
        }

        function irParaSlide(indice) {
            if (!slides.length) return;
            atual = (indice + slides.length) % slides.length;
            marcarPontos(atual);
            carrossel.scrollTo({
                left: slides[atual].offsetLeft - carrossel.offsetLeft,
                behavior: 'smooth'
            });
        }

        if (caixaPontos && slides.length) {
            caixaPontos.innerHTML = '';
            slides.forEach(function (_, i) {
                const botao = document.createElement('button');
                botao.type = 'button';
                botao.className = 'carrossel-ponto';
                botao.setAttribute('aria-label', 'Ir para o post ' + (i + 1) + ' de ' + slides.length);
                botao.addEventListener('click', function () {
                    irParaSlide(i);
                    reiniciarAuto();
                });
                caixaPontos.appendChild(botao);
            });
        }

        function sincronizarIndice() {
            if (!slides.length || !carrossel.clientWidth) return;
            const idx = Math.round(carrossel.scrollLeft / carrossel.clientWidth);
            atual = Math.max(0, Math.min(slides.length - 1, idx));
            marcarPontos(atual);
        }

        function iniciarAuto() {
            pararAuto();
            if (slides.length > 1) {
                autoTimer = window.setInterval(function () {
                    irParaSlide(atual + 1);
                }, 5000);
            }
        }

        function pararAuto() {
            if (autoTimer !== null) {
                window.clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        function reiniciarAuto() {
            pararAuto();
            iniciarAuto();
        }

        carrossel.querySelectorAll('.seta').forEach(function (seta) {
            seta.addEventListener('click', function (ev) {
                ev.preventDefault();
                const passo = seta.classList.contains('seta-esq') ? -1 : 1;
                irParaSlide(atual + passo);
                reiniciarAuto();
            });
        });

        carrossel.addEventListener('keydown', function (ev) {
            if (ev.key === 'ArrowLeft') {
                ev.preventDefault();
                irParaSlide(atual - 1);
                reiniciarAuto();
            } else if (ev.key === 'ArrowRight') {
                ev.preventDefault();
                irParaSlide(atual + 1);
                reiniciarAuto();
            }
        });

        carrossel.addEventListener('scroll', function () {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(sincronizarIndice, 80);
        }, { passive: true });

        carrossel.addEventListener('mouseenter', pararAuto);
        carrossel.addEventListener('mouseleave', iniciarAuto);
        carrossel.addEventListener('focusin', pararAuto);
        carrossel.addEventListener('focusout', iniciarAuto);

        marcarPontos(0);
        iniciarAuto();
    }

    /* ---------- Busca simples na lista de posts ---------- */
    const campo = document.getElementById('busca-blog');
    if (campo) {
        const posts = Array.from(document.querySelectorAll('.ultimas .post'));
        const aviso = document.getElementById('sem-resultado');
        const normalizar = function (texto) {
            return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        function filtrarPosts() {
            const termo = normalizar(campo.value.trim());
            let encontrados = 0;

            posts.forEach(function (post) {
                const corresponde = !termo || normalizar(post.textContent).includes(termo);
                post.hidden = !corresponde;
                if (corresponde) encontrados++;
            });

            if (aviso) {
                aviso.hidden = encontrados > 0;
            }
        }

        campo.addEventListener('input', filtrarPosts);
        if (campo.form) {
            campo.form.addEventListener('submit', function (ev) {
                ev.preventDefault();
                filtrarPosts();
            });
        }
    }
})();