/**
 * UDinger Quantum Consulting Website
 * Professional JavaScript with working theme toggle and email form integration
 */

// Configuration
const CONFIG = {
  // Theme settings
  THEME_STORAGE_KEY: 'udinger-theme',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  
  // Animation settings
  SCROLL_OFFSET: 80,
  ANIMATION_DURATION: 600,
  
  // Form settings
  FORM_DELAY: 1500,
  
  // Messages
  MESSAGES: {
    FORM_SUCCESS: 'Thank you for your inquiry! We\'ve received your message and will respond within 24 hours with quantum optimization insights for your business.',
    FORM_ERROR: 'There was an error submitting your form. Please try emailing us directly at info@udinger.com or try again.',
    EMAIL_COPIED: 'Email address copied to clipboard!'
  }
};

// Global state
let currentTheme = CONFIG.THEMES.LIGHT;
let isFormSubmitting = false;

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================

/**
 * Initialize theme system
 */
function initializeTheme() {
  console.log('Initializing theme system...');
  
  // Get saved theme or system preference
  const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine initial theme
  if (savedTheme && Object.values(CONFIG.THEMES).includes(savedTheme)) {
    currentTheme = savedTheme;
  } else if (systemPrefersDark) {
    currentTheme = CONFIG.THEMES.DARK;
  } else {
    currentTheme = CONFIG.THEMES.LIGHT;
  }
  
  // Apply theme
  applyTheme(currentTheme);
  
  // Set up theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
    console.log('Theme toggle button initialized');
  } else {
    console.error('Theme toggle button not found!');
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(CONFIG.THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT);
      }
    });
  }
}

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply
 */
function applyTheme(theme) {
  if (!Object.values(CONFIG.THEMES).includes(theme)) {
    console.error(`Invalid theme: ${theme}`);
    return;
  }
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;
  
  // Save preference
  localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
  
  // Update toggle button ARIA label
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const label = theme === CONFIG.THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
  }
  
  console.log(`Theme applied: ${theme}`);
}

/**
 * Handle theme toggle button click
 */
function handleThemeToggle() {
  console.log('Theme toggle clicked');
  const newTheme = currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
  applyTheme(newTheme);
  
  // Analytics tracking (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'theme_toggle', {
      event_category: 'user_interaction',
      theme: newTheme
    });
  }
}

// ==========================================================================
// NAVIGATION
// ==========================================================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  console.log('Initializing navigation...');
  
  // Handle navigation links
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigationClick);
  });
  
  // Handle scroll for active link highlighting
  window.addEventListener('scroll', updateActiveNavigation, { passive: true });
  
  console.log(`Navigation initialized with ${navLinks.length} links`);
}

/**
 * Handle navigation link clicks
 * @param {Event} event - Click event
 */
function handleNavigationClick(event) {
  event.preventDefault();
  
  const href = event.target.getAttribute('href');
  if (href && href.startsWith('#')) {
    const sectionId = href.substring(1);
    scrollToSection(sectionId);
  }
}

/**
 * Scroll to section with smooth animation
 * @param {string} sectionId - ID of section to scroll to
 */
