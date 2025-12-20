// FulfillMyNeed.com - Main Application Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    setupNavigation();
    setupModals();
    setupCarousel();
    setupCategories();
    setupForms();
    setupPWA();
    loadSampleData();
    
    // Register service worker for PWA
    registerServiceWorker();
}

// ==================== NAVIGATION ====================
function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !event.target.closest('.navbar') && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ==================== MODALS ====================
function setupModals() {
    // Modal elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const postNeedModal = document.getElementById('postNeedModal');
    const unlockContactModal = document.getElementById('unlockContactModal');
    
    // Buttons to open modals
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const postNeedBtn = document.getElementById('postNeedBtn');
    const browseNeedsBtn = document.getElementById('browseNeedsBtn');
    const becomeFulfillerBtn = document.getElementById('becomeFulfillerBtn');
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modal functions
    loginBtn?.addEventListener('click', () => openModal(loginModal));
    registerBtn?.addEventListener('click', () => openModal(registerModal));
    postNeedBtn?.addEventListener('click', () => openModal(postNeedModal));
    browseNeedsBtn?.addEventListener('click', () => {
        // In a real app, this would redirect to needs listing
        alert('This would redirect to the browse needs page in a full implementation.');
    });
    becomeFulfillerBtn?.addEventListener('click', () => {
        openModal(registerModal);
        // Switch to fulfiller tab
        const fulfillerTab = document.querySelector('[data-tab="fulfiller"]');
        if (fulfillerTab) switchRegistrationTab('fulfiller');
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Registration tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchRegistrationTab(tab);
        });
    });
    
    // Switch between asker and fulfiller registration
    const switchToRegister = document.querySelector('.switch-to-register');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset forms in modal
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Reset file upload display
        const fileNameSpan = modal.querySelector('#fileName');
        if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
    }
}

function switchRegistrationTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    
    // Show appropriate form
    document.querySelectorAll('.registration-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tab}RegistrationForm`);
    });
}

// ==================== CAROUSEL ====================
function setupCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!carouselTrack) return;
    
    const carouselItems = [
        {
            title: 'Home Cleaning Service',
            price: 'KES 1,500',
            location: 'Nairobi',
            rating: 4.8,
            icon: 'broom'
        },
        {
            title: 'Plumber Needed Urgently',
            price: 'KES 2,500',
            location: 'Mombasa',
            rating: 4.5,
            icon: 'tools'
        },
        {
            title: 'Tutoring - Mathematics',
            price: 'KES 800/hr',
            location: 'Kisumu',
            rating: 4.9,
            icon: 'graduation-cap'
        },
        {
            title: 'Delivery Service',
            price: 'KES 1,200',
            location: 'Nakuru',
            rating: 4.7,
            icon: 'truck'
        },
        {
            title: 'Event Photography',
            price: 'KES 5,000',
            location: 'Eldoret',
            rating: 4.6,
            icon: 'camera'
        }
    ];
    
    // Populate carousel
    carouselItems.forEach((item, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <div class="carousel-item-image">
                <i class="fas fa-${item.icon}"></i>
            </div>
            <div class="carousel-item-content">
                <h3>${item.title}</h3>
                <div class="carousel-item-price">${item.price}</div>
                <div class="carousel-item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${item.location}</span>
                </div>
                <div class="carousel-item-rating">
                    <i class="fas fa-star"></i>
                    <span>${item.rating}</span>
                    <span>(24 reviews)</span>
                </div>
                <button class="btn btn-outline" style="margin-top: 15px;">View Details</button>
            </div>
        `;
        carouselTrack.appendChild(carouselItem);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    
    let currentSlide = 0;
    const totalSlides = carouselItems.length;
    
    // Update carousel position
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Next slide
    nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    });
    
    // Previous slide
    prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Auto-advance carousel
    let carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, 5000);
    });
}

// ==================== CATEGORIES ====================
function setupCategories() {
    const categoriesGrid = document.querySelector('.categories-grid');
    
    if (!categoriesGrid) return;
    
    const categories = [
        { name: 'Services', icon: 'tools', count: 245 },
        { name: 'Rentals', icon: 'home', count: 189 },
        { name: 'Events & Weddings', icon: 'glass-cheers', count: 76 },
        { name: 'Education & Tutoring', icon: 'graduation-cap', count: 132 },
        { name: 'Transport & Logistics', icon: 'truck', count: 98 },
        { name: 'Pets & Veterinary', icon: 'paw', count: 54 },
        { name: 'Security Services', icon: 'shield-alt', count: 67 },
        { name: 'Creative & Writing', icon: 'pen-fancy', count: 89 },
        { name: 'Legal Services', icon: 'balance-scale', count: 43 },
        { name: 'Beauty & Wellness', icon: 'spa', count: 121 },
        { name: 'Household Help', icon: 'hands-helping', count: 210 },
        { name: 'Farming & Animals', icon: 'tractor', count: 65 },
        { name: 'Digital Services', icon: 'laptop-code', count: 156 },
        { name: 'Repairs & Maintenance', icon: 'wrench', count: 187 }
    ];
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <i class="fas fa-${category.icon}"></i>
            <h3>${category.name}</h3>
            <div class="category-count">${category.count} needs</div>
        `;
        
        categoryCard.addEventListener('click', () => {
            // In a real app, this would filter needs by category
            alert(`This would show all needs in the "${category.name}" category in a full implementation.`);
        });
        
        categoriesGrid.appendChild(categoryCard);
    });
}

