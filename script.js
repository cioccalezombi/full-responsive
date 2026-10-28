// ===== Countdown =====
// Countdown: la fecha objetivo se cambia en data-target del #countdown
(function () {
    var box = document.getElementById('countdown');
    if (!box) return;
    var target = new Date(box.dataset.target).getTime();
    var els = {
        d: document.getElementById('cd-days'),
        h: document.getElementById('cd-hours'),
        m: document.getElementById('cd-minutes'),
        s: document.getElementById('cd-seconds')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };

    function tick() {
        var diff = Math.max(0, target - Date.now());
        els.d.textContent = Math.floor(diff / 86400000);
        els.h.textContent = pad(Math.floor(diff / 3600000) % 24);
        els.m.textContent = pad(Math.floor(diff / 60000) % 60);
        if (els.s) els.s.textContent = pad(Math.floor(diff / 1000) % 60);
        if (diff === 0) clearInterval(timer);
    }

    tick();
    var timer = setInterval(tick, 1000);
})();

// ===== Slider de Latest News =====
// Slider de "Latest News".
// Los datos de cada slide están en los data-* de cada miniatura (.thumb-item) en el HTML.
(function () {
    var slider = document.getElementById('news-slider');
    if (!slider) return;

    var INTERVAL = 5000;   // ms entre slides
    var FADE = 250;        // ms, debe coincidir con la transición del CSS

    var card = slider.querySelector('.slider-main-card');
    var thumbs = Array.prototype.slice.call(slider.querySelectorAll('.thumb-item'));
    var els = {
        img: document.getElementById('slider-img'),
        category: document.getElementById('slider-category'),
        title: document.getElementById('slider-title'),
        date: document.getElementById('slider-date'),
        author: document.getElementById('slider-author')
    };
    var pauseBtn = document.getElementById('slider-pause');
    var prevBtn = document.getElementById('slider-prev');
    var nextBtn = document.getElementById('slider-next');

    var current = 0;
    var playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null;
    var fadeTimeout = null;
    var hovering = false;

    // Precarga de imágenes para que el cambio no parpadee
    thumbs.forEach(function (t) { new Image().src = t.dataset.img; });

    // Etiquetas accesibles para cada miniatura
    thumbs.forEach(function (t, i) {
        t.setAttribute('aria-label', 'Ir a la noticia ' + (i + 1) + ': ' + t.dataset.title);
    });

    function render(i) {
        var d = thumbs[i].dataset;
        els.img.src = d.img;
        els.img.alt = d.title;
        els.category.textContent = d.category;
        els.title.textContent = d.title;
        els.date.textContent = d.date;
        els.author.textContent = d.author;
        thumbs.forEach(function (t, n) {
            var active = n === i;
            t.classList.toggle('active', active);
            t.setAttribute('aria-current', active ? 'true' : 'false');
        });
    }

    function goTo(i) {
        i = (i + thumbs.length) % thumbs.length;
        if (i === current) return;
        current = i;
        clearTimeout(fadeTimeout);
        card.classList.add('is-changing');
        fadeTimeout = setTimeout(function () {
            render(current);
            card.classList.remove('is-changing');
        }, FADE);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function startTimer() {
        stopTimer();
        if (playing && !hovering && !document.hidden) {
            timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
        }
    }

    function setPlaying(value) {
        playing = value;
        pauseBtn.innerHTML = '<i class="fas ' + (playing ? 'fa-pause' : 'fa-play') + '"></i>';
        pauseBtn.setAttribute('aria-label', playing ? 'Pausar carrusel' : 'Reanudar carrusel');
        // Mientras corre solo no se anuncia cada cambio; en pausa sí
        slider.setAttribute('aria-live', playing ? 'off' : 'polite');
        startTimer();
    }

    // Controles (al interactuar se reinicia la cuenta del autoplay)
    nextBtn.addEventListener('click', function () { goTo(current + 1); startTimer(); });
    prevBtn.addEventListener('click', function () { goTo(current - 1); startTimer(); });
    pauseBtn.addEventListener('click', function () { setPlaying(!playing); });
    thumbs.forEach(function (t, i) {
        t.addEventListener('click', function () { goTo(i); startTimer(); });
    });

    // Teclado: flechas izquierda/derecha cuando el foco está dentro del slider
    slider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { goTo(current + 1); startTimer(); }
        else if (e.key === 'ArrowLeft') { goTo(current - 1); startTimer(); }
    });

    // Pausa temporal con mouse encima o foco dentro (no cambia el estado del botón)
    slider.addEventListener('mouseenter', function () { hovering = true; stopTimer(); });
    slider.addEventListener('mouseleave', function () { hovering = false; startTimer(); });
    slider.addEventListener('focusin', function () { hovering = true; stopTimer(); });
    slider.addEventListener('focusout', function () { hovering = false; startTimer(); });

    // No avanzar si la pestaña está oculta
    document.addEventListener('visibilitychange', startTimer);

    // Soporte táctil: swipe horizontal
    var touchX = null;
    card.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    card.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startTimer(); }
    });

    render(0);
    setPlaying(playing);
})();

