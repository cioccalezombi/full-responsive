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
