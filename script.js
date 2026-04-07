/**
 * script.js — Mangalam HDPE Pipes
 * ─────────────────────────────────────────────────────
 * 1. Sticky Header     — slides in after scrolling past hero
 * 2. Hamburger Menu    — mobile nav drawer
 * 3. Product Carousel  — prev/next + thumbnail sync (real images)
 * 4. Zoom Panel        — hover shows enlarged image on right side
 * 5. FAQ Accordion     — original toggleFaq() preserved
 * 6. Apps Carousel     — original prev/next logic preserved
 * 7. Process Tabs      — original logic + real image swap
 * ─────────────────────────────────────────────────────
 */

/* ── 1. STICKY HEADER ──────────────────────────────────────
   Appears after scrolling past hero section (~75% height).
   Uses requestAnimationFrame to prevent scroll jank.
──────────────────────────────────────────────────────────── */
var header = document.getElementById('stickyHeader');
var heroEl = document.getElementById('hero');
var rafId = null;

function checkSticky() {
    var threshold = heroEl ?
        heroEl.offsetTop + heroEl.offsetHeight * 0.75 :
        window.innerHeight;
    header.classList.toggle('visible', window.scrollY > threshold);
    rafId = null;
}

window.addEventListener('scroll', function() {
    if (!rafId) rafId = requestAnimationFrame(checkSticky);
}, {
    passive: true
});


/* ── 2. HAMBURGER MENU (mobile) ────────────────────────────
   Toggles the mobile nav drawer open/closed.
──────────────────────────────────────────────────────────── */
var hamburger = document.getElementById('hamburger');
var mobNav = document.getElementById('mobNav');

if (hamburger && mobNav) {
    hamburger.addEventListener('click', function() {
        var open = mobNav.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mob-link').forEach(function(a) {
        a.addEventListener('click', function() {
            mobNav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}


/* ── 3. PRODUCT IMAGE CAROUSEL ─────────────────────────────
   Real <img> elements inside .c-slide divs.
   Thumbnails use CSS background-image.
   Prev/Next arrows + thumbnail click switch active slide.
──────────────────────────────────────────────────────────── */
var mainWrap = document.getElementById('mainImgWrap');
var slides = document.querySelectorAll('.c-slide');
var thumbs = document.querySelectorAll('.thumb');
var prevBtn = document.getElementById('caroPrev');
var nextBtn = document.getElementById('caroNext');
var curSlide = 0;

/* Image sources (kept in sync with HTML slide src attrs) */
var slideSrcs = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&q=80',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&q=80',
    'https://images.unsplash.com/photo-1565118531796-763e5082d113?w=700&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80'
];

function goToSlide(idx) {
    /* Wrap around */
    idx = ((idx % slides.length) + slides.length) % slides.length;

    slides[curSlide].classList.remove('active');
    thumbs[curSlide].classList.remove('active');

    curSlide = idx;

    slides[curSlide].classList.add('active');
    thumbs[curSlide].classList.add('active');

    /* Update zoom panel source */
    var zImg = document.getElementById('zoomImg');
    var zCap = document.getElementById('zoomCaption');
    if (zImg) zImg.src = slideSrcs[curSlide];
    if (zCap) zCap.textContent = 'Image ' + (curSlide + 1) + ' of ' + slides.length;

    /* Scroll thumbnail into view */
    thumbs[curSlide].scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth'
    });
}

if (prevBtn) prevBtn.addEventListener('click', function() {
    goToSlide(curSlide - 1);
});
if (nextBtn) nextBtn.addEventListener('click', function() {
    goToSlide(curSlide + 1);
});

/* Thumbnail click */
thumbs.forEach(function(t) {
    t.addEventListener('click', function() {
        goToSlide(parseInt(t.getAttribute('data-idx'), 10));
    });
    /* Keyboard support */
    t.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToSlide(parseInt(t.getAttribute('data-idx'), 10));
        }
    });
});

/* Keyboard arrow navigation when carousel is focused */
if (mainWrap) {
    mainWrap.setAttribute('tabindex', '0');
    mainWrap.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            goToSlide(curSlide - 1);
            e.preventDefault();
        }
        if (e.key === 'ArrowRight') {
            goToSlide(curSlide + 1);
            e.preventDefault();
        }
    });
}

