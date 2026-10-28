(() => {
    "use strict";

    const STORAGE_KEY = "swnn-lang";
    const DEFAULT_LANG = "en";
    const LANGS = ["en", "es"];
    const ATTRS = ["alt", "placeholder", "aria-label", "aria-roledescription", "title"];
    const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);

    const PAIRS = [
        ["Star Wars News Net - Replication", "Star Wars News Net - Replicación"],

        ["CONTACT", "CONTACTO"],
        ["ABOUT", "ACERCA DE"],
        ["THE SWNN TEAM", "EL EQUIPO DE SWNN"],
        ["THE CANTINA FORUMS", "LOS FOROS DE LA CANTINA"],

        ["FILMS", "PELÍCULAS"],
        ["TV SERIES", "SERIES DE TV"],
        ["ANIMATION", "ANIMACIÓN"],
        ["BOOKS & COMICS", "LIBROS Y CÓMICS"],
        ["GAMES & TOYS", "JUEGOS Y JUGUETES"],
        ["PARKS & EVENTS", "PARQUES Y EVENTOS"],
        ["EDITORIALS", "EDITORIALES"],

        ["Star Wars Films", "Películas de Star Wars"],
        ["Upcoming Releases", "Próximos estrenos"],
        ["Box Office", "Taquilla"],
        ["Film Reviews", "Reseñas de películas"],
        ["Home Video & Streaming", "Video hogareño y streaming"],
        ["Live-Action Series", "Series de acción real"],
        ["Season Reviews", "Reseñas de temporadas"],
        ["Casting News", "Noticias de casting"],
        ["Streaming Schedule", "Calendario de streaming"],
        ["Behind the Scenes", "Detrás de escena"],
        ["Novels", "Novelas"],
        ["Release Calendar", "Calendario de lanzamientos"],
        ["Video Games", "Videojuegos"],
        ["Tabletop & RPG", "Juegos de mesa y rol"],
        ["Collectibles", "Coleccionables"],
        ["Toy Reviews", "Reseñas de juguetes"],

        ["Search SWNN...", "Buscar en SWNN..."],
        ["Search", "Buscar"],
        ["Open search", "Abrir buscador"],
        ["Home", "Inicio"],
        ["Pause carousel", "Pausar carrusel"],
        ["Resume carousel", "Reanudar carrusel"],
        ["Play carousel", "Reproducir carrusel"],
        ["Previous story", "Noticia anterior"],
        ["Next story", "Noticia siguiente"],
        ["Featured news", "Noticias destacadas"],
        ["carousel", "carrusel"],
        ["May the Force Be With You - Star Wars", "Que la Fuerza te acompañe - Star Wars"],
        ["Countdown to Star Wars Celebration 2027", "Cuenta regresiva para Star Wars Celebration 2027"],

        ["LATEST NEWS", "ÚLTIMAS NOTICIAS"],
        ["SEE ALL LATEST NEWS", "VER TODAS LAS ÚLTIMAS NOTICIAS"],
        ["See all", "Ver todo"],

        ["NOVELS", "NOVELAS"],
        ["MOVIES", "PELÍCULAS"],
        ["CHARACTERS", "PERSONAJES"],
        ["COMICS", "CÓMICS"],
        ["Films", "Películas"],
        ["Characters", "Personajes"],
        ["Games", "Juegos"],
        ["Comics", "Cómics"],
        ["Books & Comics", "Libros y cómics"],
        ["Games & Toys", "Juegos y juguetes"],

        ["'Reign of the Empire: From the Ashes' Novel Synopsis Revealed",
         "Revelan la sinopsis de la novela 'Reign of the Empire: From the Ashes'"],
        ["'Star Wars: Starfighter' Budget Surpasses 'The Force Awakens'",
         "El presupuesto de 'Star Wars: Starfighter' supera al de 'The Force Awakens'"],
        ["Sixth Brother - 'Star Wars' Character Spotlight",
         "Sixth Brother - Personaje destacado de 'Star Wars'"],
        ["Review: 'The Fall of Kylo Ren' #3 Takes a Break for a Knights of Ren Flashback",
         "Reseña: 'The Fall of Kylo Ren' #3 hace una pausa para un flashback de los Caballeros de Ren"],
        ["'Star Wars' January 2027 Comics Preview: 'Star Wars/Marvel: Hope Assembles' #1",
         "Adelanto de cómics de 'Star Wars' de enero de 2027: 'Star Wars/Marvel: Hope Assembles' #1"],
        ["'Star Wars' January 2027 Comics Preview: 'Star Wars/Marvel: Hope Assembles' #1...",
         "Adelanto de cómics de 'Star Wars' de enero de 2027: 'Star Wars/Marvel: Hope Assembles' #1..."],
        ["Comic Preview", "Adelanto de cómic"],
        ["Star Wars Comics Preview", "Adelanto de cómics de Star Wars"],

        ["'The Mandalorian and Grogu': Nielsen Shows Solid Ratings for First Week on Streaming",
         "'The Mandalorian and Grogu': Nielsen muestra una sólida audiencia en su primera semana en streaming"],
        ["The Mandalorian and Grogu was a box office disaster earlier this year, becoming the lowest-grossing Star Wars movie ever though it...",
         "The Mandalorian and Grogu fue un desastre de taquilla a principios de este año y se convirtió en la película de Star Wars menos taquillera de la historia, aunque..."],
        ["'The Mandalorian and Grogu' Currently Streaming on Disney Plus, IMAX Enhanced Version Available",
         "'The Mandalorian and Grogu' ya se puede ver en Disney Plus, con versión IMAX Enhanced disponible"],
        ["Tippett Studio Closes After 35 Years Of Animation Innovation; Original 'Star Wars' Models To Be Auctioned Off",
         "Tippett Studio cierra tras 35 años de innovación en animación; subastarán los modelos originales de 'Star Wars'"],
        ["'The Mandalorian and Grogu' Confirmed to Hit Disney Plus on September 2nd",
         "Confirman que 'The Mandalorian and Grogu' llegará a Disney Plus el 2 de septiembre"],
        ["Disney CEO Josh D'Amaro Minimizes 'The Mandalorian and Grogu' Box Office Failure, Says Company Is Exploring Free Streaming Services",
         "El CEO de Disney, Josh D'Amaro, le resta importancia al fracaso en taquilla de 'The Mandalorian and Grogu' y dice que la compañía explora servicios de streaming gratuitos"],
        ["Disney CEO Josh D'Amaro", "El CEO de Disney, Josh D'Amaro"],

        ["'Star Wars' January 2027 Comics Preview", "Adelanto de cómics de 'Star Wars' de enero de 2027"],
        ["January 2027 has been circled on the calendar as a reset of sorts for Star Wars comics...",
         "Enero de 2027 quedó marcado en el calendario como una especie de reinicio para los cómics de Star Wars..."],
        ["Review: 'The Fall of Kylo Ren' #3", "Reseña: 'The Fall of Kylo Ren' #3"],
        ["Review - 'Star Wars Icons: Vader' Is a One-Of-A-Kind Celebration",
         "Reseña - 'Star Wars Icons: Vader' es una celebración única en su tipo"],
        ["Review: 'Star Wars Icons: Vader'", "Reseña: 'Star Wars Icons: Vader'"],

        ["Respawn and DICE Studios Working on 'Star Wars: Battlefront 3'; BioWare Shuttering",
         "Respawn y DICE trabajan en 'Star Wars: Battlefront 3'; BioWare cierra"],
        ["Respawn and DICE Studios Working on 'Star Wars: Battlefront 3'",
         "Respawn y DICE trabajan en 'Star Wars: Battlefront 3'"],
        ["In a mix of good news and bad news, Electronic Arts (EA) has stated that Respawn and DICE studios are...",
         "En una mezcla de buenas y malas noticias, Electronic Arts (EA) informó que los estudios Respawn y DICE están..."],
        ["Disney Reportedly in Talks with Bungie and DICE to Develop a New 'Star Wars: Battlefront' Game",
         "Según informes, Disney conversa con Bungie y DICE para desarrollar un nuevo juego de 'Star Wars: Battlefront'"],
        ["Disney, Bungie and DICE - 'Star Wars: Battlefront'", "Disney, Bungie y DICE - 'Star Wars: Battlefront'"],
        ["'Star Wars: Galactic Racer' Developers Hint Post-Launch Content Is in Development",
         "Los desarrolladores de 'Star Wars: Galactic Racer' dan a entender que hay contenido posterior al lanzamiento en desarrollo"],

        ["The Sixth Brother is the next Inquisitor to step into our Star Wars Character Spotlight...",
         "El Sexto Hermano es el próximo Inquisidor en pasar por nuestra sección de personajes destacados de Star Wars..."],
        ["Sebulba - 'Star Wars' Character Spotlight", "Sebulba - Personaje destacado de 'Star Wars'"],
        ["Kit Fisto - 'Star Wars' Character Spotlight", "Kit Fisto - Personaje destacado de 'Star Wars'"],

        ["Days", "Días"],
        ["Hours", "Horas"],
        ["Minutes", "Minutos"],
        ["Seconds", "Segundos"],
        ["SWNN LIVE: SHOULD RET BE IN STARFIGHTER?", "SWNN EN VIVO: ¿DEBERÍA RET ESTAR EN STARFIGHTER?"],
        ["SWNN Live: Should Ret Be in Starfighter?", "SWNN en vivo: ¿Debería Ret estar en Starfighter?"],
        ["A 'STAR WARS' MARVEL COMICS READING GUIDE", "GUÍA DE LECTURA DE LOS CÓMICS DE 'STAR WARS' DE MARVEL"],
        ["A 'Star Wars' Marvel Comics Reading Guide", "Guía de lectura de los cómics de 'Star Wars' de Marvel"],
        ["SWNN ARCHIVES", "ARCHIVO DE SWNN"],
        ["Select Month", "Seleccionar mes"],

        ["ABOUT US", "SOBRE NOSOTROS"],
        ["USEFUL INFORMATION", "INFORMACIÓN ÚTIL"],
        ["Contact us", "Contacto"],
        ["Privacy Policy", "Política de privacidad"],
        ["About", "Acerca de"],
        ["Star Wars Banner", "Banner de Star Wars"],
        ["starwarsnewsnet.com was established on October 30, 2012. The date when Disney announced the acquisition of Lucasfilm and their desire to make more Star Wars movies and other Star Wars related projects.",
         "starwarsnewsnet.com se fundó el 30 de octubre de 2012, la fecha en que Disney anunció la adquisición de Lucasfilm y su deseo de hacer más películas de Star Wars y otros proyectos relacionados."]
    ];

    const norm = (s) => s
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\s+/g, " ")
        .trim();

    const lookup = new Map();
    for (const [en, es] of PAIRS) lookup.set(norm(en), { en, es });
    for (const [en, es] of PAIRS) {
        const key = norm(es);
        if (!lookup.has(key)) lookup.set(key, { en, es });
    }

    const MONTHS = [
        ["January", "Jan", "enero", "ene"],
        ["February", "Feb", "febrero", "feb"],
        ["March", "Mar", "marzo", "mar"],
        ["April", "Apr", "abril", "abr"],
        ["May", "May", "mayo", "may"],
        ["June", "Jun", "junio", "jun"],
        ["July", "Jul", "julio", "jul"],
        ["August", "Aug", "agosto", "ago"],
        ["September", "Sep", "septiembre", "sep"],
        ["October", "Oct", "octubre", "oct"],
        ["November", "Nov", "noviembre", "nov"],
        ["December", "Dec", "diciembre", "dic"]
    ];
    const MONTH_INDEX = new Map();
    MONTHS.forEach((m, i) => {
        MONTH_INDEX.set(m[0].toLowerCase(), i);
        MONTH_INDEX.set(m[1].toLowerCase(), i);
    });
    const MONTH_ALT = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec";
    const DATE_RE = new RegExp("\\b(" + MONTH_ALT + ")\\.?\\s+(\\d{1,2}),\\s*(\\d{4})\\b", "g");
    const MONTH_YEAR_RE = new RegExp("^(" + MONTH_ALT + ")\\s+(\\d{4})$");

    function translateDates(text) {
        const my = text.match(MONTH_YEAR_RE);
        if (my) {
            const idx = MONTH_INDEX.get(my[1].toLowerCase());
            return MONTHS[idx][2] + " " + my[2];
        }
        return text.replace(DATE_RE, (_, month, day, year) => {
            const idx = MONTH_INDEX.get(month.toLowerCase());
            const isLong = month.length > 3;
            return isLong
                ? day + " de " + MONTHS[idx][2] + " de " + year
                : day + " " + MONTHS[idx][3] + " " + year;
        });
    }

    function convert(src, lang) {
        const m = src.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const lead = m[1], core = m[2], trail = m[3];
        if (!core) return src;

        const pair = lookup.get(norm(core));
        let out = core;
        if (pair) {
            if (norm(pair[lang]) !== norm(core)) out = pair[lang];
        } else if (lang === "es") {
            out = translateDates(core);
        }
        return lead + out + trail;
    }

    let currentLang = DEFAULT_LANG;
    const textState = new WeakMap();
    const attrState = new WeakMap();

    function processText(node) {
        const cur = node.nodeValue;
        if (!cur || !cur.trim()) return;
        let st = textState.get(node);
        if (!st || cur !== st.out) st = { src: cur, out: cur };
        st.out = convert(st.src, currentLang);
        textState.set(node, st);
        if (cur !== st.out) node.nodeValue = st.out;
    }

    function processAttr(el, name) {
        if (!el.hasAttribute(name)) return;
        const cur = el.getAttribute(name);
        let map = attrState.get(el);
        if (!map) { map = new Map(); attrState.set(el, map); }
        let st = map.get(name);
        if (!st || cur !== st.out) st = { src: cur, out: cur };
        st.out = convert(st.src, currentLang);
        map.set(name, st);
        if (cur !== st.out) el.setAttribute(name, st.out);
    }

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) { processText(node); return; }
        if (node.nodeType !== Node.ELEMENT_NODE || SKIP_TAGS.has(node.tagName)) return;
        for (const a of ATTRS) processAttr(node, a);
        node.childNodes.forEach(walk);
    }

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === "childList") m.addedNodes.forEach(walk);
            else if (m.type === "characterData") processText(m.target);
            else if (m.type === "attributes") processAttr(m.target, m.attributeName);
        }
    });

    function updateButtons() {
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.setAttribute("aria-pressed", String(btn.dataset.lang === currentLang));
        });
    }

    function setLang(lang, persist = true) {
        if (!LANGS.includes(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        document.documentElement.lang = lang;
        walk(document.documentElement);
        updateButtons();
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        }
    }

    function init() {
        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.addEventListener("click", () => setLang(btn.dataset.lang));
        });

        observer.observe(document.documentElement, {
            childList: true,
            characterData: true,
            subtree: true,
            attributes: true,
            attributeFilter: ATTRS
        });

        setLang(LANGS.includes(saved) ? saved : DEFAULT_LANG, false);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