// ==================== FORMS ====================
function setupForms() {
    // File upload display
    const fileInput = document.getElementById('needPhoto');
    const fileNameSpan = document.getElementById('fileName');
    
    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameSpan.textContent = this.files[0].name;
            } else {
                fileNameSpan.textContent = 'No file chosen';
            }
        });
    }
    
    // Skills selection limit (1-3)
    const skillCheckboxes = document.querySelectorAll('.skills-selection input[type="checkbox"]');
    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.skills-selection input[type="checkbox"]:checked').length;
            
            if (checkedCount > 3) {
                this.checked = false;
                alert('You can only select up to 3 skills.');
            }
            
            // Ensure at least one is checked (in real form validation)
            if (checkedCount === 0) {
                // Would show validation error in real implementation
            }
        });
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const askerRegistrationForm = document.getElementById('askerRegistrationForm');
    const fulfillerRegistrationForm = document.getElementById('fulfillerRegistrationForm');
    const postNeedForm = document.getElementById('postNeedForm');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    
    // Login form
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would send to backend
        alert('Login functionality would connect to backend in a full implementation.');
        closeModal(document.getElementById('loginModal'));
    });
    
    // Asker registration
    askerRegistrationForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('askerName').value;
        const email = document.getElementById('askerEmail').value;
        const phone = document.getElementById('askerPhone').value;
        const location = document.getElementById('askerLocation').value;
        const idNumber = document.getElementById('askerId').value;
        
        if (!name || !email || !phone || !location || !idNumber) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real app, this would send to backend
        alert('Asker registration successful! You can now post needs for FREE.');
        
        // Generate a sample ID (in real app, this comes from backend)
        const askerId = 'FMN-ASKER-' + Math.floor(1000 + Math.random() * 9000);
        alert(`Your FulfillMyNeed ID: ${askerId}\nKeep this safe for future reference.`);
        
        closeModal(document.getElementById('registerModal'));
    });
    
    // Fulfiller registration
    fulfillerRegistrationForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('fulfillerName').value;
        const email = document.getElementById('fulfillerEmail').value;
        const phone = document.getElementById('fulfillerPhone').value;
        const location = document.getElementById('fulfillerLocation').value;
        
        // Check skills
        const checkedSkills = document.querySelectorAll('.skills-selection input[type="checkbox"]:checked');
        if (checkedSkills.length === 0) {
            alert('Please select at least one skill.');
            return;
        }
        
        if (!name || !email || !phone || !location) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real app, this would send to backend
        alert('Fulfiller registration successful! You can now browse and fulfill needs.');
        
        // Generate sample IDs (in real app, these come from backend)
        const fulfillerId = 'FMN-FULFILLER-' + Math.floor(1000 + Math.random() * 9000);
        const paybillCode = 'FUL' + Math.floor(10000 + Math.random() * 90000);
        
        alert(`Your FulfillMyNeed ID: ${fulfillerId}\nYour Paybill Account Code: ${paybillCode}\n\nKeep these safe for future reference.`);
        
        closeModal(document.getElementById('registerModal'));
    });
    
    // Post need form
    postNeedForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const title = document.getElementById('needTitle').value;
        const description = document.getElementById('needDescription').value;
        const category = document.getElementById('needCategory').value;
        const budget = document.getElementById('needBudget').value;
        const location = document.getElementById('needLocation').value;
        
        if (!title || !description || !category || !budget || !location) {
            alert('Please fill in all required fields.');
            return;
        }
        
        if (parseInt(budget) < 100) {
            alert('Budget must be at least KES 100.');
            return;
        }
        
        // In a real app, this would send to backend
        alert('Your need has been posted successfully! Fulfillers can now see it and express interest.');
        
        // Show the contact unlocking info
        const accountNumber = 'FMN-ASKER-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('accountNumber').textContent = accountNumber;
        document.getElementById('unlockNeedTitle').textContent = title;
        
        closeModal(document.getElementById('postNeedModal'));
        
        // Show a confirmation with next steps
        setTimeout(() => {
            alert(`Your need "${title}" is now live!\n\nFulfillers will pay KES 100 to unlock your contact details.\nYour Paybill account code: ${accountNumber}`);
        }, 300);
    });
    
    // Confirm payment for unlocking contact
    confirmPaymentBtn?.addEventListener('click', function() {
        const mpesaCode = document.getElementById('mpesaCode')?.value;
        
        if (!mpesaCode || mpesaCode.length < 8) {
            alert('Please enter a valid M-Pesa transaction code.');
            return;
        }
        
        // In a real app, this would verify with backend
        alert(`Payment confirmed! Contact details unlocked for 1 hour.\n\nTransaction: ${mpesaCode}\n\nAsker contact details would appear here in a full implementation.`);
        
        closeModal(document.getElementById('unlockContactModal'));
        
        // Show contact details (simulated)
        setTimeout(() => {
            alert('CONTACT DETAILS UNLOCKED:\n\nName: John M.\nPhone: 0712 XXX XXX\nWhatsApp: Available\nLocation: Nairobi West\n\nThese details are available for 1 hour only.');
        }, 500);
    });
}

