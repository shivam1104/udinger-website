/**
 * UDinger Quantum Consulting Website - FINAL WORKING VERSION
 * Fixed theme toggle, form, and all requested features
 */

// Theme management - WORKING VERSION
function initializeTheme() {
  console.log('Initializing theme system...');
  
  // Get system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('udinger-theme');
  
  // Set initial theme
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);
  
  // Setup toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      console.log(`Switching theme from ${currentTheme} to ${newTheme}`);
      applyTheme(newTheme);
    });
    console.log('Theme toggle button initialized');
  } else {
    console.error('Theme toggle button not found');
  }
}

function applyTheme(theme) {
  console.log(`Applying theme: ${theme}`);
  
  // Apply to document
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  
  // Force CSS variable updates
  const root = document.documentElement;
  if (theme === 'dark') {
    root.style.setProperty('--bg-primary', '#0f172a');
    root.style.setProperty('--bg-secondary', '#1e293b');
    root.style.setProperty('--bg-tertiary', '#334155');
    root.style.setProperty('--text-primary', '#f8fafc');
    root.style.setProperty('--text-secondary', '#cbd5e1');
    root.style.setProperty('--border', '#475569');
  } else {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-tertiary', '#f1f5f9');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--border', '#e2e8f0');
  }
  
  // Save theme
  localStorage.setItem('udinger-theme', theme);
  
  console.log(`Theme ${theme} applied successfully`);
}

// Parallax effect for quantum computer background
function initializeParallax() {
  console.log('Initializing parallax effect...');
  
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5; // Adjust speed
    
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  }
  
  window.addEventListener('scroll', updateParallax, { passive: true });
}

// Smooth scrolling navigation
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

// Form handling
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    // Basic validation
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const company = document.getElementById('company')?.value?.trim();
    const industry = document.getElementById('industry')?.value?.trim();
    const quantumInterest = document.getElementById('quantum-interest')?.value?.trim();
    
    if (!name || !email || !company || !industry || !quantumInterest) {
      e.preventDefault();
      alert('Please fill in all required fields (marked with *)');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('#submit-button');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send My Inquiry';
      }, 3000);
    }
  });
}

// Initialize everything
function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  // Initialize all functionality
  initializeTheme();
  initializeParallax();
  initializeNavigation();
  initializeContactForm();
  
  // Email link handlers
  const emailLinks = document.querySelectorAll('.email-link');
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = `mailto:${this.textContent.trim()}`;
    });
  });
  
  console.log('Website initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Make functions globally available
window.scrollToSection = scrollToSection;
