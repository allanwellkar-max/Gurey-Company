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
      founder_credit: 'Founded by: <strong>Salah Ahmed Omar</strong>',
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
      founder_credit: 'تأسيس: <strong>صلاح أحمد عمر</strong>',
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
     AI CHATBOT WIDGET — Multi-Language + Translation
     ============================================ */

  /* ---- Input Sanitization ---- */
  function sanitizeInput(text) {
    return text
      .replace(/['"``]+/g, '')
      .replace(/[.,!?;:()\-—–]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /* ---- Exact Somali Greeting Map (IMMEDIATE match) ---- */
  var somaliGreetings = {
    'asc': 1, 'salaam': 1, 'salama': 1, 'salaan': 1,
    'soo dhowaw': 1, 'soo dhawoow': 1,
    'kaa wanagsan': 1, 'subax wanagsan': 1,
    'galab wanagsan': 1, 'habeen wanagsan': 1,
    'wanagsan tahay': 1, 'iska warran': 1,
    'waa sidee': 1, 'halkee tahay': 1,
    'kaa yeelo': 1, 'nabadeysan': 1, 'salaanta': 1,
    'waaleykum': 1, 'waaleykuma': 1, 'salaan alaykum': 1
  };

  /* ---- Somali Thank-You Map ---- */
  var somaliThanks = {
    'mahadsanid': 1, 'mahadsanidhiin': 1, 'mahadsantahay': 1,
    'mahadsantid': 1, 'waad mahadsan tahay': 1, 'aad mahadsan tahay': 1
  };

  /* ---- Language Detection ---- */
  function detectLanguage(text) {
    var t = sanitizeInput(text);

    // 1. Exact Somali greeting — IMMEDIATE match
    if (somaliGreetings[t]) return 'so';

    // 2. Exact Somali thank — IMMEDIATE match
    if (somaliThanks[t]) return 'so';

    // 3. Arabic: Arabic Unicode block
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(t)) return 'ar';

    // 4. Somali: common Somali words/patterns
    var soWords = /\b(kaan|taan|waxaa|waa|aan|aad|ee|oo|ku|ka|la|iyo|sidoo|markaa|haddii|maxaa|sidee|qof|shirkad|nidaam|adeeg|bog|codsi|xirfad|macluumaad|khad|qiimo|laakiin|hambalyo|mahadsanid|soo dhawoow|guriga|guri|lacag|shaqo|qalab|mashruuc|farsamada|soomaaliya|waxbarasho|caafimaad|ganacsi|dhaqaale|xoolaha|beeraha|diblomaasiyad|arimaha|bulshada|dowlad|gaadiidka|iwm|sidaa|darteed|markasta|qofkasta|wixii|kuwa|intaa|kale|ugu|badan|yara|dhexe|sare|hoose|weyn|yar)\b/i;
    if (soWords.test(t)) return 'so';

    // 5. Turkish: special chars + common words
    if (/[çğıöşüÇĞİÖŞÜ]/.test(t)) return 'tr';
    var trWords = /\b(merhaba|selam|nasıl|nedir|hizmet|iletişim|projeler|fiyat|teşekkür|şirket|gurey|yazılım|web|mobil|tasarım|hosting|dijital|hakkında|portföy|destek|telefon|e-posta|günaydın|iyi|kötü|evet|hayır|lütfen)\b/i;
    if (trWords.test(t)) return 'tr';

    // 6. French: common French words
    var frWords = /\b(bonjour|salut|merci|société|entreprise|services|contact|portfolio|prix|coût|combien|développement|logiciel|site|mobile|conception|hébergement|marque|à propos|aujourd'hui|de quoi|offres|comment|pourquoi|bonsoir|oui|non|s'il vous plaît|je suis|nous|vous|très|aussi|bien|mais|avec|pour|dans|cest|peut|faire|tout|plus|mon|votre|notre)\b/i;
    if (frWords.test(t)) return 'fr';

    // 7. English: default fallback
    return 'en';
  }

  /* ---- MyMemory Free Translation API ---- */
  var translationCache = {};

  function translateText(text, fromLang, toLang) {
    if (fromLang === toLang) return Promise.resolve(text);
    var cacheKey = fromLang + '_' + toLang + '_' + text;
    if (translationCache[cacheKey]) return Promise.resolve(translationCache[cacheKey]);

    var src = fromLang === 'so' ? 'so-SO' : fromLang;
    var tgt = toLang === 'so' ? 'so-SO' : toLang;
    var url = 'https://api.mymemory.translated.net/get?q=' +
      encodeURIComponent(text) +
      '&langpair=' + src + '|' + tgt;

    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
          var translated = data.responseData.translatedText;
          translationCache[cacheKey] = translated;
          return translated;
        }
        return text;
      })
      .catch(function() { return text; });
  }

  /* ---- English Response Database (master) ---- */
  var enResponses = {
    greeting: "Hello! Welcome to Gurey Company. How can I assist you today? I can help with our services, contact info, or founder details (Salah Ahmed Omar).",
    services: "Gurey Company offers a wide range of technology services:\n\n- Software Development\n- Website Development\n- Mobile App Development\n- UI/UX Design\n- AI Solutions\n- Branding & Digital Marketing\n- Hosting & Domain\n- Business / ERP Solutions\n\nWould you like to know more about any specific service?",
    contact: "You can reach us through:\n\n- Phone: +252 61 7684809\n- WhatsApp: +252 61 7684809\n- Email: saalahahmedomar123@gmail.com\n- Visit: Mogadishu, Somalia\n\nOr fill out the contact form on our website!",
    about: "Gurey Company is Somalia's leading technology company, founded in Mogadishu in 2020 by Salah Ahmed Omar. We specialize in building software, websites, and mobile apps that empower businesses across Somalia and East Africa.\n\nWith 200+ completed projects and 50+ happy clients, we bring global standards to the local market.",
    portfolio: "We've worked on exciting projects including:\n\n- Suuqa Muqdisho — E-Commerce Platform\n- SomaliRide — Mobile App\n- PrimePOS — Retail POS System\n\nVisit our Portfolio section to see all our work!",
    pricing: "Project costs vary depending on scope, features, and complexity. We offer competitive pricing tailored to the Somali market. Contact us for a free consultation and quote!\n\nPhone: +252 61 7684809",
    founder: "Gurey Company was founded by Salah Ahmed Omar in Mogadishu, Somalia in 2020. His vision was to bring world-class technology solutions to Somali businesses and drive digital transformation across East Africa.",
    thank: "You're welcome! If you have any other questions, feel free to ask. Have a great day!",
    default: "Thank you for your interest! I can help you with:\n\n- Our services\n- Contact information\n- About Gurey Company\n- Our portfolio\n- Pricing details\n- Information about our founder (Salah Ahmed Omar)\n\nWhat would you like to know?"
  };

  /* ---- Pre-translated responses for fast lookup ---- */
  var chatDB = {
    ar: {
      greeting: "!مرحباً بكم في شركة غوري. كيف يمكنني مساعدتكم اليوم؟ يمكنني المساعدة في خدماتنا أو معلومات الاتصال أو تفاصيل المؤسس (صلاح أحمد عمر).",
      services: "تقدم شركة غوري مجموعة واسعة من الخدمات التقنية:\n\n- تطوير البرمجيات\n- تطوير المواقع الإلكترونية\n- تطوير تطبيقات الهاتف\n- تصميم واجهة المستخدم وتجربة المستخدم\n- حلول الذكاء الاصطناعي\n- العلامة التجارية والتسويق الرقمي\n- الاستضافة والنطاق\n- حلول الأعمال وتخطيط موارد المؤسسات\n\nهل تريد معرفة المزيد عن خدمة معينة؟",
      contact: "يمكنكم التواصل معنا عبر:\n\n- الهاتف: +252 61 7684809\n- واتساب: +252 61 7684809\n- البريد الإلكتروني: saalahahmedomar123@gmail.com\n- زيارة: مقديشو، الصومال\n\nأو قم بملء نموذج الاتصال على موقعنا!",
      about: "شركة غوري هي الشركة التقنية الرائدة في الصومال، تأسست في مقديشو عام 2020 على يد صلاح أحمد عمر. نحن متخصصون في بناء البرمجيات والمواقع وتطبيقات الهاتف التي تمكّن الشركات في الصومال وشرق أفريقيا.\n\nمع أكثر من 200 مشروع مكتمل و 50 عميلاً سعيداً، نقدم معايير عالمية للسوق المحلي.",
      portfolio: "لقد عملنا على مشاريع مثيرة تشمل:\n\n- سوق مقديشو — منصة تجارة إلكترونية\n- SomaliRide — تطبيق هاتف\n- PrimePOS — نظام نقاط بيع تجزئة\n\nقم بزيارة قسم أعمالنا لرؤية جميع مشاريعنا!",
      pricing: "تختلف تكاليف المشروع حسب النطاق والميزات والتعقيد. نقدم أسعاراً تنافسية مصممة خصيصاً للسوق الصومالي. اتصل بنا للحصول على استشارة وعرض أسعار مجاني!\n\nالهاتف: +252 61 7684809",
      founder: "تأسست شركة غوري على يد صلاح أحمد عمر في مقديشو بالصومال عام 2020. كان رؤيته هي تقديم حلول تقنية عالمية المستوى لشركات الصومال وقيادة التحول الرقمي في شرق أفريقيا.",
      thank: "!شكراً لكم! إذا كان لديكم أي أسئلة أخرى، لا تترددوا في السؤال. عدا يوماً سعيداً",
      default: "!شكراً لاهتمامكم يمكنني مساعدتكم في:\n\n- خدماتنا\n- معلومات الاتصال\n- عن شركة غوري\n- أعمالنا\n- تفاصيل الأسعار\n- معلومات عن المؤسس (صلاح أحمد عمر)\n\nماذا تريد أن تعرف؟"
    },
    so: {
      greeting: "Waaleykuma Salaam! Kusoo dhowaw Gurey Company. Waxaan kaa caawin karaa Adeegyada, Xiriirka, ama Macluumaadka Aasaasaha (Salah Ahmed Omar).",
      services: "Gurey Company waxay bixisaa adeegyo technology ah oo dhamaystiran:\n\n- Horumarinta Software-ka\n- Samaynta Bogagga internetka\n- Horumarinta Barnaamijyada Mobile-ka\n- Naqshadaynta UI/UX\n- Xalka AI (Artificial Intelligence)\n- Branding & Suuq-geynta Dijitaalka ah\n- Hosting & Domain\n- Xalka Ganacsiga & ERP\n\nMa rabtaa inaad wax badan ka ogaato adeeg gaar ah?",
      contact: "Waxaad nagala soo xiriiri kartaa:\n\n- Telefoon: +252 61 7684809\n- WhatsApp: +252 61 7684809\n- Email: saalahahmedomar123@gmail.com\n- Booqo: Muqdisho, Soomaaliya\n\nAma buuxi foomka xiriirka ee bogga!",
      about: "Gurey Company waa shirkadda technology ee ugu sarreeya Soomaaliya, waxaana la aasaasay Muqdisho 2020-kii oo la yiraahdo Salah Ahmed Omar. Waxaan ku takoorinnaa samaynta software, bogagga internetka, iyo barnaamijyada mobile-ka ee xoojiya ganacsatada Soomaaliya iyo Bariga Afrika.\n\nIn ka badan 200 mashruuc oo la dhammeeyay iyo 50+ macaamiil faraxsan, waxaan soo bandhignaa heerarka caalamiga ah suuqa maxalliga ah.",
      portfolio: "Waxaan qabanay mashruucyo xiiso leh oo ay ku jiraan:\n\n- Suuqa Muqdisho — Meel wax iibsi online ah\n- SomaliRide — Barnaamij Mobile ah\n- PrimePOS — Nidaamka Iibinta Retail-ka\n\nBooqo qaybta Portfolio-yadayada si aad u aragto dhammaan shaqadayada!",
      pricing: "Kharashyada mashruucu waxay ku kala duwan yihiin baahida, astaamaha, iyo adkaha. Waxaan bixinnaa qiimo tartan ah oo loogu talagalay suuqa Soomaaliya! Nagala soo xiriir wixii talooyin ah ama soo jeedin ah.\n\nTelefoon: +252 61 7684809",
      founder: "Gurey Company waxaa aasaasay Salah Ahmed Omar Muqdisho, Soomaaliya 2020-kii. Aragtidiisu waxay ahayd in la soo bandhigo xalalka technology ee heerka caalamiga ah ganacsatada Soomaaliya oo la hogaamiyo isbeddelka dijitaalka ah ee Bariga Afrika.",
      thank: "Mahadsanid! Haddii aad wax su'aalo ah qabtid, xor u noqo inaad weydiiso. Maalin wanaagsan!",
      default: "Mahadsanid! Waxaan kuu caawin karaa:\n\n- Adeegyadayada\n- Macluumaadka xiriirka\n- Gurey Company\n- Portfolio-yadayada\n- Qiimaha\n- Macluumaad ku saabsan aasaasaha (Salah Ahmed Omar)\n\nKumaa aad rabto inaad ogaato?"
    },
    tr: {
      greeting: "Merhaba! Gurey Company'ye hoş geldiniz. Bugün size nasıl yardımcı olabilirim? Hizmetlerimiz, iletişim bilgilerimiz veya kurucumuz (Salah Ahmed Omar) hakkında bilgi verebilirim.",
      services: "Gurey Company çeşitli teknoloji hizmetleri sunuyor:\n\n- Yazılım Geliştirme\n- Web Sitesi Geliştirme\n- Mobil Uygulama Geliştirme\n- UI/UX Tasarım\n- Yapay Zeka Çözümleri\n- Marka ve Dijital Pazarlama\n- Hosting & Domain\n- İş / ERP Çözümleri\n\nBelirli bir hizmet hakkında daha fazla bilgi ister misiniz?",
      contact: "Bize şu yollardan ulaşabilirsiniz:\n\n- Telefon: +252 61 7684809\n- WhatsApp: +252 61 7684809\n- E-posta: saalahahmedomar123@gmail.com\n- Ziyaret: Mogadişu, Somali\n\nWeb sitemizdeki iletişim formunu doldurun!",
      about: "Gurey Company, 2020 yılında Mogadişu'da Salah Ahmed Omar tarafından kurulan Somali'nin lider teknoloji şirketidir. Somali ve Doğu Afrika'daki işletmeleri güçlendiren yazılımlar, web siteleri ve mobil uygulamalar geliştiriyoruz.\n\n200'den fazla tamamlanmış proje ve 50+ mutlu müşteri ile yerel pazará global standartlar getiriyoruz.",
      portfolio: "Şu heyecan verici projelerde çalıştık:\n\n- Suuqa Muqdisho — E-Ticaret Platformu\n- SomaliRide — Mobil Uygulama\n- PrimePOS — Perakende POS Sistemi\n\nTüm çalışmalarımızı görmek için Portföy bölümümüzü ziyaret edin!",
      pricing: "Proje maliyetleri kapsam, özellikler ve karmaşıklığa göre değişir. Somali pazarına özel rekabetçi fiyatlar sunuyoruz. Ücretsiz danışmanlık ve fiyat teklifi için bize ulaşın!\n\nTelefon: +252 61 7684809",
      founder: "Gurey Company, 2020 yılında Somali Mogadişu'da Salah Ahmed Omar tarafından kuruldu. Vizyonu, Somali işletmelerine dünya standartlarında teknoloji çözümleri sunmak ve Doğu Afrika'da dijital dönüşümü liderlik etmekti.",
      thank: "Rica ederim! Başka sorularınız olursa sormaktan çekinmeyin. İyi günler!",
      default: "İlginiz için teşekkürler! Size şunlar hakkında yardımcı olabilirim:\n\n- Hizmetlerimiz\n- İletişim bilgileri\n- Hakkımızda\n- Portföyümüz\n- Fiyatlandırma\n- Kurucumuz hakkında bilgi (Salah Ahmed Omar)\n\nNe öğrenmek istersiniz?"
    },
    fr: {
      greeting: "Bonjour! Bienvenue chez Gurey Company. Comment puis-je vous aider aujourd'hui? Je peux vous renseigner sur nos services, nos coordonnées ou notre fondateur (Salah Ahmed Omar).",
      services: "Gurey Company propose une large gamme de services technologiques:\n\n- Développement logiciel\n- Développement de sites web\n- Développement d'applications mobiles\n- Design UI/UX\n- Solutions d'intelligence artificielle\n- Branding et marketing digital\n- Hébergement et domaine\n- Solutions Business / ERP\n\nVoulez-vous en savoir plus sur un service spécifique?",
      contact: "Vous pouvez nous contacter via:\n\n- Téléphone: +252 61 7684809\n- WhatsApp: +252 61 7684809\n- Email: saalahahmedomar123@gmail.com\n- Visite: Mogadiscio, Somalie\n\nOu remplissez le formulaire de contact sur notre site!",
      about: "Gurey Company est l'entreprise technologique leader de la Somalie, fondée à Mogadiscio en 2020 par Salah Ahmed Omar. Nous nous spécialisons dans la création de logiciels, de sites web et d'applications mobiles qui renforcent les entreprises en Somalie et en Afrique de l'Est.\n\nAvec plus de 200 projets réalisés et 50+ clients satisfaits, nous apportons des standards mondiaux au marché local.",
      portfolio: "Nous avons travaillé sur des projets passionnants:\n\n- Suuqa Muqdisho — Plateforme e-commerce\n- SomaliRide — Application mobile\n- PrimePOS — Système de point de vente\n\nVisitez notre section Portfolio pour voir tout notre travail!",
      pricing: "Les coûts de projet varient selon la portée, les fonctionnalités et la complexité. Nous offrons des prix compétitifs adaptés au marché somalien. Contactez-nous pour une consultation et un devis gratuit!\n\nTéléphone: +252 61 7684809",
      founder: "Gurey Company a été fondée par Salah Ahmed Omar à Mogadiscio, Somalie en 2020. Sa vision était d'apporter des solutions technologiques de classe mondiale aux entreprises somaliennes et de mener la transformation numérique en Afrique de l'Est.",
      thank: "De rien! Si vous avez d'autres questions, n'hésitez pas à demander. Bonne journée!",
      default: "Merci pour votre intérêt! Je peux vous aider avec:\n\n- Nos services\n- Informations de contact\n- À propos de Gurey Company\n- Notre portfolio\n- Détails sur les prix\n- Informations sur le fondateur (Salah Ahmed Omar)\n\nQue souhaitez-vous savoir?"
    }
  };

  /* ---- Intent Detection (uses sanitized input) ---- */
  function detectIntent(msg) {
    var m = sanitizeInput(msg);

    // IMMEDIATE Somali greeting bypass (return 'greeting' but caller forces 'so')
    if (somaliGreetings[m]) return 'greeting';

    // IMMEDIATE Somali thank bypass
    if (somaliThanks[m]) return 'thank';

    // Greetings (all languages)
    if (/^(hello|hi|hey|howdy|yo|good\s*(morning|afternoon|evening))\b/.test(m)) return 'greeting';
    if (/^(merhaba|selam|günaydın|iyi\s*günler|nasılsın)\b/.test(m)) return 'greeting';
    if (/^(bonjour|salut|coucou|bonsoir|comment\s*(allez|ça va))/.test(m)) return 'greeting';
    if (/^(مرحبا|أهلا|السلام عليكم|صباح|مساء|هاي|هلا)\b/.test(m)) return 'greeting';

    // Services
    if (/\b(service|adeeg|hizmet|développement|logiciel|yazılım|software|web|mobil|tasarım|design|hosting|branding|pazarlama|marketing|ai|erp|nidaam|xorriyad|horumar|samayn)\b/.test(m)) return 'services';
    if (/\b(adeegy|bixi|xaal)\b/.test(m)) return 'services';
    if (/\b(خدمات|تطوير|تصميم|استضافة|تسويق)\b/.test(m)) return 'services';

    // Contact
    if (/\b(contact|xiriir|iletişim|téléphone|telefon|phone|email|whatsapp|address|visited|reach|foofo|hel|qab|nagala\s*xiriir)\b/.test(m)) return 'contact';
    if (/\b(اتصال|هاتف|بريد|تواصل)\b/.test(m)) return 'contact';

    // About / Company
    if (/\b(about|who|what\s*is|tell\s*me\s*about|company|şirket|shirkad|société|hakkında|la\s*société|ka\s*guri|gurey|waa\s*maxay|maxaa\s*tahay|kumaa\s*ad\s*tihiin)\b/.test(m)) return 'about';
    if (/\b(من\s*أنتم|عن\s*الشركة|شركة)\b/.test(m)) return 'about';

    // Portfolio
    if (/\b(portfolio|project|work|projet|proje|mashruuc|works|çalışma|projects|shaqo)\b/.test(m)) return 'portfolio';
    if (/\b(أعمال|مشاريع)\b/.test(m)) return 'portfolio';

    // Pricing
    if (/\b(price|cost|how\s*much|fiyat|qiimo|combien|prix|kharash|quota|quote|lacag|qadar)\b/.test(m)) return 'pricing';
    if (/\b(ثمن|التكلفة|كم\s*السعر)\b/.test(m)) return 'pricing';

    // Founder
    if (/\b(founder|aasaasaha|aasaasay|kurucu|fondateur|المؤسس|salah\s*ahmed\s*omar|salah|omar)\b/.test(m)) return 'founder';

    // Thanks
    if (/\b(thank|teşekkür|merci|shukran|teşekkürler)\b/.test(m)) return 'thank';

    return 'default';
  }

  /* ---- Main Response Generator ---- */
  function getBotResponse(userMessage) {
    var clean = sanitizeInput(userMessage);
    var lang = detectLanguage(userMessage);
    var intent = detectIntent(userMessage);

    // IMMEDIATE Somali response for Somali greetings (no translation)
    if (lang === 'so' && intent === 'greeting') {
      return Promise.resolve(chatDB.so.greeting);
    }

    // IMMEDIATE Somali response for Somali thanks (no translation)
    if (lang === 'so' && intent === 'thank') {
      return Promise.resolve(chatDB.so.thank);
    }

    // Fast path: pre-translated response available
    if (chatDB[lang] && chatDB[lang][intent]) {
      return Promise.resolve(chatDB[lang][intent]);
    }

    // Fallback: get English response and translate to user's language
    var enResponse = enResponses[intent] || enResponses['default'];

    if (lang === 'en') {
      return Promise.resolve(enResponse);
    }

    // Use MyMemory API to translate
    return translateText(enResponse, 'en', lang)
      .then(function(translated) {
        return translated;
      })
      .catch(function() {
        return enResponse;
      });
  }

  /* ---- Chatbot UI ---- */
  var chatbotWidget = document.getElementById('chatbotWidget');
  var chatbotToggle = document.getElementById('chatbotToggle');
  var chatbotMinimize = document.getElementById('chatbotMinimize');
  var chatbotWindow = document.getElementById('chatbotWindow');
  var chatbotMessages = document.getElementById('chatbotMessages');
  var chatbotForm = document.getElementById('chatbotForm');
  var chatbotInput = document.getElementById('chatbotInput');

  function toggleChatbot() {
    chatbotWidget.classList.toggle('open');
    if (chatbotWidget.classList.contains('open') && chatbotInput) {
      setTimeout(function() { chatbotInput.focus(); }, 300);
    }
  }

  function addUserMessage(text) {
    var div = document.createElement('div');
    div.className = 'chatbot-message user';
    div.innerHTML = '<div class="chatbot-message-avatar">You</div><div class="chatbot-message-content"><p>' + escapeHtml(text) + '</p><span class="chatbot-message-time">Just now</span></div>';
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function addBotMessage(text) {
    var typing = document.createElement('div');
    typing.className = 'chatbot-message bot';
    typing.innerHTML = '<div class="chatbot-message-avatar">G</div><div class="chatbot-message-content"><div class="chatbot-typing"><span></span><span></span><span></span></div></div>';
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    setTimeout(function() {
      if (typing.parentNode) chatbotMessages.removeChild(typing);
      var div = document.createElement('div');
      div.className = 'chatbot-message bot';
      div.innerHTML = '<div class="chatbot-message-avatar">G</div><div class="chatbot-message-content"><p>' + text.replace(/\n/g, '<br>') + '</p><span class="chatbot-message-time">Just now</span></div>';
      chatbotMessages.appendChild(div);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 1200);
  }

  function escapeHtml(text) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChatbot);
  if (chatbotMinimize) chatbotMinimize.addEventListener('click', toggleChatbot);

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var text = chatbotInput.value.trim();
      if (!text) return;
      addUserMessage(text);
      chatbotInput.value = '';
      getBotResponse(text).then(function(reply) {
        addBotMessage(reply);
      });
    });
  }

  document.querySelectorAll('.chatbot-quick-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var reply = this.getAttribute('data-reply');
      addUserMessage(reply);
      getBotResponse(reply).then(function(msg) {
        addBotMessage(msg);
      });
      var qrContainer = this.parentElement;
      if (qrContainer) qrContainer.style.display = 'none';
    });
  });

})();
