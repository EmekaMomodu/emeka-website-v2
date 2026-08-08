/* ============================================================
   Emeka Momodu — personal site
   Typing intro, scroll reveals, nav highlighting, copy button.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. typed intro ──────────────────────────────────────
     Walks the [data-anim] elements inside #intro in document order.
     "cmd"  → typewrite the .typed span character by character
     "out"  → reveal the command's output
     "idle" → the final resting prompt
     The text already lives in the HTML, so this is a replay, not a
     source of truth: with JS off everything is simply visible.        */

  function runIntro() {
    var intro = document.getElementById('intro');
    if (!intro) return;

    var steps = Array.prototype.slice.call(intro.querySelectorAll('[data-anim]'));
    if (!steps.length) return;

    // Reduced motion (or no animation support): show it all at once.
    if (reduceMotion) {
      steps.forEach(function (el) { el.classList.add('is-shown'); });
      return;
    }

    // Stash the command text and blank the spans before anything paints.
    steps.forEach(function (el) {
      if (el.dataset.anim !== 'cmd') return;
      var span = el.querySelector('.typed');
      if (span) {
        el.dataset.text = span.textContent;
        span.textContent = '';
      }
    });

    var i = 0;

    function next() {
      if (i >= steps.length) return;

      var el = steps[i++];
      var kind = el.dataset.anim;
      el.classList.add('is-shown');

      if (kind === 'cmd') {
        typeInto(el, next);
      } else if (kind === 'out') {
        setTimeout(next, 420);
      }
      // "idle" is the last step — the caret just stays put.
    }

    function typeInto(el, done) {
      var span = el.querySelector('.typed');
      var text = el.dataset.text || '';
      var pos = 0;

      el.classList.add('is-typing');

      (function tick() {
        if (pos >= text.length) {
          el.classList.remove('is-typing');
          setTimeout(done, 300); // beat before the output appears
          return;
        }
        span.textContent += text.charAt(pos++);
        // Slight jitter reads as a person typing rather than a machine.
        setTimeout(tick, 34 + Math.random() * 46);
      })();
    }

    setTimeout(next, 450);
  }

  /* ── 2. reveal sections on scroll ────────────────────── */

  function runReveals() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // reveal once, then stop watching
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ── 3. highlight the nav link for the section in view ── */

  function runNavSpy() {
    var links = document.querySelectorAll('.nav__list a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];

    Array.prototype.forEach.call(links, function (link) {
      var section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      byId[section.id] = link;
      sections.push(section);
    });

    function setActive(id) {
      Array.prototype.forEach.call(links, function (link) {
        link.classList.toggle('is-active', link === byId[id]);
      });
    }

    // The narrow band means a section counts as "current" once it
    // crosses the middle of the viewport.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { io.observe(section); });

    // Back at the very top, nothing should look selected.
    window.addEventListener('scroll', function () {
      if (window.scrollY < 80) setActive(null);
    }, { passive: true });
  }

  /* ── 4. copy-to-clipboard ───────────────────────────── */

  function runCopy() {
    document.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('[data-copy]') : null;
      if (!btn) return;

      var value = btn.dataset.copy;
      var label = btn.dataset.label || btn.textContent;
      btn.dataset.label = label;

      function settle(ok) {
        btn.textContent = ok ? 'copied ✓' : 'copy failed';
        btn.classList.toggle('is-done', ok);
        setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('is-done');
        }, 1800);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () { settle(true); },
          function () { settle(false); }
        );
      } else {
        settle(false);
      }
    });
  }

  /* ── 5. footer year ─────────────────────────────────── */

  function runYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ── boot ───────────────────────────────────────────── */

  runIntro();
  runReveals();
  runNavSpy();
  runCopy();
  runYear();
})();