/* Also keep the original setSlide() function so any onclick still works */
function setSlide(idx) {
    goToSlide(idx);
}
window.setSlide = setSlide;


/* ── 4. ZOOM PANEL ─────────────────────────────────────────
   Shows an enlarged version of the active carousel image
   when the user hovers over the main image box.
   CSS handles the animation; JS just adds/removes .show.
──────────────────────────────────────────────────────────── */
var zoomPanel = document.getElementById('zoomPanel');

if (mainWrap && zoomPanel) {
    mainWrap.addEventListener('mouseenter', function() {
        zoomPanel.classList.add('show');
        zoomPanel.setAttribute('aria-hidden', 'false');
    });
    mainWrap.addEventListener('mouseleave', function() {
        zoomPanel.classList.remove('show');
        zoomPanel.setAttribute('aria-hidden', 'true');
    });
}


/* ── 5. FAQ ACCORDION ──────────────────────────────────────
   Original toggleFaq() function — preserved exactly.
   Toggles answer visibility with smooth max-height animation.
──────────────────────────────────────────────────────────── */
function toggleFaq(btn) {
    var ans = btn.nextElementSibling;
    var isOpen = ans.classList.contains('open');

    /* Close all */
    document.querySelectorAll('.faq-a').forEach(function(a) {
        a.classList.remove('open');
    });
    document.querySelectorAll('.faq-q').forEach(function(q) {
        q.classList.remove('open');
        q.querySelector('.faq-icon').textContent = '\u2228'; /* ∨ */
    });

    if (!isOpen) {
        ans.classList.add('open');
        btn.classList.add('open');
        btn.querySelector('.faq-icon').textContent = '\u2227'; /* ∧ */
    }
}

/* Expose globally (called via onclick in HTML) */
window.toggleFaq = toggleFaq;


/* ── 6. APPLICATIONS CAROUSEL ──────────────────────────────
   Original logic preserved — slides track left/right.
   Pointer drag added for desktop users.
──────────────────────────────────────────────────────────── */
var appsTrack = document.getElementById('appsTrack');
var appPrev = document.getElementById('appPrev');
var appNext = document.getElementById('appNext');

if (appsTrack) {
    var appsCards = appsTrack.querySelectorAll('.app-card');
    var appsVisible = 4;
    var appIdx = 0;

    function updateAppsCarousel() {
        var cardW = appsTrack.offsetWidth / appsVisible + 20;
        appsTrack.style.transform = 'translateX(-' + (appIdx * cardW) + 'px)';
    }

    if (appPrev) appPrev.addEventListener('click', function() {
        if (appIdx > 0) {
            appIdx--;
            updateAppsCarousel();
        }
    });
    if (appNext) appNext.addEventListener('click', function() {
        if (appIdx < appsCards.length - appsVisible) {
            appIdx++;
            updateAppsCarousel();
        }
    });

    /* Pointer drag */
    var aDrag = false,
        aSX = 0,
        aSOff = 0;
    appsTrack.addEventListener('pointerdown', function(e) {
        aDrag = true;
        aSX = e.clientX;
        aSOff = appIdx;
        appsTrack.setPointerCapture(e.pointerId);
        appsTrack.style.transition = 'none';
    });
    appsTrack.addEventListener('pointermove', function(e) {
        if (!aDrag) return;
        var cardW = appsTrack.offsetWidth / appsVisible + 20;
        var delta = Math.round((aSX - e.clientX) / cardW);
        var newIdx = Math.max(0, Math.min(aSOff + delta, appsCards.length - appsVisible));
        appsTrack.style.transform = 'translateX(-' + (newIdx * cardW) + 'px)';
    });

    function endAppDrag() {
        aDrag = false;
        appsTrack.style.transition = '';
        /* Snap to nearest integer index */
        var cardW = appsTrack.offsetWidth / appsVisible + 20;
        var cur = parseFloat(appsTrack.style.transform.replace('translateX(', '').replace('px)', '') || '0');
        appIdx = Math.round(Math.abs(cur) / cardW);
        appIdx = Math.max(0, Math.min(appIdx, appsCards.length - appsVisible));
        updateAppsCarousel();
    }
    appsTrack.addEventListener('pointerup', endAppDrag);
    appsTrack.addEventListener('pointercancel', endAppDrag);
}


