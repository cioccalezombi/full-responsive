(function () {
    var box = document.getElementById('countdown');
    if (!box) return;
    var target = new Date(box.dataset.target).getTime();
    var els = {
        d: document.getElementById('cd-days'),
        h: document.getElementById('cd-hours'),
        m: document.getElementById('cd-minutes')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };

    function tick() {
        var diff = Math.max(0, target - Date.now());
        els.d.textContent = Math.floor(diff / 86400000);
        els.h.textContent = pad(Math.floor(diff / 3600000) % 24);
        els.m.textContent = pad(Math.floor(diff / 60000) % 60);
        if (diff === 0) clearInterval(timer);
    }

    tick();
    var timer = setInterval(tick, 1000);
})();
