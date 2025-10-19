'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.header .navbar');
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');

    // Toggle mobile navigation
    if (menuBtn) {
        menuBtn.onclick = () => {
            navbar.classList.toggle('active');
        };
    }

    // Sticky header, close mobile nav on scroll, and show scroll-to-top button
    window.onscroll = () => {
        if (navbar) navbar.classList.remove('active');
        if (header) {
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        if (scrollTopBtn) {
            if (window.scrollY > 250) { // Show button after 250px scroll
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
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

    // Booking form validation
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
            today.setHours(0, 0, 0, 0); // Compare dates only, not time

            if (selectedDate < today) {
                alert('Please select a date in the future.');
                dateInput.focus();
                return;
            }

            if (parseInt(travelers, 10) < 1) {
                alert('Number of travelers must be at least 1.');
                travelersInput.focus();
                return;
            }

            // If validation passes
            alert(`Booking request sent!\n\nDestination: ${destination}\nDate: ${date}\nTravelers: ${travelers}\n\nWe will contact you shortly.`);
            bookingForm.reset();
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
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

});
