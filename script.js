'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.header .navbar');
    const header = document.querySelector('.header');

    // Toggle mobile navigation
    if (menuBtn) {
        menuBtn.onclick = () => {
            navbar.classList.toggle('active');
        };
    }

    // Sticky header and close mobile nav on scroll
    window.onscroll = () => {
        if (navbar) navbar.classList.remove('active');
        if (header) {
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.header .navbar a').forEach(link => {
        link.onclick = () => {
            if (navbar) navbar.classList.remove('active');
        };
    });

    // Video switcher in 'about' section
    document.querySelectorAll('.about .video-container .controls .control-btn').forEach(btn => {
        btn.onclick = () => {
            const src = btn.getAttribute('data-src');
            const videoPlayer = document.querySelector('.about .video-container .video');
            if (src && videoPlayer) {
                videoPlayer.src = src;
            }
        };
    });

    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header .navbar a');

    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // 60% of the section must be visible
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.email');
            const email = emailInput.value.trim();

            // Simple email validation
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

});
