// API Configuration - Your API Base URL
const API_BASE_URL = 'http://elmotalq.runasp.net/api';

// Global Variables
let currentUser = null;

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    hideLoading();
    loadAboutSection();
    loadContactSection();
    setupEventListeners();
    checkAuthStatus();
});

// Hide loading screen
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Show loading screen
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// Setup event listeners
function setupEventListeners() {
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Candidate form
    document.getElementById('candidateForm').addEventListener('submit', handleCandidateSubmit);
    
    // Company form
    document.getElementById('companyForm').addEventListener('submit', handleCompanySubmit);
    
    // Navigation smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Check if user is logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        showAdminDashboard();
    }
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default options
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }
    
    // Merge with provided options
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
    message.textContent = text;
    
    messageContainer.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Admin Login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        showLoading();
        
        const response = await apiCall('/AdminElmtalq/Auth/Login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (response.success && response.data) {
            // Save token and user data
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.employee));
            
            currentUser = response.data.employee;
            
            showMessage('تم تسجيل الدخول بنجاح', 'success');
            showAdminDashboard();
        } else {
            throw new Error(response.message || 'فشل تسجيل الدخول');
        }
    } catch (error) {
        errorDiv.textContent = error.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.';
        errorDiv.style.display = 'block';
    } finally {
        hideLoading();
    }
}

// Show Admin Dashboard
function showAdminDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('adminLink').textContent = 'لوحة التحكم';
    
    // Load initial data
    loadCandidates();
    loadCompanies();
    loadEmployees();
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLink').textContent = 'تسجيل الدخول';
    
    showMessage('تم تسجيل الخروج بنجاح', 'success');
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Load About Section
async function loadAboutSection() {
    try {
        const response = await apiCall('/Elmtalq/About');
        const aboutContent = document.getElementById('aboutContent');
        
        if (response.success && response.data) {
            aboutContent.innerHTML = `
                <div class="about-content">
                    <p><strong>وصف الشركة:</strong> ${response.data.companyDescription}</p>
                    <p><strong>الموقع:</strong> ${response.data.officeLocation}</p>
                </div>
            `;
        } else {
            aboutContent.innerHTML = '<p>لم يتم العثور على معلومات</p>';
        }
    } catch (error) {
        document.getElementById('aboutContent').innerHTML = '<p>حدث خطأ في تحميل المعلومات</p>';
    }
}

// Load Contact Section
async function loadContactSection() {
    try {
        const response = await apiCall('/Elmtalq/Contact');
        const contactContent = document.getElementById('contactContent');
        
        if (response.success && response.data) {
            contactContent.innerHTML = `
                <div class="contact-info">
                    <p><strong>البريد الإلكتروني:</strong> ${response.data.email}</p>
                    <p><strong>الهاتف:</strong> ${response.data.phone}</p>
                    <p><strong>واتساب:</strong> ${response.data.whatsApp}</p>
                    <div class="social-links">
                        <a href="${response.data.facebook}" target="_blank">فيسبوك</a> |
                        <a href="${response.data.instagram}" target="_blank">انستغرام</a> |
                        <a href="${response.data.linkedIn}" target="_blank">لينكدإن</a>
                    </div>
                </div>
            `;
        } else {
            contactContent.innerHTML = '<p>لم يتم العثور على معلومات الاتصال</p>';
        }
    } catch (error) {
        document.getElementById('contactContent').innerHTML = '<p>حدث خطأ في تحميل معلومات الاتصال</p>';
    }
}

// Load Candidates for Admin
async function loadCandidates() {
    try {
        const response = await apiCall('/AdminElmtalq/Candidates');
        const candidatesList = document.getElementById('candidatesList');
        
        if (response.success && response.data) {
            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>الهاتف</th>
                            <th>الوظيفة</th>
                            <th>الخبرة</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            response.data.forEach(candidate => {
                html += `
                    <tr>
                        <td>${candidate.fullName || candidate.name || '-'}</td>
                        <td>${candidate.phoneNumber || candidate.phone || '-'}</td>
                        <td>${candidate.jobTitle || '-'}</td>
                        <td>${candidate.yearsOfExperience || candidate.experience || '-'}</td>
                        <td>${candidate.status || '-'}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            candidatesList.innerHTML = html;
        } else {
            candidatesList.innerHTML = '<p>لم يتم العثور على مرشحين</p>';
        }
    } catch (error) {
        document.getElementById('candidatesList').innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
    }
}

// Load Companies for Admin
async function loadCompanies() {
    try {
        const response = await apiCall('/AdminElmtalq/Companies');
        const companiesList = document.getElementById('companiesList');
        
        if (response.success && response.data) {
            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>اسم الشركة</th>
                            <th>الهاتف</th>
                            <th>البريد الإلكتروني</th>
                            <th>المدينة</th>
                            <th>المجال</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            response.data.forEach(company => {
                html += `
                    <tr>
                        <td>${company.companyName || company.name || '-'}</td>
                        <td>${company.contactPhone || company.phone || '-'}</td>
                        <td>${company.email || '-'}</td>
                        <td>${company.city || '-'}</td>
                        <td>${company.companyIndustry || company.industry || '-'}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            companiesList.innerHTML = html;
        } else {
            companiesList.innerHTML = '<p>لم يتم العثور على شركات</p>';
        }
    } catch (error) {
        document.getElementById('companiesList').innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
    }
}

// Load Employees for Admin
async function loadEmployees() {
    try {
        const response = await apiCall('/AdminElmtalq/Employees');
        const employeesList = document.getElementById('employeesList');
        
        if (response.success && response.data) {
            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>الوظيفة</th>
                            <th>تاريخ الإنشاء</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            response.data.forEach(employee => {
                html += `
                    <tr>
                        <td>${employee.name || '-'}</td>
                        <td>${employee.email || '-'}</td>
                        <td>${employee.role || '-'}</td>
                        <td>${new Date(employee.createdAt).toLocaleDateString('ar-SA')}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            employeesList.innerHTML = html;
        } else {
            employeesList.innerHTML = '<p>لم يتم العثور على موظفين</p>';
        }
    } catch (error) {
        document.getElementById('employeesList').innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
    }
}

// Show Candidate Form Modal
function showCandidateForm() {
    document.getElementById('candidateModal').style.display = 'block';
}

// Show Company Form Modal
function showCompanyForm() {
    document.getElementById('companyModal').style.display = 'block';
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle Candidate Form Submit
async function handleCandidateSubmit(e) {
    e.preventDefault();
    
    const formData = {
        FullName: document.getElementById('candidateName').value,
        PhoneNumber: document.getElementById('candidatePhone').value,
        JobTitle: document.getElementById('candidateJob').value,
        Gender: parseInt(document.getElementById('candidateGender').value),
    };
    
    try {
        showLoading();
        
        const response = await apiCall('/Elmtalq/Candidates', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        
        if (response.success) {
            showMessage('تم تقديم طلبك بنجاح', 'success');
            closeModal('candidateModal');
            document.getElementById('candidateForm').reset();
        } else {
            throw new Error(response.message || 'فشل تقديم الطلب');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في تقديم الطلب', 'error');
    } finally {
        hideLoading();
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
    };
    
    try {
        showLoading();
        
        const response = await apiCall('/Elmtalq/Companies', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        
        if (response.success) {
            showMessage('تم تقديم طلبك بنجاح', 'success');
            closeModal('companyModal');
            document.getElementById('companyForm').reset();
        } else {
            throw new Error(response.message || 'فشل تقديم الطلب');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في تقديم الطلب', 'error');
    } finally {
        hideLoading();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
