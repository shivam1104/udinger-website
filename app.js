/**
 * UDinger Quantum Consulting Website - FINAL WORKING VERSION
 * No theme toggle, working form, parallax photon animation
 */

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

// Form handling - FIXED TO WORK PROPERLY
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    console.error('Contact form not found');
    return;
  }
  
  console.log('Contact form initialized');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    console.log('Form submitted');
    
    // Get form data
    const formData = {
      name: document.getElementById('name')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      company: document.getElementById('company')?.value?.trim() || '',
      industry: document.getElementById('industry')?.value?.trim() || '',
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
    
    // Send to Formspree (working endpoint)
    fetch('https://formspree.io/f/xpzqwvgk', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        challenges: formData.challenges,
        quantum_interest: formData.quantumInterest,
        _replyto: formData.email,
        _subject: `New Quantum Inquiry from ${formData.name} - ${formData.company}`
      })
    })
    .then(response => {
      if (response.ok) {
        // Success
        alert('Thank you! Your inquiry has been sent successfully. We will respond within 24 hours.');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      alert('Sorry, there was an error sending your message. Please email us directly at info@udinger.com');
    })
    .finally(() => {
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    });
  });
}

// Initialize everything when DOM is ready
function initializeWebsite() {
  console.log('Initializing UDinger website...');
  
  // Initialize all functionality
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
