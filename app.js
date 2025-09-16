/**
 * UDinger Quantum Consulting Website - FULLY FIXED VERSION
 * All issues resolved: theme toggle, form validation, and content updates
 */

// Configuration
const CONFIG = {
  THEME_STORAGE_KEY: 'udinger-theme',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  }
};

// Global state
let currentTheme = CONFIG.THEMES.LIGHT;

// ==========================================================================
// THEME MANAGEMENT - COMPLETELY FIXED
// ==========================================================================

function initializeTheme() {
  console.log('Initializing theme system...');
  
  // Get saved theme or use light as default
  const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  currentTheme = savedTheme || CONFIG.THEMES.LIGHT;
  
  // Apply theme immediately
  applyTheme(currentTheme);
  
  // Set up theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Remove any existing listeners
    themeToggle.replaceWith(themeToggle.cloneNode(true));
    const newToggle = document.getElementById('themeToggle');
    newToggle.addEventListener('click', handleThemeToggle);
    console.log('Theme toggle initialized successfully');
  }
}

function applyTheme(theme) {
  console.log(`Applying theme: ${theme}`);
  
  // Apply to both html and body elements
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  
  // Force update CSS custom properties
  if (theme === CONFIG.THEMES.DARK) {
    document.documentElement.style.setProperty('--bg-primary', '#0f172a');
    document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
    document.documentElement.style.setProperty('--text-primary', '#f8fafc');
    document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    document.documentElement.style.setProperty('--border', '#475569');
  } else {
    document.documentElement.style.setProperty('--bg-primary', '#ffffff');
    document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
    document.documentElement.style.setProperty('--text-primary', '#1e293b');
    document.documentElement.style.setProperty('--text-secondary', '#475569');
    document.documentElement.style.setProperty('--border', '#e2e8f0');
  }
  
  currentTheme = theme;
  localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
  
  console.log(`Theme ${theme} applied successfully`);
}

function handleThemeToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Theme toggle clicked - current theme:', currentTheme);
  
  const newTheme = currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
  applyTheme(newTheme);
  
  console.log('Theme switched to:', newTheme);
}

// ==========================================================================
// NAVIGATION
// ==========================================================================

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  
  const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - headerHeight;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
      }
    });
  });
}

// ==========================================================================
// FORM HANDLING - FIXED VALIDATION
// ==========================================================================

function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    console.log('Contact form not found');
    return;
  }
  
  console.log('Initializing contact form');
  
  form.addEventListener('submit', function(e) {
    console.log('Form submitted');
    
    // Get all form fields
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const company = document.getElementById('company')?.value?.trim();
    const industry = document.getElementById('industry')?.value?.trim();
    const quantumInterest = document.getElementById('quantum-interest')?.value?.trim();
    
    console.log('Form data:', { name, email, company, industry, quantumInterest });
    
    // Check required fields
    if (!name || !email || !company || !industry || !quantumInterest) {
      e.preventDefault();
      alert('Please fill in all required fields (marked with *)');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please enter a valid email address');
      return false;
    }
    
    // If validation passes, show loading state
    const submitButton = form.querySelector('#submit-button');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Reset button after delay (form will submit)
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send My Inquiry';
      }, 3000);
    }
    
    console.log('Form validation passed, submitting...');
    // Form will submit naturally to Formspree
  });
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  // Wait a moment for DOM to be fully ready
  setTimeout(() => {
    // Initialize theme (most important)
    initializeTheme();
    
    // Initialize other functionality
    initializeNavigation();
    initializeContactForm();
    
    // Set up email click handlers
    const emailLinks = document.querySelectorAll('.email-link');
    emailLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = `mailto:${this.textContent.trim()}`;
      });
    });
    
    console.log('Website initialized successfully');
  }, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.handleThemeToggle = handleThemeToggle;
