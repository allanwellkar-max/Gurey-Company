/* ============================================
   GUREY COMPANY - Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Header Scroll Effect ---- */
  const header = document.querySelector('.header');
  const backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Mobile Navigation ---- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

  function openMobileNav() {
    if (mobileNav) {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNav) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Scroll Reveal Animation ---- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---- Counter Animation ---- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---- Testimonial Carousel ---- */
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentSlide = 0;
  let autoPlayInterval;

  function goToSlide(index) {
    if (!track) return;
    const totalSlides = dots.length;
    if (totalSlides === 0) return;
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  if (track && dots.length > 0) startAutoPlay();

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerInner = item.querySelector('.faq-answer-inner');

    if (!question || !answer || !answerInner) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answerInner.scrollHeight + 20 + 'px';
      }
    });
  });

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      let isValid = true;

      for (const [key, value] of formData.entries()) {
        if (key !== 'message' && key !== 'service' && !value.trim()) {
          isValid = false;
          const input = this.querySelector(`[name="${key}"]`);
          if (input) {
            input.style.borderColor = '#EF4444';
            input.addEventListener('focus', function handler() {
              this.style.borderColor = '';
              this.removeEventListener('focus', handler);
            });
          }
        }
      }

      if (isValid) {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }
    });
  }

  /* ---- Portfolio Filter ---- */
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-full-grid .portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