/* ── 7. MANUFACTURING PROCESS TABS ────────────────────────
   Original logic preserved — tab click updates title,
   description, and bullet points.
   Real images added per step (fade transition).
──────────────────────────────────────────────────────────── */
var processData = [{
        title: 'High-Grade Raw Material Selection',
        desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
        points: ['PE100 grade material', 'Optimal molecular weight distribution'],
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'
    },
    {
        title: 'Precision Extrusion Process',
        desc: 'State-of-the-art extruders melt and push the PE100 compound through a precision die to form the pipe profile.',
        points: ['Temperature-controlled zones', 'Consistent melt flow index'],
        img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80'
    },
    {
        title: 'Controlled Cooling System',
        desc: 'The hot extruded pipe is cooled uniformly in water tanks to lock in dimensional accuracy and internal stress distribution.',
        points: ['Vacuum-assisted cooling', 'Multiple cooling stages'],
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'
    },
    {
        title: 'Accurate Sizing & Calibration',
        desc: 'Sizing sleeves ensure the pipe meets exact outer diameter tolerances before proceeding to the next stage.',
        points: ['Laser diameter measurement', 'Automatic adjustment feedback'],
        img: 'https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&q=80'
    },
    {
        title: 'Rigorous Quality Control',
        desc: 'Every pipe undergoes hydrostatic pressure testing, dimensional checks, and visual inspection before release.',
        points: ['100% hydrostatic testing', 'Dimensional audit every 30 min'],
        img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80'
    },
    {
        title: 'Permanent Marking & Traceability',
        desc: 'Pipes are ink-jet marked with key parameters including diameter, pressure rating, production date, and batch number.',
        points: ['IS/ISO standard markings', 'Full batch traceability'],
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'
    },
    {
        title: 'Precision Cutting to Length',
        desc: 'Automated saw cutting equipment cuts pipes to specified lengths with clean, square ends ready for jointing.',
        points: ['Auto-length measurement', 'Smooth cut ends'],
        img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80'
    },
    {
        title: 'Safe Packaging & Dispatch',
        desc: 'Pipes are bundled, strapped, and protected for transport ensuring they arrive in perfect condition at the site.',
        points: ['UV-protected bundling', 'Clear labelling for logistics'],
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'
    }
];

var procStep = 0;

document.getElementById('processTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.p-tab');
    if (!btn) return;
    procStep = parseInt(btn.dataset.step, 10);
    document.querySelectorAll('.p-tab').forEach(function(t) {
        t.classList.remove('active');
    });
    btn.classList.add('active');
    updateProcess();
});

document.getElementById('procPrev').addEventListener('click', function() {
    if (procStep > 0) {
        procStep--;
        syncProcTabs();
        updateProcess();
    }
});
document.getElementById('procNext').addEventListener('click', function() {
    if (procStep < processData.length - 1) {
        procStep++;
        syncProcTabs();
        updateProcess();
    }
});

function syncProcTabs() {
    document.querySelectorAll('.p-tab').forEach(function(t, i) {
        t.classList.toggle('active', i === procStep);
    });
}

function updateProcess() {
    var d = processData[procStep];
    var img = document.getElementById('procImg');

    document.getElementById('procTitle').textContent = d.title;
    document.getElementById('procDesc').textContent = d.desc;

    var ul = document.getElementById('procPoints');
    ul.innerHTML = '';
    d.points.forEach(function(pt) {
        ul.innerHTML += '<li><span class="p-dot"></span>' + pt + '</li>';
    });

    /* Fade-swap the real image */
    if (img) {
        img.style.opacity = '0';
        setTimeout(function() {
            img.src = d.img;
            img.alt = d.title;
            img.style.opacity = '1';
        }, 220);
    }
}

/* Add opacity transition to process image */
(function() {
    var img = document.getElementById('procImg');
    if (img) img.style.transition = 'opacity .22s ease';
})();