// ===== Navegación: desplegables y buscador =====
(function () {
    var nav = document.querySelector('.main-nav');
    if (!nav) return;

    var triggers = Array.prototype.slice.call(nav.querySelectorAll('.nav-trigger'));
    var menuItems = Array.prototype.slice.call(nav.querySelectorAll('.nav-menu > li'));
    var navMenu = nav.querySelector('.nav-menu');
    var searchBtn = nav.querySelector('.search-btn');
    var searchIcon = searchBtn.querySelector('i');
    var searchBar = document.getElementById('search-bar');
    var searchInput = document.getElementById('search-input');
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    var openTrigger = null;
    var closeTimer = null;

    function panelOf(trigger) {
        return document.getElementById(trigger.getAttribute('aria-controls'));
    }

    function closeMenu(returnFocus) {
        if (!openTrigger) return;
        var t = openTrigger;
        panelOf(t).hidden = true;
        t.setAttribute('aria-expanded', 'false');
        openTrigger = null;
        if (returnFocus) t.focus();
    }

    function openMenu(trigger) {
        if (openTrigger === trigger) return;
        closeMenu(false);
        closeSearch(false);
        var panel = panelOf(trigger);
        panel.hidden = false;
        // Alinear con el ítem sin que se salga de la pantalla
        var left = trigger.getBoundingClientRect().left - nav.getBoundingClientRect().left;
        var max = nav.clientWidth - panel.offsetWidth - 8;
        panel.style.left = Math.max(8, Math.min(left, max)) + 'px';
        trigger.setAttribute('aria-expanded', 'true');
        openTrigger = trigger;
    }

    function closeSearch(returnFocus) {
        if (searchBar.hidden) return;
        searchBar.hidden = true;
        searchBtn.setAttribute('aria-expanded', 'false');
        searchBtn.setAttribute('aria-label', 'Abrir buscador');
        searchIcon.className = 'fas fa-search';
        if (returnFocus) searchBtn.focus();
    }

    function openSearch() {
        closeMenu(false);
        searchBar.hidden = false;
        searchBtn.setAttribute('aria-expanded', 'true');
        searchBtn.setAttribute('aria-label', 'Cerrar buscador');
        searchIcon.className = 'fas fa-times';
        searchInput.focus();
    }

    function scheduleClose() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () { closeMenu(false); }, 150);
    }

    function cancelClose() {
        clearTimeout(closeTimer);
    }

    // --- Desplegables ---
    triggers.forEach(function (t) {
        t.addEventListener('click', function (e) {
            var viaKeyboard = e.detail === 0;
            // Con mouse el hover ya lo abrió: el click no debe cerrarlo
            if (openTrigger === t && (viaKeyboard || !canHover.matches)) closeMenu(false);
            else openMenu(t);
        });

        t.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                openMenu(t);
                panelOf(t).querySelector('a').focus();
            }
        });

        // Navegación con flechas dentro del panel
        panelOf(t).addEventListener('keydown', function (e) {
            var links = Array.prototype.slice.call(this.querySelectorAll('a'));
            var i = links.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
            else if (e.key === 'Home') { e.preventDefault(); links[0].focus(); }
            else if (e.key === 'End') { e.preventDefault(); links[links.length - 1].focus(); }
        });

        panelOf(t).addEventListener('mouseenter', cancelClose);
        panelOf(t).addEventListener('mouseleave', function () { if (canHover.matches) scheduleClose(); });
    });

    // Hover (solo con mouse): abre al pasar, cierra al salir o al pasar a un ítem sin submenú
    menuItems.forEach(function (li) {
        li.addEventListener('mouseenter', function () {
            if (!canHover.matches) return;
            cancelClose();
            var t = li.querySelector('.nav-trigger');
            if (t) openMenu(t);
            else closeMenu(false);
        });
        li.addEventListener('mouseleave', function () { if (canHover.matches) scheduleClose(); });
    });

    // --- Buscador ---
    searchBtn.addEventListener('click', function () {
        if (searchBar.hidden) openSearch();
        else closeSearch(false);
    });

    // --- Cierres globales ---
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (openTrigger) closeMenu(true);
        else closeSearch(true);
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-trigger, .nav-dropdown, .search-bar, .search-btn')) {
            closeMenu(false);
            closeSearch(false);
        }
    });

    // Si el foco sale del desplegable abierto (Tab), se cierra
    document.addEventListener('focusin', function (e) {
        if (!openTrigger) return;
        if (e.target !== openTrigger && !panelOf(openTrigger).contains(e.target)) closeMenu(false);
    });

    // El panel queda fijo mientras la nav hace scroll horizontal o cambia el tamaño: se cierra
    navMenu.addEventListener('scroll', function () { closeMenu(false); });
    window.addEventListener('resize', function () { closeMenu(false); });
})();
