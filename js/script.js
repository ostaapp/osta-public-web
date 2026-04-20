// Osta  Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initNavbarScroll();
    initContactForm();
    initAnimations();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Clear previous validation states
    clearValidationErrors(form);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
        displayValidationErrors(form, validationErrors);
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    submitButton.disabled = true;
    form.classList.add('loading');
    
    try {
       const response = await fetch('https://api.ostaapp.com/api/v1/misc/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: formData.get('email'),
                subject: `Demo Request from ${formData.get('name')}`,
                category: formData.get('category'),
                content: formData.get('message'),
                others: formData.get('otherCategory'),
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        // Show success message
        showSuccessMessage('Your request has been sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        form.classList.add('success-animation');
        
        setTimeout(() => {
            form.classList.remove('success-animation');
        }, 300);
        
    } catch (error) {
        console.error('Error sending request:', error);
        showErrorMessage('Something went wrong while sending your request. Please try again or contact us directly.');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        form.classList.remove('loading');
    }
}

function validateForm(formData) {
    const errors = {};
    
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const category = formData.get('category').trim();
    const message = formData.get('message').trim();
    
    if (!name) {
        errors.name = 'Full Name is required';
    }
    
    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!category) {
        errors.category = 'Category is required';
    }
    
    if (!message) {
        errors.message = 'Message is required';
    } else if (message.length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearValidationErrors(form) {
    const inputs = form.querySelectorAll('.form-control');
    const errorMessages = form.querySelectorAll('.invalid-feedback');
    
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });
    
    errorMessages.forEach(error => {
        error.textContent = '';
    });
}

function displayValidationErrors(form, errors) {
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        
        if (field && errorElement) {
            field.classList.add('is-invalid');
            errorElement.textContent = errors[fieldName];
        }
    });
    
    // Focus on first error field
    const firstErrorField = form.querySelector('.is-invalid');
    if (firstErrorField) {
        firstErrorField.focus();
    }
}

function showSuccessMessage(message) {
    showAlert(message, 'success');
}

function showErrorMessage(message) {
    showAlert(message, 'danger');
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-custom');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px; max-width: 500px;';
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize animations on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .service-item, .security-card, .contact-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Utility function to handle external links
function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        if (!link.hostname === window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Initialize external links
handleExternalLinks();

// Add loading states for buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn:not([type="submit"])')) {
        const button = e.target;
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
});

// Handle navbar active states
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}


  document.querySelectorAll('.request-demo-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const contactSection = document.getElementById('contact');
      if (!contactSection) {
        window.location.href = "index.html#contact";
      }
    });
  });

function toggleOtherCategory(selectElement) {
  const otherDiv = document.getElementById('otherCategoryDiv');
  const otherInput = document.getElementById('otherCategory');

  if (selectElement.value === 'Others') {
    otherDiv.style.display = 'block';
    otherInput.setAttribute('required', 'required'); 
  } else {
    otherDiv.style.display = 'none';
    otherInput.removeAttribute('required'); 
    otherInput.value = ''; 
  }
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Initialize on page load
updateActiveNavLink();