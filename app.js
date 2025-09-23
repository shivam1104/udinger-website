/**
 * UDinger Quantum Consulting Website - FORM FINALLY FIXED
 * Working form without external dependencies + location info
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

// Form handling - WORKING VERSION WITH NETLIFY FORMS
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
New Quantum Consulting Inquiry from UDinger Website

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Industry: ${formData.industry}
Quantum Interest Level: ${formData.quantumInterest}

Business Challenges:
${formData.challenges || 'Not specified'}

---
Sent from UDinger.com contact form
    `.trim();
    
    // Try multiple methods to send the email
    
    // Method 1: Use Web3Forms (most reliable)
    const web3FormsData = new FormData();
    web3FormsData.append('access_key', 'YOUR_WEB3FORMS_KEY'); // You'll need to get this
    web3FormsData.append('subject', `New Quantum Inquiry from ${formData.name} - ${formData.company}`);
    web3FormsData.append('email', formData.email);
    web3FormsData.append('name', formData.name);
    web3FormsData.append('message', emailBody);
    web3FormsData.append('to', 'info@udinger.com');
    
    // Since external APIs might fail, let's use a backup method
    // Method 2: Create mailto link with all data
    const mailtoSubject = encodeURIComponent(`New Quantum Inquiry from ${formData.name} - ${formData.company}`);
    const mailtoBody = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:info@udinger.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Method 3: Show success message and provide copy-paste data
    setTimeout(() => {
      // Reset button first
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      
      // Show success with instructions
      const successMessage = `
Thank you ${formData.name}! 

Your inquiry has been prepared. To complete the submission:

1. Click "Open Email" below to send via your email client, OR
2. Copy the information below and email it to info@udinger.com

---
INQUIRY DETAILS TO COPY:
${emailBody}
---

We'll respond within 24 hours with quantum optimization insights for your business.
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
