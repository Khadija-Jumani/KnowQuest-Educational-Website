document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Theme Toggler (Dark / Light Mode)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================
  // 2. Mobile Navigation Drawer
  // ==========================================
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileNav() {
    mobileNav.classList.toggle('open');
    hamburgerMenu.classList.toggle('active');
    const spans = hamburgerMenu.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  hamburgerMenu.addEventListener('click', toggleMobileNav);
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) toggleMobileNav();
    });
  });

  // ==========================================
  // 3. Dual Filter System (Category + Level)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const levelFilterBtns = document.querySelectorAll('.level-filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  let activeCategory = 'all';
  let activeLevel = 'all';

  function applyFilters() {
    courseCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const levelAttr = card.getAttribute('data-level') || '';
      const levels = levelAttr.split(' ');

      const matchCategory = activeCategory === 'all' || category === activeCategory;
      const matchLevel = activeLevel === 'all' || levels.includes(activeLevel);

      if (matchCategory && matchLevel) {
        card.style.display = 'flex';
        card.style.animation = 'scaleUp 0.3s ease-in-out forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  levelFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLevel = btn.getAttribute('data-level');
      applyFilters();
    });
  });

  // ==========================================
  // 4. FAQ Accordion Functionality
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-header-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ==========================================
  // 5. Course Advisor Quiz Engine
  // ==========================================
  const quizSteps = document.querySelectorAll('.quiz-step');
  const nextStepBtns = document.querySelectorAll('.next-step-btn');
  const prevStepBtns = document.querySelectorAll('.prev-step-btn');
  const finishQuizBtn = document.querySelector('.finish-quiz-btn');
  const quizResults = document.getElementById('quiz-results');
  const recommendedGrid = document.getElementById('recommended-courses');
  const restartQuizBtn = document.getElementById('restart-quiz-btn');
  const quizProgressBar = document.getElementById('quiz-progress');

  let quizAnswers = { level: '', interest: '', goal: '' };

  function updateQuizProgress(step) {
    const totalSteps = quizSteps.length;
    const progress = ((step - 1) / totalSteps) * 100;
    quizProgressBar.style.width = `${progress}%`;
  }

  // Setup options click listeners
  quizSteps.forEach((stepDiv, stepIdx) => {
    const stepNumber = stepIdx + 1;
    const options = stepDiv.querySelectorAll('.quiz-option');
    const nextBtn = stepDiv.querySelector('.next-step-btn') || stepDiv.querySelector('.finish-quiz-btn');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        const value = opt.getAttribute('data-value');
        if (stepNumber === 1) quizAnswers.level = value;
        if (stepNumber === 2) quizAnswers.interest = value;
        if (stepNumber === 3) quizAnswers.goal = value;

        if (nextBtn) nextBtn.removeAttribute('disabled');
      });
    });
  });

  // Next Button Clicks
  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.quiz-step');
      const stepNum = parseInt(currentStep.getAttribute('data-step'));
      const nextStepNum = stepNum + 1;
      const nextStep = document.querySelector(`.quiz-step[data-step="${nextStepNum}"]`);
      currentStep.classList.remove('active');
      nextStep.classList.add('active');
      updateQuizProgress(nextStepNum);
    });
  });

  // Prev Button Clicks
  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.quiz-step');
      const stepNum = parseInt(currentStep.getAttribute('data-step'));
      const prevStepNum = stepNum - 1;
      const prevStep = document.querySelector(`.quiz-step[data-step="${prevStepNum}"]`);
      currentStep.classList.remove('active');
      prevStep.classList.add('active');
      updateQuizProgress(prevStepNum);
    });
  });

  // Complete Quiz & Show Results
  if (finishQuizBtn) {
    finishQuizBtn.addEventListener('click', () => {
      const currentStep = finishQuizBtn.closest('.quiz-step');
      currentStep.classList.remove('active');
      quizProgressBar.style.width = '100%';
      quizResults.classList.add('active');
      generateRecommendations();
    });
  }

  // Updated Course Database with levels
  const coursesDatabase = [
    {
      id: 'scratchjr',
      title: 'Scratch Junior (ScratchJr)',
      category: 'tech',
      level: 'kids',
      icon: '🧩',
      teacher: 'Khadija Jumani',
      desc: 'Fun, block-based interactive coding for young kids! Create animated stories, character movements, and interactive mini-games.'
    },
    {
      id: 'scratch',
      title: 'Scratch Block Programming',
      category: 'tech',
      level: 'kids',
      icon: '🐱',
      teacher: 'Khadija Jumani',
      desc: 'Master logic building, sprites, animation loops, and game design principles using MIT Scratch. From basic blocks to complex multi-level games!'
    },
    {
      id: 'python',
      title: 'Basics of Python Coding',
      category: 'tech',
      level: 'kids highschool',
      icon: '🐍',
      teacher: 'Khadija Jumani',
      desc: 'A fun-filled, gamified curriculum starting from variable basics up to building custom mini-games and apps using Python.'
    },
    {
      id: 'ml',
      title: 'Fundamentals of ML and AI',
      category: 'tech',
      level: 'highschool college',
      icon: '🧠',
      teacher: 'Khadija Jumani',
      desc: 'Learn how AI & ML models learn from data! Build neural concepts, image & text classifiers with hands-on visual training tools.'
    },
    {
      id: 'ai',
      title: 'Smart AI Use & Prompts',
      category: 'tech',
      level: 'highschool college',
      icon: '🤖',
      teacher: 'Khadija Jumani',
      desc: 'Learn how to command AI platforms responsibly! Prompt engineering, creative content generation, and AI ethics guidelines.'
    },
    {
      id: 'webdev',
      title: 'Web Development Basics',
      category: 'tech',
      level: 'highschool college',
      icon: '🌐',
      teacher: 'Khadija Jumani',
      desc: 'Build real websites from scratch using HTML, CSS and JavaScript. Create portfolios, landing pages and interactive web projects.'
    },
    {
      id: 'datascience',
      title: 'Data Science & Analytics',
      category: 'tech',
      level: 'college university',
      icon: '📊',
      teacher: 'Khadija Jumani',
      desc: 'Master data analysis, visualization and ML pipelines. Use Python, Pandas and Power BI on real-world datasets.'
    },
    {
      id: 'english-beginner',
      title: 'English for Complete Beginners',
      category: 'english',
      level: 'kids highschool',
      icon: '🔤',
      teacher: 'Khadija Jumani',
      desc: 'Specially designed for non-native English speakers. Start from the very basics — alphabets, vocabulary, simple sentences and everyday conversations.'
    },
    {
      id: 'english-fluency',
      title: 'English Communication & Fluency',
      category: 'english',
      level: 'college university',
      icon: '🗣️',
      teacher: 'Khadija Jumani',
      desc: 'Advanced spoken English for college and professional learners. Focus on fluency, presentations, interviews and international business communication.'
    },
    {
      id: 'spoken-english',
      title: 'Confidence & Spoken English',
      category: 'english',
      level: 'kids highschool college',
      icon: '🎙️',
      teacher: 'Khadija Jumani',
      desc: 'Interactive conversations, accent neutralization, public speaking and building vocabulary through speaking games and real-world scenarios.'
    },
    {
      id: 'video',
      title: 'Video Editing & CapCut',
      category: 'video',
      level: 'kids highschool college',
      icon: '🎬',
      teacher: 'Amanullah Abbasi',
      desc: 'Learn to edit videos like a pro! Master transitions, filters, cuts, visual effects and audio synchronization using CapCut.'
    },
    {
      id: 'design',
      title: 'Creative Graphic Designing',
      category: 'creative',
      level: 'highschool college',
      icon: '🎨',
      teacher: 'Mahnoor Tariq',
      desc: 'Unlock digital design using Canva, Figma and Photoshop. Design logos, social media content, branding materials and presentations.'
    },
    {
      id: 'storytelling',
      title: 'Creative Storytelling',
      category: 'creative',
      level: 'kids highschool',
      icon: '📖',
      teacher: 'Etisam Ul Haq Abbasi',
      desc: 'Enhance imagination through story structuring, expressing emotions, voice acting and writing short stories and scripts.'
    },
    {
      id: 'management',
      title: 'Management & Leadership',
      category: 'skills',
      level: 'highschool college university',
      icon: '💡',
      teacher: 'Khadija Jumani',
      desc: 'Time management, goal setting, presentation skills and emotional intelligence — essential tools for global career success.'
    }
  ];

  function generateRecommendations() {
    recommendedGrid.innerHTML = '';

    // Map goal to category hint
    const goalToCategoryHint = {
      'english-goal': 'english',
      'media': 'video',
      'career': null,
      'hobby': null
    };

    let matches = coursesDatabase.filter(course => {
      const levelList = course.level.split(' ');
      const matchLevel = levelList.includes(quizAnswers.level);

      let matchInterest = false;
      if (quizAnswers.interest === 'tech') matchInterest = course.category === 'tech';
      else if (quizAnswers.interest === 'english') matchInterest = course.category === 'english';
      else if (quizAnswers.interest === 'video') matchInterest = course.category === 'video';
      else if (quizAnswers.interest === 'creative') matchInterest = course.category === 'creative';
      else if (quizAnswers.interest === 'skills') matchInterest = course.category === 'skills';

      return matchLevel && matchInterest;
    });

    // If "Learn English from scratch" goal selected, prioritize English beginner
    if (quizAnswers.goal === 'english-goal') {
      const englishCourses = coursesDatabase.filter(c => c.category === 'english');
      if (englishCourses.length > 0 && matches.length === 0) {
        matches = englishCourses.slice(0, 3);
      }
    }

    // Fallback — show level-matched courses if no interest match
    if (matches.length === 0) {
      matches = coursesDatabase.filter(course => {
        const levelList = course.level.split(' ');
        return levelList.includes(quizAnswers.level);
      }).slice(0, 3);
    }

    // Fallback 2 — show all if nothing
    if (matches.length === 0) {
      matches = coursesDatabase.slice(0, 3);
    }

    matches.forEach(course => {
      const card = document.createElement('div');
      card.className = `course-card ${course.category}`;
      card.style.flexDirection = 'row';
      card.style.alignItems = 'center';
      card.style.padding = '16px';
      card.style.gap = '20px';
      card.style.boxShadow = 'var(--shadow-sm)';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.marginBottom = '12px';

      card.innerHTML = `
        <div style="font-size: 2.2rem; background: var(--primary-glow); padding: 12px; border-radius: 12px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
          ${course.icon}
        </div>
        <div style="flex-grow: 1;">
          <h4 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 4px;">${course.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">Lead Mentor: <strong>${course.teacher}</strong></p>
          <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted);">${course.desc}</p>
        </div>
      `;
      recommendedGrid.appendChild(card);
    });
  }

  // Restart Quiz
  restartQuizBtn.addEventListener('click', () => {
    quizAnswers = { level: '', interest: '', goal: '' };
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    nextStepBtns.forEach(btn => btn.setAttribute('disabled', 'true'));
    finishQuizBtn.setAttribute('disabled', 'true');
    quizResults.classList.remove('active');
    quizSteps.forEach(step => step.classList.remove('active'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    updateQuizProgress(1);
  });

  // ==========================================
  // 6. Free Trial Class Booking Wizard Modal
  // ==========================================
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingBtn = document.getElementById('close-booking-modal');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const modalSteps = document.querySelectorAll('.modal-step');
  const nextModalBtn = document.getElementById('next-modal-btn');
  const prevModalBtn = document.getElementById('prev-modal-btn');
  const modalProgressBar = document.getElementById('booking-progress');
  const modalFooter = document.getElementById('modal-footer');

  let currentModalStepNum = 1;
  let selectedSubjects = [];

  function openBookingModal() {
    bookingModal.classList.add('active');
    resetBookingForm();
  }

  function closeBookingModal() {
    bookingModal.classList.remove('active');
  }

  openBookingBtns.forEach(btn => btn.addEventListener('click', openBookingModal));
  closeBookingBtn.addEventListener('click', closeBookingModal);

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });

  // Subject Selection in Wizard
  const subjectBtns = document.querySelectorAll('.subject-btn');
  subjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const subjectName = btn.getAttribute('data-subject');
      if (btn.classList.contains('selected')) {
        if (!selectedSubjects.includes(subjectName)) selectedSubjects.push(subjectName);
      } else {
        selectedSubjects = selectedSubjects.filter(s => s !== subjectName);
      }
    });
  });

  function validateStep(stepNum) {
    if (stepNum === 1) {
      const studentName = document.getElementById('student-name').value.trim();
      const studentAge = document.getElementById('student-age').value.trim();
      const parentEmail = document.getElementById('parent-email').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!studentName) { alert('Please enter your name.'); return false; }
      if (!studentAge || parseInt(studentAge) < 5 || parseInt(studentAge) > 65) {
        alert('Please enter a valid age between 5 and 65.');
        return false;
      }
      if (!parentEmail || !emailRegex.test(parentEmail)) {
        alert('Please enter a valid email address.');
        return false;
      }
      return true;
    }
    if (stepNum === 2) {
      if (selectedSubjects.length === 0) {
        alert('Please select at least one subject for the trial.');
        return false;
      }
      return true;
    }
    if (stepNum === 3) {
      const date = document.getElementById('preferred-date').value;
      const time = document.getElementById('preferred-time').value;
      const whatsapp = document.getElementById('parent-whatsapp').value.trim();
      if (!date) { alert('Please pick a preferred start date.'); return false; }
      if (!time) { alert('Please pick a preferred time slot.'); return false; }
      if (!whatsapp) { alert('Please enter WhatsApp number.'); return false; }
      return true;
    }
    return true;
  }

  function updateModalProgress() {
    let progressPercentage = 33.33;
    if (currentModalStepNum === 2) progressPercentage = 66.66;
    if (currentModalStepNum === 3) progressPercentage = 100;
    modalProgressBar.style.width = `${progressPercentage}%`;
  }

  function displayStep(stepNum) {
    modalSteps.forEach(step => step.classList.remove('active'));

    if (stepNum === 'success') {
      const successStep = document.querySelector('.modal-step[data-modal-step="success"]');
      successStep.classList.add('active');
      modalFooter.style.display = 'none';
      modalProgressBar.style.width = '100%';
      return;
    }

    const currentStep = document.querySelector(`.modal-step[data-modal-step="${stepNum}"]`);
    currentStep.classList.add('active');

    if (stepNum === 1) {
      prevModalBtn.style.display = 'none';
      nextModalBtn.textContent = 'Select Subjects';
    } else if (stepNum === 2) {
      prevModalBtn.style.display = 'inline-flex';
      nextModalBtn.textContent = 'Choose Timing';
    } else if (stepNum === 3) {
      prevModalBtn.style.display = 'inline-flex';
      nextModalBtn.textContent = 'Confirm Booking';
    }

    updateModalProgress();
  }

  nextModalBtn.addEventListener('click', () => {
    if (!validateStep(currentModalStepNum)) return;

    if (currentModalStepNum < 3) {
      currentModalStepNum++;
      displayStep(currentModalStepNum);
    } else {
      const studentName = document.getElementById('student-name').value;
      const parentEmail = document.getElementById('parent-email').value;
      const date = document.getElementById('preferred-date').value;
      const time = document.getElementById('preferred-time').value;
      const whatsapp = document.getElementById('parent-whatsapp').value;
      const timezone = document.getElementById('timezone').value;

      document.getElementById('summary-student').textContent = studentName;
      document.getElementById('summary-subjects').textContent = selectedSubjects.join(', ');
      document.getElementById('summary-date').textContent = date;
      document.getElementById('summary-time').textContent = time;
      document.getElementById('summary-tz').textContent = timezone;
      document.getElementById('summary-whatsapp').textContent = whatsapp;
      document.getElementById('summary-email').textContent = parentEmail;

      displayStep('success');
    }
  });

  prevModalBtn.addEventListener('click', () => {
    if (currentModalStepNum > 1) {
      currentModalStepNum--;
      displayStep(currentModalStepNum);
    }
  });

  function resetBookingForm() {
    currentModalStepNum = 1;
    selectedSubjects = [];
    document.getElementById('booking-form').reset();
    subjectBtns.forEach(btn => btn.classList.remove('selected'));
    modalFooter.style.display = 'flex';
    displayStep(1);
  }

  // ==========================================
  // 7. Contact Form Handling
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-msg').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) { alert('Please enter your name.'); return; }
      if (!email || !emailRegex.test(email)) { alert('Please enter a valid email address.'); return; }
      if (!msg) { alert('Please write a message.'); return; }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Message...';
      submitBtn.setAttribute('disabled', 'true');

      setTimeout(() => {
        alert(`Thank you, ${name}! Your message has been sent successfully. We will get in touch with you shortly.`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.removeAttribute('disabled');
      }, 1500);
    });
  }

});
