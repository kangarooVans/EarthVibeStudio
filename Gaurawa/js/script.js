/**
 * EARTH VIBE STUDIO — MAIN JAVASCRIPT
 * Core Interactive Features & DOM Manipulation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY NAVBAR SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================================
       2. MOBILE MENU HAMBURGER TOGGLE
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Toggle icon visual state
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            const icon = hamburger.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let currentSection = 'home';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    /* ==========================================================================
       3. INTERACTIVE AUDIO PLAYER COMPONENT
       ========================================================================== */
    const audio = document.getElementById('demoAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    if (audio) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    playIcon.setAttribute('data-lucide', 'pause');
                    lucide.createIcons();
                }).catch(() => {
                    console.log("Audio playback notice: Placeholder audio track not found.");
                });
            } else {
                audio.pause();
                playIcon.setAttribute('data-lucide', 'play');
                lucide.createIcons();
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = `${progressPercent}%`;
                currentTimeEl.textContent = formatTime(audio.currentTime);
            }
        });

        progressBar.addEventListener('click', (e) => {
            const width = progressBar.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            if (duration) {
                audio.currentTime = (clickX / width) * duration;
            }
        });

        audio.addEventListener('ended', () => {
            playIcon.setAttribute('data-lucide', 'play');
            progressFill.style.width = '0%';
            currentTimeEl.textContent = '0:00';
            lucide.createIcons();
        });
    }

    /* ==========================================================================
       4. PORTFOLIO FILTER SYSTEM
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================================
       5. TESTIMONIAL SLIDER INTERACTION
       ========================================================================== */
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('sliderDots');
    let currentIndex = 0;

    // Create pagination dots dynamically
    testimonials.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        testimonials[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        currentIndex = index;
        if (currentIndex >= testimonials.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = testimonials.length - 1;

        testimonials[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Auto-advance testimonial slider
    let sliderInterval = setInterval(() => goToSlide(currentIndex + 1), 6000);

    const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(sliderInterval));
        sliderWrapper.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(() => goToSlide(currentIndex + 1), 6000);
        });
    }

    /* ==========================================================================
       6. CONTACT & BOOKING FORM VALIDATION (Frontend)
       ========================================================================== */
    const bookingForm = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');

            // Reset error states
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

            // Name check
            if (!fullName.value.trim()) {
                fullName.parentElement.classList.add('error');
                isValid = false;
            }

            // Email check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.parentElement.classList.add('error');
                isValid = false;
            }

            // Phone check
            if (!phone.value.trim()) {
                phone.parentElement.classList.add('error');
                isValid = false;
            }

            // Service check
            if (!service.value) {
                service.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                /**
                 * BACKEND INTEGRATION NOTE:
                 * Here you would typically issue a fetch request to your backend script / API.
                 * Example:
                 * fetch('/api/book', { method: 'POST', body: JSON.stringify(formData) })
                 */
                bookingForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            }
        });
    }
});
