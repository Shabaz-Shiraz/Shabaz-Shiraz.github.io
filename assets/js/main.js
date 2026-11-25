/* Site interactions: header state, scroll progress, active nav link, reveal with
   stagger, count-up stats, typing code card, card spotlight, phone tiles,
   mobile menu, theme toggle and footer year. No libraries. */
(function () {
	'use strict';

	var root = document.documentElement;
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var canObserve = 'IntersectionObserver' in window;
	var header = document.getElementById('siteHeader');
	var progress = document.getElementById('scrollProgress');
	var backToTop = document.getElementById('backToTop');
	var nav = document.getElementById('mainNav');
	var menuToggle = document.getElementById('menuToggle');
	var timeline = document.getElementById('timeline');

	/* Header background, scroll progress bar, back-to-top button */
	function onScroll() {
		var y = window.scrollY;
		var max = document.documentElement.scrollHeight - window.innerHeight;
		header.classList.toggle('is-scrolled', y > 20);
		backToTop.classList.toggle('is-visible', y > 600);
		progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
		if (timeline && !reduceMotion) {
			// Fill the line as the timeline passes the middle of the screen
			var r = timeline.getBoundingClientRect();
			var t = (window.innerHeight * 0.6 - r.top) / r.height;
			timeline.style.setProperty('--tl', Math.max(0, Math.min(1, t)).toFixed(3));
		}
	}
	var ticking = false;
	window.addEventListener('scroll', function () {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(function () { onScroll(); ticking = false; });
	}, { passive: true });
	onScroll();

	/* Highlight the nav link of the section in the middle of the viewport */
	var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
	if (canObserve) {
		var sectionObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var id = entry.target.id;
				links.forEach(function (link) {
					var on = link.getAttribute('href') === '#' + id;
					link.classList.toggle('active', on);
					if (on) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		['top'].concat(links.map(function (l) { return l.getAttribute('href').slice(1); })).forEach(function (id) {
			var el = document.getElementById(id);
			if (el) sectionObserver.observe(el);
		});
	}

	/* Count-up for the figures printed in the markup */
	function countUp(el) {
		var target = Number(el.dataset.count);
		var suffix = el.dataset.suffix || '';
		var start = performance.now();
		var duration = 2000;
		var card = el.closest('.stat');
		if (card) card.classList.add('is-counted');
		(function frame(now) {
			var t = Math.max(0, Math.min((now - start) / duration, 1));
			var eased = 1 - Math.pow(1 - t, 3);
			el.textContent = Math.round(target * eased) + suffix;
			if (t < 1) requestAnimationFrame(frame);
		})(start);
	}

	/* Reveal on scroll; children of [data-stagger] get rising delays */
	document.querySelectorAll('[data-stagger]').forEach(function (group) {
		Array.prototype.forEach.call(group.children, function (child, i) {
			child.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
		});
	});
	var revealItems = document.querySelectorAll('.reveal');
	if (reduceMotion || !canObserve) {
		revealItems.forEach(function (el) { el.classList.add('is-visible'); });
	} else {
		root.classList.add('js');
		document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = '0' + (el.dataset.suffix || ''); });
		var revealObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
		revealItems.forEach(function (el) { revealObserver.observe(el); });

		// Count up only once a number is well inside the viewport, so it is seen
		var countObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				setTimeout(function () { countUp(entry.target); }, 250);
				observer.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -15% 0px', threshold: 1 });
		document.querySelectorAll('[data-count]').forEach(function (el) { countObserver.observe(el); });
	}

	/* Typing code card: types a value, pauses, deletes, moves to the next */
	var typing = document.querySelector('[data-typing]');
	if (typing && !reduceMotion) {
		var lines = typing.dataset.typing.split('|');
		var line = 0, chars = lines[0].length, deleting = true;
		typing.classList.add('is-typing');
		(function tick() {
			var text = lines[line];
			typing.textContent = text.slice(0, chars);
			var delay = deleting ? 30 : 60;
			if (!deleting && chars === text.length) { deleting = true; delay = 2200; }
			else if (deleting && chars === 0) { deleting = false; line = (line + 1) % lines.length; delay = 380; }
			else { chars += deleting ? -1 : 1; }
			setTimeout(tick, delay);
		})();
	}

	/* Phone tiles switch on and off, like a smart home screen */
	var tiles = document.querySelectorAll('.ps-tile, .mp-grid i');
	if (tiles.length && !reduceMotion) {
		setInterval(function () {
			var tile = tiles[Math.floor(Math.random() * tiles.length)];
			tile.classList.toggle('on');
		}, 1600);
	}

	/* Cursor spotlight on project cards */
	document.querySelectorAll('.spot').forEach(function (card) {
		card.addEventListener('pointermove', function (e) {
			var r = card.getBoundingClientRect();
			card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
			card.style.setProperty('--my', (e.clientY - r.top) + 'px');
		});
	});

	/* Mobile menu */
	function setMenu(open) {
		nav.classList.toggle('is-open', open);
		header.classList.toggle('is-open', open);
		menuToggle.setAttribute('aria-expanded', String(open));
		menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	}
	menuToggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
	nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
	window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

	/* Theme: a saved choice wins, otherwise follow the system */
	var toggle = document.getElementById('themeToggle');
	var themeColor = document.getElementById('themeColor');
	function applyTheme(theme) {
		root.setAttribute('data-theme', theme);
		var next = theme === 'dark' ? 'light' : 'dark';
		toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
		toggle.setAttribute('title', 'Switch to ' + next + ' theme');
		themeColor.setAttribute('content', theme === 'dark' ? '#0f1115' : '#f6f4ee');
	}
	applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
	toggle.addEventListener('click', function () {
		var theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		if (!reduceMotion && typeof document.startViewTransition === 'function') {
			document.startViewTransition(function () { applyTheme(theme); });
		} else {
			applyTheme(theme);
		}
		try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
	});
	window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
		var saved = null;
		try { saved = localStorage.getItem('theme'); } catch (err) {}
		if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark');
	});

	/* Footer year */
	document.getElementById('year').textContent = new Date().getFullYear();
})();
