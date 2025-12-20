// FulfillMyNeed.com - Main Application JavaScript

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const postNeedModal = document.getElementById('postNeedModal');
const paymentModal = document.getElementById('paymentModal');
const installPrompt = document.getElementById('installPrompt');
const installCancel = document.getElementById('installCancel');
const installAccept = document.getElementById('installAccept');

// Modal elements
const closeModalButtons = document.querySelectorAll('.close-modal');
const loginBtn = document.querySelector('.btn-login');
const registerBtn = document.querySelector('.btn-register');
const postNeedBtn = document.querySelector('.btn-asker');
const browseNeedsBtn = document.querySelector('.btn-fulfiller');
const registerOptions = document.querySelectorAll('.register-option');

// Forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const postNeedForm = document.getElementById('postNeedForm');

// Carousel elements
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const carouselDots = document.querySelectorAll('.dot');

// App State
let currentSlide = 0;
let deferredPrompt = null;
let currentUser = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startCarousel();
    checkPWAInstall();
});

function initializeApp() {
    // Check for saved user
    const savedUser = localStorage.getItem('fmUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Initialize categories
    initializeCategories();
}

function setupEventListeners() {
    // Navigation
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Auth Buttons
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    if (postNeedBtn) postNeedBtn.addEventListener('click', handlePostNeedClick);
    if (browseNeedsBtn) browseNeedsBtn.addEventListener('click', handleBrowseNeeds);
    
    // Modal Buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Forms
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegistration);
    if (postNeedForm) postNeedForm.addEventListener('submit', handlePostNeed);
    
    // Register Options
    registerOptions.forEach(option => {
        option.addEventListener('click', () => {
            registerOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const userType = option.dataset.type;
            const skillsGroup = document.getElementById('skillsGroup');
            
            if (userType === 'fulfiller') {
                skillsGroup.style.display = 'block';
            } else {
                skillsGroup.style.display = 'none';
                document.querySelectorAll('input[name="skill"]').forEach(cb => cb.checked = false);
            }
        });
    });
    
    // Carousel
    if (carouselPrev) carouselPrev.addEventListener('click', prevSlide);
    if (carouselNext) carouselNext.addEventListener('click', nextSlide);
    
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // PWA Install
    if (installCancel) installCancel.addEventListener('click', hideInstallPrompt);
    if (installAccept) installAccept.addEventListener('click', installPWA);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(searchInput.value);
        });
    }
    
    // Category click handlers
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.querySelector('span').textContent;
            handleCategoryClick(category);
        });
    });
    
    // Verify payment button
    const verifyPaymentBtn = document.getElementById('verifyPayment');
    if (verifyPaymentBtn) {
        verifyPaymentBtn.addEventListener('click', handlePaymentVerification);
    }
}

// Mobile Navigation
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
}

// Modal Functions
function openModal(modal) {
    closeAllModals();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Auth Functions
function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!phone || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login
    const loginBtn = e.target.querySelector('.btn-submit');
    loginBtn.classList.add('loading');
    
    setTimeout(() => {
        // For demo purposes, create a mock user
        const mockUser = {
            id: 'user_' + Date.now(),
            phone: phone,
            name: 'Demo User',
            type: 'asker',
            location: 'Nairobi'
        };
        
        currentUser = mockUser;
        localStorage.setItem('fmUser', JSON.stringify(mockUser));
        
        updateAuthUI();
        closeAllModals();
        showMessage('Login successful! Welcome back.', 'success');
        
        loginBtn.classList.remove('loading');
    }, 1500);
}

function handleRegistration(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const idNumber = document.getElementById('idNumber').value;
    const gender = document.getElementById('gender').value;
    const userType = document.querySelector('.register-option.active').dataset.type;
    
    // Validation
    if (!fullName || !phone || !location || !idNumber || !gender) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // For fulfiller, check skills
    if (userType === 'fulfiller') {
        const selectedSkills = document.querySelectorAll('input[name="skill"]:checked');
        if (selectedSkills.length === 0 || selectedSkills.length > 3) {
            showMessage('Please select 1-3 skills for fulfiller registration', 'error');
            return;
        }
    }
    
    const registerBtn = e.target.querySelector('.btn-submit');
    registerBtn.classList.add('loading');
    
    setTimeout(() => {
        // Create user object
        const user = {
            id: 'user_' + Date.now(),
            name: fullName,
            phone: phone,
            location: location,
            idNumber: idNumber,
            gender: gender,
            type: userType,
            registrationDate: new Date().toISOString()
        };
        
        // Add skills for fulfiller
        if (userType === 'fulfiller') {
            const skills = Array.from(document.querySelectorAll('input[name="skill"]:checked'))
                .map(cb => cb.value);
            user.skills = skills;
            user.fulfillerId = 'FMN-F' + Math.random().toString(36).substr(2, 8).toUpperCase();
            user.paybillCode = '123456'; // Fixed for demo
        }
        
        currentUser = user;
        localStorage.setItem('fmUser', JSON.stringify(user));
        
        updateAuthUI();
        closeAllModals();
        
        const welcomeMsg = userType === 'asker' 
            ? 'Registration successful! You can now post your needs for free.'
            : `Registration successful! Your Fulfiller ID: ${user.fulfillerId}`;
        
        showMessage(welcomeMsg, 'success');
        registerBtn.classList.remove('loading');
    }, 2000);
}

