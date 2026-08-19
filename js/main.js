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
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const currentPage = segments[segments.length - 1] || 'index.html';
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

  /* ---- WhatsApp Floating Button ---- */
  function createWhatsAppButton() {
    const whatsappLink = document.createElement('a');
    whatsappLink.href = 'https://wa.me/252617684809';
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.className = 'whatsapp-float';
    whatsappLink.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(whatsappLink);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWhatsAppButton);
  } else {
    createWhatsAppButton();
  }

  /* ============================================
     LANGUAGE SWITCHER (EN / AR)
     ============================================ */
  const translations = {
    en: {
      brand: 'Gurey',
      nav_home: 'Home', nav_about: 'About', nav_services: 'Services',
      nav_solutions: 'Solutions', nav_portfolio: 'Portfolio', nav_contact: 'Contact Us',
      cta_get_started: 'Get Started',
      hero_badge: "Somalia's Leading Technology Company",
      hero_title: "Empowering Somalia's <span>Digital</span> Future",
      hero_desc: "We build modern software, websites, and mobile apps that transform businesses and drive innovation across Somalia and East Africa.",
      hero_cta1: 'Explore Services', hero_cta2: 'View Our Work',
      stat_projects: 'Projects Completed', stat_clients: 'Happy Clients', stat_years: 'Years Experience',
    },
    ar: {
      brand: 'غوري',
      nav_home: 'الرئيسية', nav_about: 'من نحن', nav_services: 'الخدمات',
      nav_solutions: 'الحلول', nav_portfolio: 'أعمالنا', nav_contact: 'اتصل بنا',
      cta_get_started: 'ابدأ الآن',
      hero_badge: 'شركة التقنية الرائدة في الصومال',
      hero_title: 'تمكين المستقبل <span>الرقمي</span> للصومال',
      hero_desc: 'نبني برامج ومواقع وتطبيقات حديثة تحول الأعمال وتقود الابتكار في الصومال وشرق أفريقيا.',
      hero_cta1: 'استكشف الخدمات', hero_cta2: 'شاهد أعمالنا',
      stat_projects: 'مشاريع مكتملة', stat_clients: 'عملاء سعداء', stat_years: 'سنوات خبرة',
    }
  };

  const langSwitcher = document.getElementById('langSwitcher');
  let currentLang = localStorage.getItem('gurey_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    localStorage.setItem('gurey_lang', lang);
  }

  if (langSwitcher) {
    langSwitcher.addEventListener('click', function(e) {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        applyLanguage(btn.getAttribute('data-lang'));
      }
    });
  }

  if (currentLang !== 'en') {
    applyLanguage(currentLang);
  }

  /* ============================================
     AI CHATBOT WIDGET
     ============================================ */
  const chatbotResponses = {
    "What services do you offer?": "Gurey Company offers a wide range of technology services including:\n\n- Software Development\n- Website Development\n- Mobile App Development\n- UI/UX Design\n- AI Solutions\n- Branding & Digital Marketing\n- Hosting & Domain\n- Business / ERP Solutions\n\nWould you like to know more about any specific service?",
    "How can I contact you?": "You can reach us through:\n\n- Phone: +252 61 7684809\n- WhatsApp: +252 61 7684809\n- Email: saalahahmedomar123@gmail.com\n- Visit: Mogadishu, Somalia\n\nOr fill out the contact form on our Contact page!",
    "What is Gurey Company?": "Gurey Company is Somalia's leading technology company, founded in Mogadishu in 2020. We specialize in building software, websites, and mobile apps that empower businesses across Somalia and East Africa.\n\nWith 200+ completed projects and 50+ happy clients, we bring global standards to the local market.",
    "Show me your portfolio": "We've worked on exciting projects including:\n\n- Suuqa Muqdisho - E-Commerce Platform\n- SomaliRide - Mobile App\n- PrimePOS - Retail POS System\n\nVisit our Portfolio page to see all our work!",
    "default": "Thank you for your interest! I'd be happy to help you with information about Gurey Company. You can ask about:\n\n- Our services\n- Contact information\n- Our company\n- Our portfolio\n\nOr call us at +252 61 7684809!"
  };

  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotMinimize = document.getElementById('chatbotMinimize');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');

  function toggleChatbot() {
    chatbotWidget.classList.toggle('open');
    if (chatbotWidget.classList.contains('open') && chatbotInput) {
      setTimeout(() => chatbotInput.focus(), 300);
    }
  }

  function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('service') || msg.includes('what do you')) {
      return chatbotResponses["What services do you offer?"];
    }
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('reach')) {
      return chatbotResponses["How can I contact you?"];
    }
    if (msg.includes('about') || msg.includes('who') || msg.includes('what is gurey') || msg.includes('company')) {
      return chatbotResponses["What is Gurey Company?"];
    }
    if (msg.includes('portfolio') || msg.includes('project') || msg.includes('work')) {
      return chatbotResponses["Show me your portfolio"];
    }
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      return "Project costs vary depending on scope, features, and complexity. We offer competitive pricing tailored to the Somali market. Contact us for a free consultation and quote!\n\nPhone: +252 61 7684809";
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! Welcome to Gurey Company. How can I assist you today?";
    }
    if (msg.includes('thank')) {
      return "You're welcome! If you have any other questions, feel free to ask. Have a great day!";
    }
    return chatbotResponses["default"];
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chatbot-message user';
    div.innerHTML = '<div class="chatbot-message-avatar">You</div><div class="chatbot-message-content"><p>' + escapeHtml(text) + '</p><span class="chatbot-message-time">Just now</span></div>';
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function addBotMessage(text) {
    const typing = document.createElement('div');
    typing.className = 'chatbot-message bot';
    typing.innerHTML = '<div class="chatbot-message-avatar">G</div><div class="chatbot-message-content"><div class="chatbot-typing"><span></span><span></span><span></span></div></div>';
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    setTimeout(() => {
      chatbotMessages.removeChild(typing);
      const div = document.createElement('div');
      div.className = 'chatbot-message bot';
      div.innerHTML = '<div class="chatbot-message-avatar">G</div><div class="chatbot-message-content"><p>' + text.replace(/\n/g, '<br>') + '</p><span class="chatbot-message-time">Just now</span></div>';
      chatbotMessages.appendChild(div);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 1200);
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChatbot);
  if (chatbotMinimize) chatbotMinimize.addEventListener('click', toggleChatbot);

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const text = chatbotInput.value.trim();
      if (!text) return;
      addUserMessage(text);
      chatbotInput.value = '';
      addBotMessage(getBotResponse(text));
    });
  }

  document.querySelectorAll('.chatbot-quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reply = this.getAttribute('data-reply');
      addUserMessage(reply);
      addBotMessage(getBotResponse(reply));
      const qrContainer = this.parentElement;
      if (qrContainer) qrContainer.style.display = 'none';
    });
  });

})();
