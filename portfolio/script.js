/* =========================================================
   Krishna Sharma — Portfolio v2.1 Script
   Theme · mobile nav · scroll fx · typewriter · counters ·
   card tilt · progress ring · cursor glow
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- 0a. Preloader: fill up, then slide away ---- */
  var preloader = document.getElementById('preloader');
  var preloaderDone = false;
  if (preloader) {
    var plFill = document.getElementById('plFill');
    var plProgress = 0;
    var plTimer = setInterval(function () {
      plProgress = Math.min(plProgress + 8 + Math.random() * 14, 90);
      if (plFill) { plFill.style.width = plProgress + '%'; }
    }, 130);

    function finishPreloader() {
      if (preloaderDone) return;
      preloaderDone = true;
      clearInterval(plTimer);
      if (plFill) { plFill.style.width = '100%'; }
      setTimeout(function () {
        preloader.classList.add('is-done');
        setTimeout(function () {
          if (preloader.parentNode) { preloader.parentNode.removeChild(preloader); }
        }, reduceMotion ? 350 : 800);
      }, 260);
    }

    window.addEventListener('load', finishPreloader);
    setTimeout(finishPreloader, 2200); // never hold the page longer than 2.2s
  }

  /* ---- 1. Footer year ---- */
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---- 2. Dark / light theme toggle ----
     The initial theme is applied pre-paint by a tiny inline
     script in <head>; here we only handle toggling. */
  var themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('ks-theme', theme); } catch (e) {}
    // Keep the browser UI color in sync with the page
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#05070d' : '#f5f7fc');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ---- 3. Mobile hamburger menu ---- */
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close after choosing a section
    navMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    // Close with Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ---- 4. Scroll-driven effects ----
     header border, progress bar, and back-to-top ring. */
  var header = document.getElementById('siteHeader');
  var progressFill = document.getElementById('progressFill');
  var toTop = document.getElementById('toTop');
  var ringFill = document.getElementById('ringFill');
  var RING_LEN = 150.8; // 2π × r(24)

  function onScroll() {
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 8);
    }
    if (progressFill) {
      progressFill.style.width = (progress * 100) + '%';
    }
    if (toTop) {
      toTop.classList.toggle('is-shown', scrollY > 500);
    }
    if (ringFill) {
      ringFill.style.strokeDashoffset = String(RING_LEN * (1 - progress));
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state

  if (toTop) {
    toTop.addEventListener('click', function () {
      if (window.__ksLenis) {
        window.__ksLenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---- 5. Typewriter headline ---- */
  var typeEl = document.getElementById('typeText');
  var WORDS = ['web experiences', 'browser games', '3D worlds', 'clean interfaces'];
  var TYPE_SPEED = 70;   // ms per character
  var ERASE_SPEED = 40;
  var HOLD_TIME = 1900;  // pause on a finished word

  if (typeEl && !reduceMotion) {
    var wordIndex = 0, charIndex = typeEl.textContent.length, erasing = false;

    // normalise the starting word to the first item
    typeEl.textContent = WORDS[0];
    charIndex = WORDS[0].length;
    wordIndex = 0;
    erasing = true; // start by erasing the initial word after a pause

    setTimeout(function tick() {
      var word = WORDS[wordIndex];

      if (!erasing) {
        charIndex++;
        typeEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          erasing = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typeEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          erasing = false;
          wordIndex = (wordIndex + 1) % WORDS.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, ERASE_SPEED);
      }
    }, HOLD_TIME);
  }

  /* ---- 6. Reveal-on-scroll + counters + skill bars ----
     Classes are added here (not in the HTML) so content is
     fully visible when JavaScript is disabled. */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.section-title, .section-label, .section-intro, .bento, .services-grid, .skills-grid, .timeline, .contact-inner > *'
  ).forEach(function (el) {
    el.classList.add(el.matches('.bento, .services-grid, .skills-grid, .timeline')
      ? 'reveal-stagger'
      : 'reveal');
    observer.observe(el);
  });

  // Count-up numbers inside stat cards (once, when visible)
  var counters = document.querySelectorAll('.count');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObserver.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = String(target); return; }
      var start = null, DURATION = 1100;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / DURATION, 1);
        var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = String(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { counterObserver.observe(el); });

  /* ---- 7. Highlight the nav link of the section in view ---- */
  var navLinks = document.querySelectorAll('.nav-link');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.getAttribute('id');
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-38% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ---- 8. Project cards: per-card interaction ----
     GSAP: tilt + raise + thumb parallax + injected glare layer.
     Vanilla fallback keeps the old rAF tilt. */
  var projectCards = document.querySelectorAll('.project-card.tilt');

  if (finePointer && !reduceMotion && window.gsap) {
    projectCards.forEach(function (card) {
      card.classList.add('js-tilt');

      // glare layer reuses the --mx/--my vars set by the spotlight handler
      var glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);

      gsap.set(card, { transformPerspective: 900 });
      var cRx = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      var cRy = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      var cY  = gsap.quickTo(card, 'y',        { duration: 0.7, ease: 'power3.out' });

      var img = card.querySelector('.thumb-link img');
      var iX = img ? gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      var iY = img ? gsap.quickTo(img, 'y', { duration: 0.9, ease: 'power3.out' }) : null;
      var iS = img ? gsap.quickTo(img, 'scale', { duration: 0.9, ease: 'power3.out' }) : null;

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var relX = (e.clientX - r.left) / r.width - 0.5;
        var relY = (e.clientY - r.top) / r.height - 0.5;
        cRx(-relY * 7);
        cRy(relX * 8);
        cY(-8);
        if (iX) { iX(relX * -14); iY(relY * -10); iS(1.08); }
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        cRx(0); cRy(0); cY(0);
        if (iX) { iX(0); iY(0); iS(1); }
      });
    });
  } else if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project-card.tilt').forEach(function (card) {
      var RAISE = -7; // px, matches the CSS hover lift
      var pending = false, px = 0, py = 0;

      function applyTilt() {
        pending = false;
        var rect = card.getBoundingClientRect();
        var relX = (px - rect.left) / rect.width - 0.5;   // -0.5 … 0.5
        var relY = (py - rect.top) / rect.height - 0.5;
        var maxTilt = 5; // degrees
        card.style.transform =
          'translateY(' + RAISE + 'px) ' +
          'rotateX(' + (-relY * maxTilt * 2).toFixed(2) + 'deg) ' +
          'rotateY(' + (relX * maxTilt * 2).toFixed(2) + 'deg)';
      }

      card.addEventListener('mousemove', function (e) {
        px = e.clientX; py = e.clientY;
        if (!pending) {
          pending = true;
          requestAnimationFrame(applyTilt);
        }
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---- 12. GSAP: cinematic entrance, scroll parallax, magnetic buttons ---- */
  if (window.gsap) {
    root.classList.add('gsap-on');
    if (window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); }

    if (!reduceMotion) {
      // delayed so the hero entrance plays after the preloader slides away
      gsap.timeline({ delay: 1.55, defaults: { ease: 'power3.out' } })
        .from('.hero-badge',        { y: 26, autoAlpha: 0, duration: 0.55 })
        .from('.hero-title',        { y: 46, autoAlpha: 0, duration: 0.75 }, '-=0.25')
        .from('.hero-text',         { y: 30, autoAlpha: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-actions > *',  { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.45 }, '-=0.35')
        .from('.hero-stats .stat',  { y: 22, autoAlpha: 0, stagger: 0.07, duration: 0.45 }, '-=0.3')
        .from('.code-window',        { y: 40, scale: 0.94, autoAlpha: 0, duration: 0.9, ease: 'power4.out' }, '-=0.7')
        .from('.glass-badge',       { scale: 0.5, autoAlpha: 0, stagger: 0.09, duration: 0.5, ease: 'back.out(2)' }, '-=0.5');

      if (window.ScrollTrigger) {
        gsap.to('.hero-visual', {
          y: -70, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
        });

        // per-card entrance — simple fade on touch, cinematic tilt on desktop
        var coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        gsap.utils.toArray('.project-card').forEach(function (card, i) {
          if (coarsePointer || reduceMotion) {
            gsap.from(card, {
              y: 36, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
              delay: (i % 2) * 0.08,
              scrollTrigger: { trigger: card, start: 'top 92%' }
            });
          } else {
            gsap.from(card, {
              y: 70, autoAlpha: 0, rotateX: -9, transformPerspective: 800,
              duration: 0.85, ease: 'power3.out', delay: (i % 3) * 0.08,
              scrollTrigger: { trigger: card, start: 'top 90%' }
            });
          }
        });
      }
    }

    // magnetic pull on primary buttons (fine pointers only)
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.btn-primary, .theme-toggle').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.22,
            y: (e.clientY - (r.top + r.height / 2)) * 0.22,
            duration: 0.3, ease: 'power2.out'
          });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
        });
      });
    }
  }

  /* ---- 12b. Blender works gallery lightbox ---- */
  var WORKS = [
    { type: 'image', title: 'Perfume — Product Render',     src: 'media/render-perfume.jpg' },
    { type: 'image', title: 'Vitamin C Serum — Product Render', src: 'media/render-serum.jpg' },
    { type: 'image', title: 'Tumbler — Product Render',      src: 'media/render-tumbler.jpg' },
    { type: 'image', title: 'Bedroom — Interior Render',     src: 'media/render-bedroom.jpg' },
    { type: 'image', title: 'Cannon — Hard-Surface Render',  src: 'media/render-cannon.jpg' },
    { type: 'video', title: 'Bottle Animation',              src: 'media/bottle-animation.mp4' },
    { type: 'video', title: 'Particle Flow Animation',       src: 'media/particle-flow.mp4' },
    { type: 'video', title: 'Calculator Animation',          src: 'media/calculator-animation.mp4' }
  ];

  var lbRoot = document.getElementById('mediaLightbox');
  var lbFrame = document.getElementById('lbFrame');
  var lbTitle = document.getElementById('lbTitle');
  var lbCount = document.getElementById('lbCount');
  var lbGrid = document.getElementById('lbGrid');
  var lbIndex = 0;

  function lbShow(i) {
    lbIndex = (i + WORKS.length) % WORKS.length;
    var item = WORKS[lbIndex];
    lbFrame.innerHTML = '';
    if (item.type === 'image') {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      lbFrame.appendChild(img);
    } else {
      var vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.loop = true;
      vid.playsInline = true;
      lbFrame.appendChild(vid);
    }
    lbTitle.textContent = item.title;
    lbCount.textContent = (lbIndex + 1) + ' / ' + WORKS.length;
    lbGrid.querySelectorAll('.lb-thumb').forEach(function (t, ti) {
      t.classList.toggle('is-active', ti === lbIndex);
    });
  }

  function lbOpen(startAt) {
    if (!lbRoot) return;
    lbRoot.hidden = false;
    document.body.style.overflow = 'hidden';
    if (window.__ksLenis) { window.__ksLenis.stop(); }
    lbShow(typeof startAt === 'number' ? startAt : 0);
  }

  function lbClose() {
    if (!lbRoot) return;
    lbFrame.innerHTML = ''; // stop any playing video
    lbRoot.hidden = true;
    document.body.style.overflow = '';
    if (window.__ksLenis) { window.__ksLenis.start(); }
  }

  if (lbRoot && lbFrame && lbGrid) {
    // build thumbnail grid once
    WORKS.forEach(function (item, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lb-thumb';
      btn.setAttribute('aria-label', item.title);
      if (item.type === 'image') {
        var im = document.createElement('img');
        im.src = item.src;
        im.alt = '';
        im.loading = 'lazy';
        btn.appendChild(im);
      } else {
        var play = document.createElement('span');
        play.className = 'lb-play';
        play.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5v14l12-7Z"/></svg>' + item.title.split(' ')[0];
        btn.appendChild(play);
      }
      btn.addEventListener('click', function () { lbShow(i); });
      lbGrid.appendChild(btn);
    });

    // triggers: [data-gallery] buttons on the Blender card
    document.querySelectorAll('[data-gallery]').forEach(function (trigger) {
      trigger.addEventListener('click', function () { lbOpen(0); });
    });

    // close + navigation
    lbRoot.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', lbClose);
    });
    document.getElementById('lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (lbRoot.hidden) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
      if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    });
  }

  /* ---- 13. Lenis: buttery smooth scrolling ---- */
  if (window.Lenis && !reduceMotion) {
    var lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    window.__ksLenis = lenis;

    (function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    })(null);

    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
    }

    // route anchor links through Lenis for consistent easing
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var id = link.getAttribute('href');
        if (!id || id.length <= 1) return;
        var target = document.querySelector(id);
        if (target) {
          event.preventDefault();
          lenis.scrollTo(target, { offset: -84 });
        }
      });
    });
  }


  /* ---- 14. Ghost section numbers ---- */
  document.querySelectorAll('main > section').forEach(function (sec, i) {
    sec.setAttribute('data-num', String(i + 1).padStart(2, '0'));
  });

  /* ---- 15. Spotlight hover on cards ---- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.bento-card, .service-card, .skill-card, .project-card').forEach(function (card) {
      card.classList.add('spot');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }

  /* ---- 16. Code window: 3D tilt + live typing ---- */
  var codeWindow = document.getElementById('codeWindow');
  var codeEl = document.getElementById('codeLines');

  // subtle tilt toward the cursor (GSAP when available)
  if (codeWindow && finePointer && !reduceMotion) {
    var heroEl = document.querySelector('.hero');
    if (heroEl && window.gsap) {
      gsap.set(codeWindow, { transformPerspective: 1000 });
      var cwRx = gsap.quickTo(codeWindow, 'rotationX', { duration: 1, ease: 'power3.out' });
      var cwRy = gsap.quickTo(codeWindow, 'rotationY', { duration: 1, ease: 'power3.out' });
      heroEl.addEventListener('mousemove', function (e) {
        var r = heroEl.getBoundingClientRect();
        var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        cwRx(-ny * 3.2);
        cwRy(nx * 4.2);
      }, { passive: true });
      heroEl.addEventListener('mouseleave', function () {
        cwRx(0); cwRy(0);
      });
    }
  }

  // typewriter: krishna.js types itself, pauses, loops
  if (codeEl && !reduceMotion) {
    // token classes: kw keyword, vr variable, pr property, st string, pn punctuation, cm comment
    var CODE = [
      [['kw', 'const '], ['vr', 'krishna'], ['pn', ' = {']],
      [['pn', '  '], ['pr', 'role'], ['pn', ': '], ['st', '"Web Developer"'], ['pn', ',']],
      [['pn', '  '], ['pr', 'edu'], ['pn', ': '], ['st', '"BCA · 5th sem"'], ['pn', ',']],
      [['pn', '  '], ['pr', 'builds'], ['pn', ': ['], ['st', '"websites"'], ['pn', ', '], ['st', '"apps"'], ['pn', ', '], ['st', '"games"'], ['pn', '],']],
      [['pn', '};']],
      [['pn', '']],
      [['vr', 'krishna'], ['pn', '.'], ['pr', 'hire'], ['pn', '();  '], ['cm', "// let's talk"]],
    ];
    var CHAR_MS = 26, LINE_MS = 200, RESTART_MS = 4200;

    function typeCode() {
      codeEl.textContent = '';
      var li = 0, ti = 0, ci = 0;
      var span = null;

      function nextChar() {
        if (li >= CODE.length) {
          setTimeout(typeCode, RESTART_MS);
          return;
        }
        var line = CODE[li];
        if (ti >= line.length) {
          li++; ti = 0; ci = 0; span = null;
          codeEl.appendChild(document.createTextNode('\n'));
          setTimeout(nextChar, LINE_MS);
          return;
        }
        if (!span) {
          span = document.createElement('span');
          span.className = 'tok-' + line[ti][0];
          codeEl.appendChild(span);
        }
        var text = line[ti][1];
        if (ci < text.length) {
          span.textContent += text[ci];
          ci++;
          setTimeout(nextChar, CHAR_MS);
        } else {
          ti++; ci = 0; span = null;
          setTimeout(nextChar, 12);
        }
      }
      nextChar();
    }

    // static render for no-JS-anim fallback happens only when motion allowed
    typeCode();
  } else if (codeEl) {
    // reduced motion: render the final code instantly
    var CODE_STATIC = [
      "const krishna = {",
      "  role: \"Web Developer\",",
      "  edu: \"BCA · 5th sem\",",
      "  builds: [\"websites\", \"apps\", \"games\"],",
      "};",
      "",
      "krishna.hire();  // let's talk",
    ].join("\n");
    codeEl.textContent = CODE_STATIC;
  }


  /* ---- 17. Contact form: AJAX submit via FormSubmit (no backend) ---- */
  var cForm = document.getElementById('contactForm');
  if (cForm) {
    var note = document.getElementById('formNote');
    var submitBtn = document.getElementById('formSubmit');

    cForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = cForm.name && cForm.name.value ? cForm.name.value.trim() : '';
      var email = cForm.email && cForm.email.value ? cForm.email.value.trim() : '';
      var message = cForm.message ? cForm.message.value.trim() : '';

      if (!name || !email || !message) {
        note.textContent = 'Please fill in your name, email and message.';
        note.className = 'form-note err';
        return;
      }

      submitBtn.disabled = true;
      note.textContent = 'Sending\u2026';
      note.className = 'form-note';

      // file:// pages can't reach FormSubmit — hand off to the visitor's mail app
      if (location.protocol === 'file:') {
        window.location.href = 'mailto:krishna.sharma.tech06@gmail.com' +
          '?subject=' + encodeURIComponent('Project enquiry — via portfolio') +
          '&body=' + encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        note.textContent = 'Opened your email app with the message pre-filled — just press send.';
        note.className = 'form-note ok';
        submitBtn.disabled = false;
        return;
      }

      // FormSubmit AJAX endpoint — delivers straight to Krishna's inbox
      fetch('https://formsubmit.co/ajax/krishna.sharma.tech06@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: 'Portfolio message from ' + name,
          message: message
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && (data.success === 'true' || data.success === true)) {
            note.textContent = '✓ Message sent! I’ll get back to you soon.';
            note.className = 'form-note ok';
            cForm.reset();
          } else {
            throw new Error('send failed');
          }
        })
        .catch(function () {
          // FormSubmit inactive or unreachable — deliver via the visitor's mail app
          window.location.href = 'mailto:krishna.sharma.tech06@gmail.com' +
            '?subject=' + encodeURIComponent('Project enquiry — via portfolio') +
            '&body=' + encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
          note.textContent = 'Sent via your email app instead — just press send there.';
          note.className = 'form-note ok';
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  }

});
