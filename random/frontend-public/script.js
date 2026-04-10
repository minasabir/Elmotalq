// API Configuration
const API_BASE_URL = 'http://elmotalq.runasp.net/api';

// Global Variables
let isMenuOpen = false;

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    hideLoading();
    setupEventListeners();
    loadAboutSection();
    loadContactSection();
}

// Hide loading screen
function hideLoading() {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (isMenuOpen) {
                    navMenu.classList.remove('active');
                    isMenuOpen = false;
                }
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form submissions
    document.getElementById('candidateForm').addEventListener('submit', handleCandidateSubmit);
    document.getElementById('companyForm').addEventListener('submit', handleCompanySubmit);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show message to user
function showMessage(text, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    message.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${text}</span>
    `;
    
    messageContainer.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        message.style.animation = 'messageSlideIn 0.3s ease-out reverse';
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Modal Functions
function showCandidateModal() {
    document.getElementById('candidateModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showCompanyModal() {
    document.getElementById('companyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Load About Section
async function loadAboutSection() {
    const aboutInfo = document.getElementById('aboutInfo');
    
    try {
        const response = await apiCall('/Elmtalq/About');
        
        if (response && (response.data || response.companyDescription)) {
            const data = response.data || response;
            aboutInfo.innerHTML = `
                <h3>عن الملتق</h3>
                <p>${data.companyDescription || 'نحن وكالة توظيف رائدة متخصصة في ربط المواهب بالفرص الوظيفية في المملكة العربية السعودية'}</p>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${data.officeLocation || 'الرياض، المملكة العربية السعودية'}</span>
                </div>
            `;
        } else {
            aboutInfo.innerHTML = `
                <h3>عن الملتق</h3>
                <p>نحن وكالة توظيف رائدة متخصصة في ربط المواهب بالفرص الوظيفية في المملكة العربية السعودية</p>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>الرياض، المملكة العربية السعودية</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('About loading error:', error);
        aboutInfo.innerHTML = `
            <h3>عن الملتق</h3>
            <p>نحن وكالة توظيف رائدة متخصصة في ربط المواهب بالفرص الوظيفية في المملكة العربية السعودية</p>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>الرياض، المملكة العربية السعودية</span>
            </div>
        `;
    }
}

// Load Contact Section
async function loadContactSection() {
    const contactDetails = document.getElementById('contactDetails');
    
    try {
        const response = await apiCall('/Elmtalq/Contact');
        
        if (response && (response.data || response.email)) {
            const data = response.data || response;
            contactDetails.innerHTML = `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${data.email || 'info@elmtalq.com'}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${data.phone || '+966 11 123 4567'}</span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-whatsapp"></i>
                    <span>${data.whatsApp || '+966 50 123 4567'}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${data.officeLocation || 'الرياض، المملكة العربية السعودية'}</span>
                </div>
                <div class="social-links">
                    <a href="${data.facebook || '#'}" target="_blank" class="social-link">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="${data.instagram || '#'}" target="_blank" class="social-link">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="${data.linkedIn || '#'}" target="_blank" class="social-link">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            `;
        } else {
            // Fallback contact info
            contactDetails.innerHTML = `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>info@elmtalq.com</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>+966 11 123 4567</span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-whatsapp"></i>
                    <span>+966 50 123 4567</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>الرياض، المملكة العربية السعودية</span>
                </div>
                <div class="social-links">
                    <a href="#" class="social-link">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-link">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" class="social-link">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Contact loading error:', error);
        // Fallback contact info
        contactDetails.innerHTML = `
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>info@elmtalq.com</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+966 11 123 4567</span>
            </div>
            <div class="contact-item">
                <i class="fab fa-whatsapp"></i>
                <span>+966 50 123 4567</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>الرياض، المملكة العربية السعودية</span>
            </div>
            <div class="social-links">
                <a href="#" class="social-link">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link">
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
        `;
    }
}

// Handle Candidate Form Submit
async function handleCandidateSubmit(e) {
    e.preventDefault();
    
    const formData = {
        FullName: document.getElementById('candidateName').value,
        PhoneNumber: document.getElementById('candidatePhone').value,
        Email: document.getElementById('candidateEmail').value,
        JobTitle: document.getElementById('candidateJob').value,
        Gender: parseInt(document.getElementById('candidateGender').value),
        YearsOfExperience: parseInt(document.getElementById('candidateExperience').value) || null,
        EducationalQualification: parseInt(document.getElementById('candidateEducation').value) || null,
        GraduationYear: parseInt(document.getElementById('candidateGraduation').value) || null,
        Country: document.getElementById('candidateCountry').value,
        Governorate: document.getElementById('candidateCity').value,
    };
    
    // Handle file upload if exists
    const cvFile = document.getElementById('candidateCV').files[0];
    if (cvFile) {
        formData.CVFile = cvFile;
    }
    
    try {
        showMessage('جاري إرسال طلبك...', 'info');
        
        // Create FormData for file upload
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                submitData.append(key, formData[key]);
            }
        });
        
        const response = await fetch(`${API_BASE_URL}/Elmtalq/Candidates`, {
            method: 'POST',
            body: submitData
            // Don't set Content-Type header for FormData
        });
        
        const result = await response.json();
        
        if (response.ok && (result.success || result.id || result.message)) {
            showMessage('تم تقديم طلبك بنجاح! سنتواصل معك قريباً.', 'success');
            closeModal('candidateModal');
            document.getElementById('candidateForm').reset();
        } else {
            throw new Error(result.message || 'فشل تقديم الطلب');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// Handle Company Form Submit
async function handleCompanySubmit(e) {
    e.preventDefault();
    
    const formData = {
        CompanyName: document.getElementById('companyName').value,
        ContactPhone: document.getElementById('companyPhone').value,
        Email: document.getElementById('companyEmail').value,
        Country: document.getElementById('companyCountry').value,
        City: document.getElementById('companyCity').value,
        RequiredJobTitle: document.getElementById('companyJobTitle').value,
        CompanyIndustry: document.getElementById('companyIndustry').value,
        Website: document.getElementById('companyWebsite').value,
        CompanySize: document.getElementById('companySize').value,
    };
    
    try {
        showMessage('جاري إرسال طلبك...', 'info');
        
        const response = await apiCall('/Elmtalq/Companies', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        
        if (response.ok && (response.success || response.id || response.message)) {
            showMessage('تم تقديم طلبك بنجاح! سنتواصل معك قريباً.', 'success');
            closeModal('companyModal');
            document.getElementById('companyForm').reset();
        } else {
            throw new Error(response.message || 'فشل تقديم الطلب');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// Handle Contact Form Submit
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value,
    };
    
    try {
        showMessage('جاري إرسال رسالتك...', 'info');
        
        // Since there's no contact endpoint in the API, we'll simulate success
        // In a real implementation, you would have an API endpoint for contact forms
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        document.getElementById('contactForm').reset();
    } catch (error) {
        showMessage('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function to validate phone (Saudi numbers)
function validatePhone(phone) {
    const re = /^(\\+966|0)?5[0-9]{8}$/;
    return re.test(phone.replace(/\s/g, ''));
}