function updateAuthUI() {
    if (currentUser) {
        // Update login/register buttons to show user info
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            navAuth.innerHTML = `
                <div class="user-info">
                    <span>Hi, ${currentUser.name.split(' ')[0]}</span>
                    <a href="#logout" class="btn-logout">Logout</a>
                </div>
            `;
            
            const logoutBtn = navAuth.querySelector('.btn-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
        }
    }
}

function handleLogout(e) {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('fmUser');
    location.reload();
}

// Post Need Functions
function handlePostNeedClick(e) {
    e.preventDefault();
    
    if (!currentUser) {
        openModal(registerModal);
        showMessage('Please register first to post a need', 'info');
        return;
    }
    
    if (currentUser.type !== 'asker') {
        showMessage('Only askers can post needs. Please register as an asker.', 'error');
        return;
    }
    
    openModal(postNeedModal);
}

function handlePostNeed(e) {
    e.preventDefault();
    
    const title = document.getElementById('needTitle').value;
    const description = document.getElementById('needDescription').value;
    const budget = document.getElementById('needBudget').value;
    const location = document.getElementById('needLocation').value;
    const category = document.getElementById('needCategory').value;
    const photo = document.getElementById('needPhoto').files[0];
    
    if (!title || !description || !budget || !location || !category) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        // Create need object
        const need = {
            id: 'need_' + Date.now(),
            title: title,
            description: description,
            budget: parseInt(budget),
            location: location,
            category: category,
            askerId: currentUser.id,
            askerName: currentUser.name,
            datePosted: new Date().toISOString(),
            status: 'open'
        };
        
        // Save to localStorage for demo
        const needs = JSON.parse(localStorage.getItem('fmNeeds') || '[]');
        needs.push(need);
        localStorage.setItem('fmNeeds', JSON.stringify(needs));
        
        closeAllModals();
        showMessage('Your need has been posted successfully! Fulfillers can now see it.', 'success');
        submitBtn.classList.remove('loading');
        
        // Reset form
        e.target.reset();
    }, 1500);
}

function handleBrowseNeeds(e) {
    e.preventDefault();
    
    if (!currentUser) {
        openModal(registerModal);
        showMessage('Please register first to browse needs', 'info');
        return;
    }
    
    showMessage('Loading available needs...', 'info');
    
    // Simulate loading needs
    setTimeout(() => {
        const needs = JSON.parse(localStorage.getItem('fmNeeds') || '[]');
        
        if (needs.length === 0) {
            showMessage('No needs available at the moment. Check back later!', 'info');
        } else {
            // In a real app, this would navigate to needs listing
            showMessage(`Found ${needs.length} needs matching your criteria`, 'success');
            
            // Simulate showing first need for demo
            const firstNeed = needs[0];
            simulateNeedDisplay(firstNeed);
        }
    }, 1000);
}

function simulateNeedDisplay(need) {
    // Create a temporary display for demo
    const display = document.createElement('div');
    display.className = 'message success';
    display.innerHTML = `
        <h4>Sample Need Available:</h4>
        <p><strong>${need.title}</strong></p>
        <p>Budget: KES ${need.budget}</p>
        <p>Location: ${need.location}</p>
        <button id="unlockContact" class="btn-submit" style="margin-top: 10px;">
            Unlock Contact (KES 100)
        </button>
    `;
    
    // Remove any existing display
    const existing = document.querySelector('.need-display');
    if (existing) existing.remove();
    
    display.classList.add('need-display');
    document.querySelector('.hero').after(display);
    
    // Add unlock functionality
    document.getElementById('unlockContact').addEventListener('click', () => {
        openPaymentModal(need);
    });
}

function openPaymentModal(need) {
    if (!currentUser) {
        openModal(registerModal);
        return;
    }
    
    // Generate unique account number for this unlock
    const accountNumber = 'FMN-' + need.id.substr(-6).toUpperCase() + '-' + currentUser.id.substr(-4);
    document.getElementById('accountNumber').textContent = accountNumber;
    document.getElementById('displayAccount').textContent = accountNumber;
    
    openModal(paymentModal);
}

