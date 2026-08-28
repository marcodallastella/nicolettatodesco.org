document.addEventListener('DOMContentLoaded', () => {

  // --- Header: transparent over hero, solid after scroll ---
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile menu ---
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll reveal ---
  const els = document.querySelectorAll(
    '.about__photo, .about__text, .highlight, .album__cover, .album__info, ' +
    '.project, .video, .contact__image, .contact__content, .tour__date, ' +
    '.pull-quote, .newsletter__inner, .score-card'
  );

  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Lyrics pop-up ---
  const lyricsModal = document.getElementById('lyrics-modal');
  if (lyricsModal) {
    const modalTitle = lyricsModal.querySelector('.lyrics-modal__title');
    const modalBody = lyricsModal.querySelector('.lyrics-modal__body');

    document.querySelectorAll('.album__track-name').forEach(btn => {
      btn.addEventListener('click', () => {
        const lyrics = document.getElementById(btn.dataset.lyrics);
        if (!lyrics) return;
        modalTitle.textContent = btn.textContent;
        modalBody.innerHTML = lyrics.innerHTML;
        lyricsModal.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    lyricsModal.addEventListener('click', (e) => {
      // A click on the dialog element itself is a click on the backdrop
      if (e.target === lyricsModal || e.target.closest('[data-close]')) {
        lyricsModal.close();
      }
    });

    lyricsModal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }

  // --- Contact form ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch('https://formspree.io/f/xpqjejvo', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          btn.textContent = 'Grazie!';
          form.reset();
          setTimeout(() => {
            btn.textContent = 'Send';
            btn.disabled = false;
          }, 3000);
        } else {
          btn.textContent = 'Error — try again';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    });
  }

  // --- Newsletter form placeholder ---
  const nl = document.getElementById('newsletter-form');
  if (nl) {
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = nl.querySelector('button');
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        nl.reset();
      }, 2500);
    });
  }

});