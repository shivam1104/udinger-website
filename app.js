/**
 * UDinger Quantum Consulting Website - FIXED THEME TOGGLE
 * This version properly switches the entire website theme
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
// THEME MANAGEMENT - FIXED VERSION
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
  
  // Apply theme immediately
  applyTheme(currentTheme);
  
  // Set up theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
    console.log('Theme toggle button initialized');
  } else {
    console.error('Theme toggle button not found!');
  }
}

/**
 * Apply theme to document - FIXED VERSION
 */
function applyTheme(theme) {
  console.log(`Applying theme: ${theme}`);
  
  // Apply theme to document root
  document.documentElement.setAttribute('data-theme', theme);
  
  // Also apply to body for immediate effect
  document.body.setAttribute('data-theme', theme);
  
  // Update current theme
  currentTheme = theme;
  
  // Save preference
  localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
  
  // Update toggle button ARIA label
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const label = theme === CONFIG.THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
  }
  
  console.log(`Theme applied successfully: ${theme}`);
}

/**
 * Handle theme toggle button click - FIXED VERSION
 */
function handleThemeToggle(event) {
  event.preventDefault();
  console.log('Theme toggle clicked');
  
  const newTheme = currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
  applyTheme(newTheme);
  
  console.log(`Theme switched from ${currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT} to ${newTheme}`);
}

// ==========================================================================
// NAVIGATION
// ==========================================================================

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  
  const headerHeight = document.querySelector('.header').offsetHeight;
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
// FORM HANDLING
// ==========================================================================

function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      industry: formData.get('industry'),
      challenges: formData.get('challenges'),
      quantumInterest: formData.get('quantum-interest')
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.company || !data.industry || !data.quantumInterest) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Submit button feedback
    const submitButton = form.querySelector('#submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // The form will submit to Formspree automatically
    // This is just for user feedback
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Send My Inquiry';
    }, 2000);
  });
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  // Initialize theme first (most important)
  initializeTheme();
  
  // Initialize other functionality
  initializeNavigation();
  initializeContactForm();
  
  // Set up email click handlers
  const emailLinks = document.querySelectorAll('.email-link');
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Try to copy email to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.textContent.trim());
      }
      // Open email client
      window.location.href = `mailto:${this.textContent.trim()}`;
    });
  });
  
  console.log('UDinger website initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Make scrollToSection globally available
window.scrollToSection = scrollToSection;
