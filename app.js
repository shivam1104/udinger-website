/**
 * UDinger Quantum Consulting Website - WITH WORKING THEME TOGGLE
 * Logo visibility fixed, training added, locations styled
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
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
  } else {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-tertiary', '#f1f5f9');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--border', '#e2e8f0');
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
  }
  
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
}

// Form handling - WORKING VERSION
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    console.error('Contact form not found');
    return;
  }
  
  console.log('Contact form initialized with working email submission');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    console.log('Form submitted');
    
    // Get form data
    const formData = {
      name: document.getElementById('name')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      company: document.getElementById('company')?.value?.trim() || '',
      industry: document.getElementById('industry')?.value?.trim() || '',
      location: document.getElementById('location')?.value?.trim() || 'Not specified',
      challenges: document.getElementById('challenges')?.value?.trim() || '',
      quantumInterest: document.getElementById('quantum-interest')?.value?.trim() || ''
    };
    
    console.log('Form data collected:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.company || !formData.industry || !formData.quantumInterest) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('#submit-button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Create email body
    const emailBody = `
New Quantum Consulting & Training Inquiry from UDinger Website

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Industry: ${formData.industry}
Location: ${formData.location}
Quantum Interest Level: ${formData.quantumInterest}

Business Challenges:
${formData.challenges || 'Not specified'}

---
Sent from UDinger.com contact form
    `.trim();
    
    // Create mailto link with all data
    const mailtoSubject = encodeURIComponent(`New Quantum Inquiry from ${formData.name} - ${formData.company}`);
    const mailtoBodyEncoded = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:info@udinger.com?subject=${mailtoSubject}&body=${mailtoBodyEncoded}`;
    
    // Show success dialog with options
    setTimeout(() => {
      // Reset button first
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      
      // Show success with instructions
      const successMessage = `
Thank you ${formData.name}! 

Your quantum consulting & training inquiry has been prepared. To complete the submission:

1. Click "Open Email" below to send via your email client, OR
2. Copy the information below and email it to info@udinger.com

---
INQUIRY DETAILS TO COPY:
${emailBody}
---

We'll respond within 24 hours with quantum optimization insights and training options for your business.
      `;
      
      if (confirm(successMessage + '\n\nClick OK to open your email client, or Cancel to copy the information instead.')) {
        // User chose to open email client
        window.location.href = mailtoLink;
      } else {
        // User chose to copy information
        if (navigator.clipboard) {
          navigator.clipboard.writeText(emailBody).then(() => {
            alert('Your inquiry details have been copied to clipboard. Please paste and send to info@udinger.com');
          });
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailBody;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Your inquiry details have been copied to clipboard. Please paste and send to info@udinger.com');
        }
      }
      
      // Clear form
      form.reset();
      
    }, 1000);
  });
}

// Initialize everything when DOM is ready
function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  // Initialize all functionality
  initializeTheme();
  initializePhotonAnimation();
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
