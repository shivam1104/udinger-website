/**
 * UDinger Quantum Consulting Website - PROFESSIONAL VERSION
 * Automatic form submission, fixed theme toggle, professional styling
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
  }
}

function applyTheme(theme) {
  console.log(`Applying theme: ${theme}`);
  
  // Apply to document
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  
  // Save theme
  localStorage.setItem('udinger-theme', theme);
  
  console.log(`Theme ${theme} applied successfully`);
}

// Photon animation that moves as user scrolls
function initializePhotonAnimation() {
  console.log('Initializing photon animation...');
  
  const photon = document.querySelector('.photon');
  if (!photon) {
    console.error('Photon element not found');
    return;
  }
  
  function updatePhotonPosition() {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const photonTravel = scrollPercent * 100;
    
    // Move photon from top to bottom based on scroll
    photon.style.top = `${photonTravel}%`;
    
    // Add pulsing effect
    const pulseIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    photon.style.opacity = pulseIntensity;
  }
  
  window.addEventListener('scroll', updatePhotonPosition, { passive: true });
  
  // Initial position
  updatePhotonPosition();
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
  
  // Fix all onclick buttons
  const buttons = document.querySelectorAll('[onclick]');
  buttons.forEach(button => {
    const onclickValue = button.getAttribute('onclick');
    if (onclickValue && onclickValue.includes('scrollToSection')) {
      // Extract section ID from onclick
      const match = onclickValue.match(/scrollToSection\('([^']+)'\)/);
      if (match && match[1]) {
        const sectionId = match[1];
        button.addEventListener('click', function(e) {
          e.preventDefault();
          scrollToSection(sectionId);
        });
      }
    }
  });
}

// PROFESSIONAL FORM - AUTOMATIC EMAIL SENDING
function initializeContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) {
    console.error('Contact form not found');
    return;
  }
  
  console.log('Professional contact form initialized - automatic email sending');
  
  form.addEventListener('submit', function(e) {
    // Don't prevent default - let Formspree handle it
    console.log('Form submitted - sending automatically to info@udinger.com');
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Reset button after delay (Formspree will handle the redirect)
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }, 3000);
  });
}

// Initialize everything when DOM is ready
function initializeWebsite() {
  console.log('Initializing professional UDinger website...');
  
  // Initialize all functionality
  initializeTheme();
  initializePhotonAnimation();
  initializeNavigation();
  initializeContactForm();
  
  // Email link handlers
  const emailLinks = document.querySelectorAll('.email-link, .footer-email');
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = `mailto:${this.textContent.trim()}`;
    });
  });
  
  console.log('Professional website initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Make functions globally available
window.scrollToSection = scrollToSection;