// ==================== PWA FUNCTIONALITY ====================
function setupPWA() {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running in standalone PWA mode');
        return;
    }
    
    // Show install prompt
    let deferredPrompt;
    const pwaPrompt = document.getElementById('pwaPrompt');
    const installBtn = document.getElementById('installPwaBtn');
    const dismissBtn = document.getElementById('dismissPwaBtn');
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show the install prompt
        setTimeout(() => {
            pwaPrompt.classList.add('show');
        }, 5000);
    });
    
    // Install button click
    installBtn?.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Hide the install prompt
        pwaPrompt.classList.remove('show');
        
        // Clear the deferredPrompt variable
        deferredPrompt = null;
    });
    
    // Dismiss button
    dismissBtn?.addEventListener('click', () => {
        pwaPrompt.classList.remove('show');
        // Store dismissal in localStorage
        localStorage.setItem('pwaPromptDismissed', 'true');
    });
    
    // Check if user previously dismissed
    if (localStorage.getItem('pwaPromptDismissed') === 'true') {
        pwaPrompt.style.display = 'none';
    }
}

// ==================== SERVICE WORKER ====================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// ==================== SAMPLE DATA LOADING ====================
function loadSampleData() {
    // This function would load data from an API in a real implementation
    console.log('Loading sample data for FulfillMyNeed.com');
    
    // Update stats in categories (simulate dynamic data)
    setTimeout(() => {
        const categoryCounts = document.querySelectorAll('.category-count');
        categoryCounts.forEach(countEl => {
            const currentCount = parseInt(countEl.textContent);
            const newCount = currentCount + Math.floor(Math.random() * 10);
            countEl.textContent = `${newCount} needs`;
        });
    }, 2000);
}

// ==================== UTILITY FUNCTIONS ====================
// Format currency for Kenya
function formatKES(amount) {
    return `KES ${amount.toLocaleString('en-KE')}`;
}

// Simulate API call delay
function simulateAPICall(delay = 1000) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);