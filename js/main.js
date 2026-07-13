/* ===== LA CAPPELLETTA · main.js ===== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var intro = document.getElementById('intro');
  function closeIntro() { if (intro) { intro.classList.add('done'); setTimeout(function () { intro.style.display = 'none'; }, 750); } }
  if (intro) { if (reduce) intro.style.display = 'none'; else { document.getElementById('intro-skip').addEventListener('click', closeIntro); setTimeout(closeIntro, 2600); } }

  var header = document.getElementById('site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.getElementById('burger'), nav = document.querySelector('.nav');
  burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }); });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
    setTimeout(function () { reveals.forEach(function (r) { if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('in'); }); }, 1500);
  } else reveals.forEach(function (r) { r.classList.add('in'); });

  // hours: Tue–Sun lunch+dinner, Mon dinner only
  var TABLE = { 0: [[12, 14.5], [19, 23]], 1: [[19, 23]], 2: [[12, 14.5], [19, 23]], 3: [[12, 14.5], [19, 23]], 4: [[12, 14.5], [19, 23]], 5: [[12, 14.5], [19, 23]], 6: [[12, 14.5], [19, 23]] };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmt(h) { var H = Math.floor(h), M = Math.round((h - H) * 60); return H + ':' + (M >= 30 ? '30' : '00'); }
  function romeNow() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' })); }
  function openClose(d) { var w = TABLE[d.getDay()] || [], h = d.getHours() + d.getMinutes() / 60; for (var i = 0; i < w.length; i++) if (h >= w[i][0] && h < w[i][1]) return w[i][1]; return null; }
  function updateLive() {
    var d = romeNow(), close = openClose(d), dot = document.getElementById('live-dot'), txt = document.getElementById('live-text');
    if (!dot) return; var en = LANG === 'en', day = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    if (close !== null) { dot.className = 'open'; txt.textContent = (en ? 'Open now · closes at ' : 'Aperto ora · chiude alle ') + fmt(close); return; }
    dot.className = 'closed'; var info = null, w = TABLE[day] || [];
    for (var i = 0; i < w.length; i++) if (h < w[i][0]) { info = { d: day, t: w[i][0], off: 0 }; break; }
    if (!info) for (var k = 1; k <= 7; k++) { var nd = (day + k) % 7; if (TABLE[nd]) { info = { d: nd, t: TABLE[nd][0][0], off: k }; break; } }
    var name = info.off === 0 ? (en ? 'today' : 'oggi') : (en ? DAYS_EN[info.d] : DAYS_IT[info.d]);
    txt.textContent = (en ? 'Closed · opens ' + name + ' at ' : 'Chiuso · apre ' + name + ' alle ') + fmt(info.t);
  }

  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img');
  document.querySelectorAll('.g-item').forEach(function (fig) { fig.addEventListener('click', function () { lbImg.src = fig.getAttribute('data-full'); lbImg.alt = (fig.querySelector('img') || {}).alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }); });
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); setTimeout(function () { lbImg.src = ''; }, 300); }
  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  var LANG = 'it';
  var EN = {
    'intro.skip': 'Enter →', 'brand.sub': 'Trattoria · Lambrate',
    'nav.storia': 'The story', 'nav.trancio': 'The slice', 'nav.tavola': 'On the table', 'nav.gallery': 'Gallery', 'nav.dove': 'Find us', 'cta.book': 'Book',
    'hero.kicker': 'Trattoria · Pizza by the slice · from the heart of Lambrate',
    'hero.sub': "A historic family-run trattoria, on the corner watched over by the little wayside shrine. Pasta, meat, fish and the big slices of pizza that made it a neighbourhood icon.",
    'hero.cta1': 'Book a table', 'hero.cta2': 'The house speciality',
    'hero.f1': 'Where', 'hero.f2': 'Right now', 'hero.f3': 'Rating', 'hero.live': 'Checking hours…',
    'storia.kicker': 'The story', 'storia.h2': 'A place from another time, from old Milan.',
    'storia.p1': "It takes its name from the <em>cappelletta</em> on the corner — the little votive shrine that has always watched over the crossing of Via Carlo Bertolazzi and Via Conte Rosso. Around it, for generations, a family-run trattoria that is by now a piece of home for Lambrate.",
    'storia.p2': "Big yet welcoming rooms, checked tablecloths, a huge menu and a village-like atmosphere, in the warmest sense of the word. You come to feel good and eat well: pasta, meat, fish, regional wines and slices of pizza.",
    'storia.b1': 'Family-run', 'storia.b2': 'Milanese &amp; regional cooking', 'storia.b3': 'Large rooms, lots of people',
    'trancio.kicker': 'The house speciality', 'trancio.h2': 'The pizza by the slice.',
    'trancio.p': "Tall, soft, well-risen and generous: the Milan-style slice, the one «typical of this area, hard to find elsewhere». From the classic tomato and mozzarella to richer versions with burrata, prosciutto and vegetables. You slice it, bring it to the table, and go back for more.",
    'tavola.kicker': 'On the table', 'tavola.h2': 'What to eat',
    'd.1t': 'Pizza by the slice', 'd.1p': 'The Milanese classic: tall, well-risen dough, plenty of toppings. The reason you come back.',
    'd.2t': 'Gnocco fritto &amp; salumi', 'd.2p': 'Boards of cured meats and cheeses with warm gnocco fritto. The right way to start any dinner.',
    'd.3t': 'Pasta &amp; meat', 'd.3p': 'Cacio e pepe, bigoli, gricia; then pork shank, wild boar and the mains of the old days.',
    'd.4t': 'Desserts &amp; wine', 'd.4p': 'Homemade desserts and a fine list of regional wines to finish at your own pace.',
    'tavola.note': 'Indicative menu. The full menu changes with the seasons: ask in the dining room or call for the day\'s specials.',
    'gallery.kicker': 'Gallery', 'gallery.h2': 'At the table, like the old days',
    'rev.kicker': 'Voices from the neighbourhood', 'rev.h2': '4.2 ★ · and 3,782 reviews',
    'dove.kicker': 'Find us', 'dove.h2': 'On the corner,<br>under the little shrine.',
    'dove.addr': 'Address', 'dove.addr2': '(corner of Via Conte Rosso 31)', 'dove.hours': 'Hours', 'dove.hoursv': 'Tue–Sun 12–14:30 & 19–23 · Mon dinner only 19–23', 'dove.phone': 'Phone', 'dove.route': 'Get directions', 'dove.call': 'Call',
    'faq.h2': 'Frequently asked',
    'faq.q1': 'Where is La Cappelletta?', 'faq.a1': 'At Via Carlo Bertolazzi 26, on the corner of Via Conte Rosso 31, in Lambrate (Milan).',
    'faq.q2': 'When are you open?', 'faq.a2': 'Tuesday to Sunday 12–14:30 and 19–23. Monday dinner only, 19–23.',
    'faq.q3': 'What is the house speciality?', 'faq.a3': 'The Milan-style pizza by the slice, tall and generous, together with gnocco fritto and cured meats.',
    'faq.q4': 'How do I book a table?', 'faq.a4': 'By calling 02 215 1456. The trattoria is large but very busy: booking is best.',
    'foot.sub': 'Trattoria · Lambrate · Milan', 'foot.where': 'Where', 'foot.hours': 'Hours', 'foot.hours2': 'Mon dinner only 19–23', 'foot.contact': 'Contact',
    'foot.disclaimer': 'Demo website. Content and photos gathered from public sources (Google Maps, Instagram); hours, dishes and prices are indicative, to be confirmed with the trattoria.',
    'ab.call': 'Call', 'ab.route': 'Directions'
  };
  var IT = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { IT[el.getAttribute('data-i18n')] = el.innerHTML; });
  function setLang(lang) {
    LANG = lang; var dict = lang === 'en' ? EN : IT;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'), v = dict[k]; if (v == null && lang === 'en') v = IT[k]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    updateLive();
  }
  document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  updateLive(); setInterval(updateLive, 60000);
})();
