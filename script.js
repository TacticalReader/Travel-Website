'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Utility to throttle function execution
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    // Initialize all interactive components
    const app = {
        init() {
            this.initAOS();
            this.initNavbar();
            this.initScrollEffects();
            this.initVideoSwitcher();
            this.initActiveLinkObserver();
            this.initBookingForm();
            this.initNewsletterForm();
            this.initReviewSlider();
            this.initGalleryLightbox();
        },

        initAOS() {
            // Respect user's motion preferences
            const motionQuery = window.matchMedia('(prefers-reduced-motion)');
            if (!motionQuery || !motionQuery.matches) {
                AOS.init({
                    duration: 800,
                    offset: 150,
                });
            }
        },

        initNavbar() {
            const menuBtn = document.querySelector('#menu-btn');
            const navbar = document.querySelector('.header .navbar');

            if (menuBtn && navbar) {
                menuBtn.onclick = () => {
                    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                    menuBtn.classList.toggle('fa-times');
                    navbar.classList.toggle('active');
                    menuBtn.setAttribute('aria-expanded', !isExpanded);
                    menuBtn.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
                };
            }

            // Close mobile menu when a nav link is clicked
            document.querySelectorAll('.header .navbar a').forEach(link => {
                link.onclick = () => {
                    if (navbar && navbar.classList.contains('active')) {
                        navbar.classList.remove('active');
                        menuBtn.classList.remove('fa-times');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.setAttribute('aria-label', 'Open menu');
                    }
                };
            });
        },

        initScrollEffects() {
            const header = document.querySelector('.header');
            const scrollTopBtn = document.querySelector('.scroll-top-btn');

            const handleScroll = () => {
                if (header) {
                    header.classList.toggle('scrolled', window.scrollY > 0);
                }

                if (scrollTopBtn) {
                    scrollTopBtn.classList.toggle('active', window.scrollY > 250);
                }
            };

            window.addEventListener('scroll', throttle(handleScroll, 100));
        },

        initVideoSwitcher() {
            const controlBtns = document.querySelectorAll('.about .controls .control-btn');
            const videoPlayer = document.querySelector('.about .video-container .video');

            if (!controlBtns.length || !videoPlayer) return;

            const activateButton = (btn) => {
                const src = btn.getAttribute('data-src');
                if (src) {
                    videoPlayer.src = src;
                    controlBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            };

            controlBtns.forEach(btn => {
                btn.addEventListener('click', () => activateButton(btn));
            });

            // Set the first button as active initially
            if (controlBtns.length > 0) {
                controlBtns[0].classList.add('active');
            }
        },

        initActiveLinkObserver() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.header .navbar a');

            if (sections.length > 0 && navLinks.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.6
                };

                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const activeId = `#${entry.target.id}`;
                            navLinks.forEach(link => {
                                link.classList.toggle('active', link.getAttribute('href') === activeId);
                            });
                        }
                    });
                }, observerOptions);

                sections.forEach(section => {
                    sectionObserver.observe(section);
                });
            }
        },

        displayFormMessage(form, message, isSuccess = true) {
            const messageEl = form.querySelector('.form-message');
            if (!messageEl) return;

            messageEl.textContent = message;
            messageEl.className = 'form-message'; // Reset classes
            messageEl.classList.add(isSuccess ? 'success' : 'error', 'visible');

            setTimeout(() => {
                messageEl.classList.remove('visible');
            }, 4000);
        },

        initBookingForm() {
            const bookingForm = document.querySelector('#booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const destinationInput = bookingForm.querySelector('input[type="text"]');
                    const dateInput = bookingForm.querySelector('input[type="date"]');
                    const travelersInput = bookingForm.querySelector('input[type="number"]');

                    const destination = destinationInput.value.trim();
                    const date = dateInput.value;
                    const travelers = travelersInput.value;

                    const selectedDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (!destination || !date || !travelers) {
                        this.displayFormMessage(bookingForm, 'Please fill out all fields.', false);
                        return;
                    }

                    if (selectedDate < today) {
                        this.displayFormMessage(bookingForm, 'Please select a date in the future.', false);
                        dateInput.focus();
                        return;
                    }

                    if (parseInt(travelers, 10) < 1) {
                        this.displayFormMessage(bookingForm, 'Number of travelers must be at least 1.', false);
                        travelersInput.focus();
                        return;
                    }

                    this.displayFormMessage(bookingForm, 'Booking request sent! We will contact you shortly.', true);
                    bookingForm.reset();
                });
            }
        },

        initNewsletterForm() {
            const newsletterForm = document.querySelector('#newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailInput = newsletterForm.querySelector('.email');
                    const email = emailInput.value.trim();

                    if (email && /^[^ \s@]+@[^ \s@]+\.[^ \s@]+$/.test(email)) {
                        this.displayFormMessage(newsletterForm, 'Thank you for subscribing!', true);
                        emailInput.value = '';
                    } else {
                        this.displayFormMessage(newsletterForm, 'Please enter a valid email address.', false);
                    }
                });
            }
        },

        initReviewSlider() {
            const slider = document.querySelector('.review .review-slider');
            const sliderContainer = document.querySelector('.review .box-container');
            const prevBtn = document.querySelector('#prev-review');
            const nextBtn = document.querySelector('#next-review');

            if (!sliderContainer || !prevBtn || !nextBtn) return;

            const slides = Array.from(sliderContainer.children);
            if (slides.length === 0) return;

            let currentIndex = 0;
            let autoPlayInterval;
            let touchStartX = 0;
            let touchEndX = 0;
            const swipeThreshold = 50; // Min pixels for a swipe

            const updateSliderPosition = () => {
                const slideWidth = slides[0].offsetWidth;
                const gap = parseFloat(getComputedStyle(sliderContainer).gap) || 0;
                sliderContainer.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSliderPosition();
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSliderPosition();
            };

            const startAutoPlay = () => {
                stopAutoPlay(); // Prevent multiple intervals
                autoPlayInterval = setInterval(nextSlide, 5000);
            };

            const stopAutoPlay = () => {
                clearInterval(autoPlayInterval);
            };

            const handleTouchStart = (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            };

            const handleTouchEnd = (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            };

            const handleSwipe = () => {
                if (touchEndX < touchStartX - swipeThreshold) {
                    nextSlide();
                }
                if (touchEndX > touchStartX + swipeThreshold) {
                    prevSlide();
                }
            };

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            slider.addEventListener('mouseenter', stopAutoPlay);
            slider.addEventListener('mouseleave', startAutoPlay);

            sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

            window.addEventListener('resize', throttle(updateSliderPosition, 200));
            updateSliderPosition();
            startAutoPlay();
        },

        initGalleryLightbox() {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const galleryItems = document.querySelectorAll('.gallery .box');
            const closeBtn = document.querySelector('.lightbox .close-btn');

            if (!lightbox || !lightboxImg || !closeBtn || galleryItems.length === 0) return;

            const galleryImageSources = Array.from(galleryItems).map(item => item.querySelector('img').src);
            let currentImageIndex = 0;
            let lastFocusedElement;

            const openLightbox = (index) => {
                lastFocusedElement = document.activeElement;
                currentImageIndex = index;
                lightboxImg.src = galleryImageSources[currentImageIndex];
                lightbox.classList.add('active');
                document.addEventListener('keydown', handleKeydown);
                trapFocus();
            };

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.removeEventListener('keydown', handleKeydown);
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                }
            };

            const showNextImage = () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImageSources.length;
                lightboxImg.src = galleryImageSources[currentImageIndex];
            };

            const showPrevImage = () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImageSources.length) % galleryImageSources.length;
                lightboxImg.src = galleryImageSources[currentImageIndex];
            };

            const trapFocus = () => {
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                firstFocusable.focus();

                lightbox.addEventListener('keydown', (e) => {
                    if (e.key !== 'Tab') return;

                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                });
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            };

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(index));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) { // Close only if clicking on the background
                    closeLightbox();
                }
            });
        }
    };

    app.init();
});