function scrollToSection(sectionId) {
  console.log(`Scrolling to section: ${sectionId}`);
  
  const element = document.getElementById(sectionId);
  if (!element) {
    console.error(`Section not found: ${sectionId}`);
    return;
  }
  
  const headerHeight = document.querySelector('.header').offsetHeight;
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - headerHeight;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
  
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'navigation', {
      event_category: 'user_interaction',
      section: sectionId
    });
  }
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavigation() {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav__link');
  const headerHeight = document.querySelector('.header').offsetHeight;
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Update active states
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ==========================================================================
// FORM HANDLING
// ==========================================================================

/**
 * Initialize contact form
 */
function initializeContactForm() {
  console.log('Initializing contact form...');
  
  const form = document.getElementById('contactForm');
  if (!form) {
    console.error('Contact form not found!');
    return;
  }
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Add real-time validation
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
  
  console.log('Contact form initialized');
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (isFormSubmitting) {
    console.log('Form already submitting, ignoring');
    return;
  }
  
  console.log('Form submitted');
  
  const form = event.target;
  const submitButton = form.querySelector('#submit-button');
  
  // Validate form
  if (!validateForm(form)) {
    console.log('Form validation failed');
    return;
  }
  
  // Set submitting state
  isFormSubmitting = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  
  // Collect form data
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    industry: formData.get('industry'),
    challenges: formData.get('challenges') || 'Not specified',
    quantumInterest: formData.get('quantum-interest')
  };
  
  console.log('Form data collected:', data);
  
  // Submit form (this will be handled by the form action attribute)
  // For demonstration, we'll simulate the process
  setTimeout(() => {
    try {
      // Check if form has a valid action attribute
      const formAction = form.getAttribute('action');
      
      if (formAction && formAction.includes('YOUR_FORM_ID')) {
        // Show configuration message
        showFormMessage(
          'Form configuration needed. Please see the deployment instructions to set up email delivery.',
          'error'
        );
      } else {
        // Show success message
        showFormMessage(CONFIG.MESSAGES.FORM_SUCCESS, 'success');
        form.reset();
        clearAllFormErrors(form);
      }
      
      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'engagement',
          industry: data.industry,
          quantum_interest: data.quantumInterest
        });
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage(CONFIG.MESSAGES.FORM_ERROR, 'error');
    } finally {
      // Reset submitting state
      isFormSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Send My Inquiry';
    }
  }, CONFIG.FORM_DELAY);
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
  let isValid = true;
  
  // Clear previous messages
  clearAllFormErrors(form);
  
  // Required fields
  const requiredFields = [
    { id: 'name', message: 'Name is required' },
    { id: 'email', message: 'Email is required' },
    { id: 'company', message: 'Company name is required' },
    { id: 'industry', message: 'Please select your industry' },
    { id: 'quantum-interest', message: 'Please select your interest level' }
  ];
  
  requiredFields.forEach(field => {
    const element = form.querySelector(`#${field.id}`);
    if (!element || !element.value.trim()) {
      showFieldError(element, field.message);
      isValid = false;
    }
  });
  
  // Email validation
  const emailField = form.querySelector('#email');
  if (emailField && emailField.value.trim()) {
    if (!isValidEmail(emailField.value.trim())) {
      showFieldError(emailField, 'Please enter a valid email address');
      isValid = false;
    }
  }
  
  return isValid;
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Field to validate
 */
function validateField(field) {
  if (!field.value.trim() && field.hasAttribute('required')) {
    showFieldError(field, `${field.labels[0]?.textContent || 'This field'} is required`);
  } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value.trim())) {
    showFieldError(field, 'Please enter a valid email address');
  } else {
    clearFieldError(field);
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show field error
 * @param {HTMLElement} field - Field with error
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
  if (!field) return;
  
  clearFieldError(field);
  
  field.classList.add('error');
  field.style.borderColor = '#ef4444';
  
  const errorElement = document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.id = `${field.id}-error`;
  
  field.parentNode.appendChild(errorElement);
}

/**
 * Clear field error
 * @param {HTMLElement} field - Field to clear error from
 */
function clearFieldError(field) {
  if (!field) return;
  
  field.classList.remove('error');
  field.style.borderColor = '';
  
  const errorElement = document.getElementById(`${field.id}-error`);
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Clear all form errors
 * @param {HTMLFormElement} form - Form to clear errors from
 */
function clearAllFormErrors(form) {
  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach(el => el.remove());
  
  const errorFields = form.querySelectorAll('.error');
  errorFields.forEach(field => {
    field.classList.remove('error');
    field.style.borderColor = '';
  });
  
  const formMessages = document.getElementById('form-messages');
  if (formMessages) {
    formMessages.innerHTML = '';
  }
}

/**
 * Show form-level message
 * @param {string} message - Message to show
 * @param {string} type - 'success' or 'error'
 */
function showFormMessage(message, type = 'success') {
  const messagesContainer = document.getElementById('form-messages');
  if (!messagesContainer) {
    console.error('Form messages container not found');
    return;
  }
  
  messagesContainer.innerHTML = `
    <div class="form-${type}">
      ${message}
    </div>
  `;
  
  // Auto-remove success messages
  if (type === 'success') {
    setTimeout(() => {
      messagesContainer.innerHTML = '';
    }, 8000);
  }
  
  // Scroll to message
  messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification(CONFIG.MESSAGES.EMAIL_COPIED);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  } else {
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification(CONFIG.MESSAGES.EMAIL_COPIED);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
  }
}

/**
 * Show notification
 * @param {string} message - Notification message
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: var(--font-family);
    animation: slideInRight 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Initialize all website functionality
 */
function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  try {
    // Initialize core functionality
    initializeTheme();
    initializeNavigation();
    initializeContactForm();
    
    // Set up email click handlers
    const emailLinks = document.querySelectorAll('.email-link');
    emailLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(link.textContent.trim());
      });
    });
    
    // Add CSS for notifications (if not already present)
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('UDinger website initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing website:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Make scrollToSection globally available for onclick handlers
window.scrollToSection = scrollToSection;

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeWebsite,
    scrollToSection,
    applyTheme,
    CONFIG
  };
}