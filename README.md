# site-cantinho-trans

Site do coletivo Cantinho Trans (HTML e CSS simples).

## Estrutura

- `*.html`: páginas (todas com o mesmo cabeçalho, menu e rodapé)
- `css/style.css`: estilos compartilhados por todas as páginas
- `css/index.css`, `css/retificacao.css`: estilos só dessas páginas
- `js/eventos.js`: calendário da página de eventos
- `imgs/`: imagens (`imgs/logos/` guarda os logos das organizações)

Ao criar uma página nova, copie o `<header>` e o `<footer>` de qualquer outra página
e marque o item do menu atual com `aria-current="page"`.