function handlePaymentVerification() {
    const mpesaCode = document.getElementById('mpesaCode').value;
    
    if (!mpesaCode || mpesaCode.length < 8) {
        showMessage('Please enter a valid M-PESA transaction code', 'error');
        return;
    }
    
    const verifyBtn = document.getElementById('verifyPayment');
    verifyBtn.classList.add('loading');
    
    setTimeout(() => {
        // Simulate successful payment verification
        closeAllModals();
        showMessage('Payment verified! Contact details unlocked for 1 hour.', 'success');
        
        // Show mock contact details
        setTimeout(() => {
            showContactDetails();
        }, 1000);
        
        verifyBtn.classList.remove('loading');
    }, 2000);
}

function showContactDetails() {
    const contactModal = document.createElement('div');
    contactModal.className = 'modal active';
    contactModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Contact Details (Unlocked for 1 hour)</h2>
            <div class="payment-info">
                <div class="payment-detail">
                    <span>Name:</span>
                    <span>John M.</span>
                </div>
                <div class="payment-detail">
                    <span>Phone:</span>
                    <span>07XX XXX XXX</span>
                </div>
                <div class="payment-detail">
                    <span>Location:</span>
                    <span>Nairobi</span>
                </div>
            </div>
            <div class="contact-actions">
                <h3>Contact via:</h3>
                <div class="contact-buttons">
                    <button class="contact-btn whatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button class="contact-btn call">
                        <i class="fas fa-phone"></i> Call
                    </button>
                    <button class="contact-btn sms">
                        <i class="fas fa-sms"></i> SMS
                    </button>
                </div>
                <p class="timer-info">⏰ Contact access expires in: <span id="timer">59:59</span></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(contactModal);
    
    // Add close functionality
    contactModal.querySelector('.close-modal').addEventListener('click', () => {
        contactModal.remove();
    });
    
    // Add timer
    startTimer(3600, 'timer'); // 1 hour in seconds
}

function startTimer(duration, displayId) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById(displayId);
    
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        display.textContent = minutes + ":" + seconds;
        
        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "EXPIRED";
            showMessage('Contact access has expired. Pay again to unlock.', 'error');
        }
    }, 1000);
}

// Search and Category Functions
function handleSearch(query) {
    if (!query.trim()) {
        showMessage('Please enter a search term', 'error');
        return;
    }
    
    showMessage(`Searching for "${query}"...`, 'info');
    
    // In a real app, this would filter needs
    setTimeout(() => {
        showMessage(`Found 15 needs matching "${query}"`, 'success');
    }, 1000);
}

function handleCategoryClick(category) {
    showMessage(`Loading ${category} needs...`, 'info');
    
    setTimeout(() => {
        showMessage(`Showing ${category} category`, 'success');
        
        // Scroll to categories section
        document.getElementById('categories').scrollIntoView({
            behavior: 'smooth'
        });
    }, 500);
}

// Carousel Functions
function startCarousel() {
    setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
}

function updateCarousel() {
    const slideWidth = 100; // Percentage
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    
    // Update slides
    carouselSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    carouselDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Category Initialization
function initializeCategories() {
    // This would load categories from an API in a real app
    const categories = [
        'Services',
        'Rentals',
        'Events',
        'Education',
        'Transport',
        'Security',
        'Creative',
        'Farming'
    ];
    
    // Already implemented in HTML
}

// PWA Functions
function checkPWAInstall() {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
        return;
    }
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt after a delay
        setTimeout(() => {
            if (deferredPrompt) {
                showInstallPrompt();
            }
        }, 5000);
    });
    
    // Check if installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        deferredPrompt = null;
        hideInstallPrompt();
    });
}

function showInstallPrompt() {
    if (deferredPrompt && !localStorage.getItem('installPromptDismissed')) {
        installPrompt.classList.add('show');
    }
}

function hideInstallPrompt() {
    installPrompt.classList.remove('show');
    localStorage.setItem('installPromptDismissed', 'true');
}

function installPWA() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted install');
        } else {
            console.log('User dismissed install');
        }
        deferredPrompt = null;
        hideInstallPrompt();
    });
}

// Utility Functions
function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMsg = document.querySelector('.message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Add to page
    document.body.appendChild(message);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Offline Detection
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    if (!navigator.onLine) {
        showMessage('You are offline. Some features may be limited.', 'error');
    } else {
        showMessage('You are back online!', 'success');
    }
}

// Check service worker
if ('serviceWorker' in navigator) {
  console.log('Service Worker supported');
}

// Check PWA installability
if ('BeforeInstallPromptEvent' in window) {
  console.log('PWA install prompt available');
}

// Initialize online status
updateOnlineStatus();