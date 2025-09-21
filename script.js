// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initContactForm();
    initSmoothScrolling();
    initLoadingAnimations();
    initLanguageSwitcher();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Observe feature cards for staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        observer.observe(card);
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.animationDelay = `${index * 0.15}s`;
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (validateForm(formObject)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });

        // Real-time form validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateForm(data) {
    const required = ['name', 'email', 'subject', 'message'];
    let isValid = true;

    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // Clear previous errors
    clearFieldError(fieldName);

    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'This field is required');
        return false;
    }

    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(fieldName, 'Please enter a valid email address');
        return false;
    }

    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Loading animations
function initLoadingAnimations() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .service-card, .value-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// FAQ accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        
        if (question) {
            question.addEventListener('click', function() {
                const answer = item.querySelector('p');
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                } else {
                    item.classList.add('open');
                }
            });
        }
    });
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', scrollToTop);
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Add CSS for notifications and scroll to top button
const additionalStyles = `
    <style>
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-success {
            border-left: 4px solid #10b981;
        }

        .notification-content {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
        }

        .notification-content i {
            color: #10b981;
            font-size: 20px;
        }

        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            margin-left: auto;
        }

        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .scroll-to-top.show {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            background: var(--accent-color);
            transform: translateY(-2px);
        }

        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }

        .faq-item {
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
        }

        .faq-item h4 {
            cursor: pointer;
            position: relative;
            padding-right: 2rem;
            transition: color 0.3s ease;
        }

        .faq-item h4:hover {
            color: var(--primary-color);
        }

        .faq-item h4::after {
            content: '+';
            position: absolute;
            right: 0;
            top: 0;
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        }

        .faq-item.open h4::after {
            transform: rotate(45deg);
        }

        .faq-item p {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            margin-top: 0;
        }

        .faq-item.open p {
            max-height: 200px;
            margin-top: 1rem;
        }

        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            line-height: 1.4;
        }

        .checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
        }

        .social-contact {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }

        .social-contact h4 {
            margin-bottom: 1rem;
        }

        .contact-options {
            margin-top: 4rem;
            padding-top: 4rem;
            border-top: 1px solid var(--border-color);
        }

        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .option-card {
            text-align: center;
            padding: 2rem;
            background: var(--bg-white);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            transition: var(--transition);
        }

        .option-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }

        .option-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }

        .option-icon i {
            font-size: 1.5rem;
            color: white;
        }

        .faq-section {
            margin-top: 4rem;
            padding-top: 4rem;
            border-top: 1px solid var(--border-color);
        }

        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .map-section {
            margin-top: 4rem;
            padding-top: 4rem;
            border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-100px);
            }

            .notification.show {
                transform: translateY(0);
            }

            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    </style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Language Switcher functionality
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Set initial language
    setLanguage(currentLanguage);
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    });
    
    // Ensure language persistence across page loads
    window.addEventListener('load', function() {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        setLanguage(savedLanguage);
    });
}

function setLanguage(lang) {
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Get all elements with data attributes (including headings, paragraphs, etc.)
    const elements = document.querySelectorAll('[data-en][data-sr]');
    
    // Add translating class to all elements
    elements.forEach(element => {
        element.classList.add('translating');
        element.classList.remove('translated');
    });
    
    // Update all elements with data attributes
    setTimeout(() => {
        elements.forEach(element => {
            if (lang === 'sr') {
                const serbianText = element.getAttribute('data-sr');
                if (serbianText) {
                    // Handle different element types
                    if (element.tagName === 'TEXTAREA') {
                        element.placeholder = serbianText;
                    } else if (element.tagName === 'OPTION') {
                        element.textContent = serbianText;
                    } else {
                        // For all other elements including headings, paragraphs, etc.
                        element.textContent = serbianText;
                    }
                }
            } else {
                const englishText = element.getAttribute('data-en');
                if (englishText) {
                    // Handle different element types
                    if (element.tagName === 'TEXTAREA') {
                        element.placeholder = englishText;
                    } else if (element.tagName === 'OPTION') {
                        element.textContent = englishText;
                    } else {
                        // For all other elements including headings, paragraphs, etc.
                        element.textContent = englishText;
                    }
                }
            }
            
            // Remove translating class and add translated class
            element.classList.remove('translating');
            element.classList.add('translated');
        });
        
        // Remove translated class after animation completes
        setTimeout(() => {
            elements.forEach(element => {
                element.classList.remove('translated');
            });
        }, 300);
    }, 150);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update page title based on current page
    updatePageTitle(lang);
}

function updatePageTitle(lang) {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    const titles = {
        'index': {
            'en': 'TK Trade - Professional Trading & Distribution Services',
            'sr': 'TK Trade - Profesionalne usluge trgovine i distribucije'
        },
        'about': {
            'en': 'About Us - TK Trade | Our Mission & Expertise',
            'sr': 'O nama - TK Trade | Naša misija i stručnost'
        },
        'services': {
            'en': 'Our Services - TK Trade | Trading & Distribution Solutions',
            'sr': 'Naše usluge - TK Trade | Rešenja za trgovinu i distribuciju'
        },
        'contact': {
            'en': 'Contact Us - TK Trade | Get In Touch With Our Experts',
            'sr': 'Kontaktirajte nas - TK Trade | Kontaktirajte naše stručnjake'
        }
    };
    
    if (titles[currentPage] && titles[currentPage][lang]) {
        document.title = titles[currentPage][lang];
    }
}
