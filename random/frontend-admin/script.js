// API Configuration
const API_BASE_URL = 'http://elmotalq.runasp.net/api';

// Global Variables
let currentUser = null;
let currentSection = 'dashboard';
let candidatesData = [];
let companiesData = [];
let employeesData = [];

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    checkAuthStatus();
    setupEventListeners();
}

// Check if user is logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        showDashboard();
    } else {
        showLoginScreen();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
            }
        });
    });
    
    // Settings forms
    document.getElementById('aboutForm').addEventListener('submit', handleAboutUpdate);
    document.getElementById('contactForm').addEventListener('submit', handleContactUpdate);
    document.getElementById('addEmployeeForm').addEventListener('submit', handleAddEmployee);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Close modals
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Hide loading screen
function hideLoading() {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);
}

// Show login screen
function showLoginScreen() {
    hideLoading();
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    hideLoading();
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'flex';
    
    // Update user info
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name || 'المدير';
        document.getElementById('userRole').textContent = currentUser.role || 'Administrator';
    }
    
    // Load initial data
    loadDashboardData();
}

// Show specific section
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'لوحة التحكم',
        candidates: 'الباحثين عن عمل',
        companies: 'الشركات',
        employees: 'الموظفين',
        settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'لوحة التحكم';
    
    currentSection = sectionName;
    
    // Load section data
    loadSectionData(sectionName);
}

// Load section-specific data
function loadSectionData(section) {
    switch(section) {
        case 'candidates':
            loadCandidates();
            break;
        case 'companies':
            loadCompanies();
            break;
        case 'employees':
            loadEmployees();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
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

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    console.log('Attempting login with:', { email, password: '***' });
    
    try {
        showMessage('جاري تسجيل الدخول...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/AdminElmtalq/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const data = await response.json();
        console.log('Response data:', data);
        console.log('Response success:', data.success);
        console.log('Response data.data:', data.data);
        console.log('Response data.token:', data.data?.token);
        console.log('Response data.employee:', data.data?.employee);
        
        if (response.ok && data.token) {
            // Save token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify({
                id: data.userId,
                name: data.name,
                email: data.email,
                role: data.role === 0 ? 'Owner' : data.role === 1 ? 'Secretary' : 'Employee'
            }));
            
            currentUser = {
                id: data.userId,
                name: data.name,
                email: data.email,
                role: data.role === 0 ? 'Owner' : data.role === 1 ? 'Secretary' : 'Employee'
            };
            
            showMessage('تم تسجيل الدخول بنجاح', 'success');
            showDashboard();
        } else {
            // Handle different error cases
            let errorMessage = 'فشل تسجيل الدخول';
            
            if (data.errors && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            } else if (data.message) {
                errorMessage = data.message;
            } else if (response.status === 401) {
                errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            } else if (response.status === 400) {
                errorMessage = 'بيانات غير صالحة';
            } else if (response.status >= 500) {
                errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = error.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.';
        errorDiv.style.display = 'block';
        showMessage(error.message || 'فشل تسجيل الدخول', 'error');
    }
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    
    showMessage('تم تسجيل الخروج بنجاح', 'success');
    showLoginScreen();
}

// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load all data in parallel
        const [candidatesRes, companiesRes, employeesRes] = await Promise.all([
            apiCall('/AdminElmtalq/Candidates'),
            apiCall('/AdminElmtalq/Companies'),
            apiCall('/AdminElmtalq/Employees')
        ]);
        
        // Handle different response structures
        candidatesData = candidatesRes.data || candidatesRes.items || candidatesRes || [];
        companiesData = companiesRes.data || companiesRes.items || companiesRes || [];
        employeesData = employeesRes.data || employeesRes.items || employeesRes || [];
        
        // Update stats
        document.getElementById('totalCandidates').textContent = candidatesData.length;
        document.getElementById('totalCompanies').textContent = companiesData.length;
        document.getElementById('totalEmployees').textContent = employeesData.length;
        document.getElementById('candidatesCount').textContent = candidatesData.length;
        document.getElementById('companiesCount').textContent = companiesData.length;
        document.getElementById('employeesCount').textContent = employeesData.length;
        
        // Update dashboard cards
        updateDashboardCards();
        
    } catch (error) {
        console.error('Dashboard data error:', error);
        showMessage('فشل تحميل بيانات لوحة التحكم', 'error');
    }
}

// Update Dashboard Cards
function updateDashboardCards() {
    // Active Employees
    const activeEmployees = employeesData.filter(emp => emp.isActive !== false).slice(0, 5);
    const activeEmployeesHtml = activeEmployees.map(emp => `
        <div class="employee-item">
            <div class="employee-info">
                <strong>${emp.name}</strong>
                <span>${emp.role}</span>
            </div>
            <span class="status active">نشط</span>
        </div>
    `).join('');
    
    document.getElementById('activeEmployees').innerHTML = activeEmployeesHtml || '<p>لا يوجد موظفين نشطين</p>';
    
    // Recent Requests (last 5 candidates and companies)
    const recentCandidates = candidatesData.slice(0, 3);
    const recentCompanies = companiesData.slice(0, 3);
    
    const recentHtml = `
        <div class="recent-section">
            <h4>مرشحين جدد</h4>
            ${recentCandidates.map(c => `
                <div class="recent-item">
                    <strong>${c.fullName || c.name}</strong>
                    <span>${new Date(c.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
            `).join('')}
        </div>
        <div class="recent-section">
            <h4>شركات جديدة</h4>
            ${recentCompanies.map(c => `
                <div class="recent-item">
                    <strong>${c.companyName}</strong>
                    <span>${new Date(c.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('recentRequests').innerHTML = recentHtml;
}

// Load Candidates
async function loadCandidates() {
    const candidatesTable = document.getElementById('candidatesTable');
    
    try {
        const response = await apiCall('/AdminElmtalq/Candidates');
        candidatesData = response.data || response.items || response || [];
        
        if (candidatesData.length === 0) {
            candidatesTable.innerHTML = '<p>لا يوجد مرشحين</p>';
            return;
        }
        
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>الهاتف</th>
                        <th>البريد الإلكتروني</th>
                        <th>الوظيفة</th>
                        <th>الخبرة</th>
                        <th>البلد</th>
                        <th>تاريخ الإنشاء</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${candidatesData.map(candidate => `
                        <tr>
                            <td>${candidate.fullName || candidate.name || '-'}</td>
                            <td>${candidate.phoneNumber || candidate.phone || '-'}</td>
                            <td>${candidate.email || '-'}</td>
                            <td>${candidate.jobTitle || '-'}</td>
                            <td>${candidate.yearsOfExperience || candidate.experience || '-'}</td>
                            <td>${candidate.country || '-'}</td>
                            <td>${candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewCandidate(${candidate.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCandidate(${candidate.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        candidatesTable.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Candidates loading error:', error);
        candidatesTable.innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
        showMessage('فشل تحميل المرشحين', 'error');
    }
}

// Load Companies
async function loadCompanies() {
    const companiesTable = document.getElementById('companiesTable');
    
    try {
        const response = await apiCall('/AdminElmtalq/Companies');
        companiesData = response.data || response.items || response || [];
        
        if (companiesData.length === 0) {
            companiesTable.innerHTML = '<p>لا يوجد شركات</p>';
            return;
        }
        
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>اسم الشركة</th>
                        <th>الهاتف</th>
                        <th>البريد الإلكتروني</th>
                        <th>المدينة</th>
                        <th>المجال</th>
                        <th>الوظيفة المطلوبة</th>
                        <th>تاريخ الإنشاء</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${companiesData.map(company => `
                        <tr>
                            <td>${company.companyName}</td>
                            <td>${company.contactPhone || company.phone}</td>
                            <td>${company.email}</td>
                            <td>${company.city}</td>
                            <td>${company.companyIndustry || company.industry}</td>
                            <td>${company.requiredJobTitle}</td>
                            <td>${company.createdAt ? new Date(company.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewCompany(${company.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCompany(${company.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        companiesTable.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Companies loading error:', error);
        companiesTable.innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
        showMessage('فشل تحميل الشركات', 'error');
    }
}

// Load Employees
async function loadEmployees() {
    const employeesTable = document.getElementById('employeesTable');
    
    try {
        const response = await apiCall('/AdminElmtalq/Employees');
        employeesData = response.data || response.items || response || [];
        
        if (employeesData.length === 0) {
            employeesTable.innerHTML = '<p>لا يوجد موظفين</p>';
            return;
        }
        
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الوظيفة</th>
                        <th>الراتب</th>
                        <th>الحالة</th>
                        <th>تاريخ الإنشاء</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${employeesData.map(employee => `
                        <tr>
                            <td>${employee.name}</td>
                            <td>${employee.email}</td>
                            <td>${employee.role}</td>
                            <td>${employee.salary ? employee.salary.toLocaleString() + ' ريال' : '-'}</td>
                            <td>
                                <span class="status ${employee.isActive !== false ? 'active' : 'inactive'}">
                                    ${employee.isActive !== false ? 'نشط' : 'غير نشط'}
                                </span>
                            </td>
                            <td>${employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        employeesTable.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Employees loading error:', error);
        employeesTable.innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
        showMessage('فشل تحميل الموظفين', 'error');
    }
}

// Load Settings
async function loadSettings() {
    try {
        const [aboutRes, contactRes] = await Promise.all([
            apiCall('/Elmtalq/About'),
            apiCall('/Elmtalq/Contact')
        ]);
        
        // Load about data
        if (aboutRes.success && aboutRes.data) {
            document.getElementById('companyDescription').value = aboutRes.data.companyDescription || '';
            document.getElementById('officeLocation').value = aboutRes.data.officeLocation || '';
        }
        
        // Load contact data
        if (contactRes.success && contactRes.data) {
            document.getElementById('contactEmail').value = contactRes.data.email || '';
            document.getElementById('contactPhone').value = contactRes.data.phone || '';
            document.getElementById('whatsapp').value = contactRes.data.whatsApp || '';
        }
        
    } catch (error) {
        showMessage('فشل تحميل الإعدادات', 'error');
    }
}

// Handle About Update
async function handleAboutUpdate(e) {
    e.preventDefault();
    
    const formData = {
        companyDescription: document.getElementById('companyDescription').value,
        officeLocation: document.getElementById('officeLocation').value,
    };
    
    try {
        showMessage('جاري حفظ البيانات...', 'info');
        
        const response = await apiCall('/AdminElmtalq/About', {
            method: 'PATCH',
            body: JSON.stringify(formData),
        });
        
        if (response.success) {
            showMessage('تم حفظ معلومات الشركة بنجاح', 'success');
        } else {
            throw new Error(response.message || 'فشل حفظ البيانات');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في حفظ البيانات', 'error');
    }
}

// Handle Contact Update
async function handleContactUpdate(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        whatsApp: document.getElementById('whatsapp').value,
    };
    
    try {
        showMessage('جاري حفظ البيانات...', 'info');
        
        const response = await apiCall('/AdminElmtalq/Contact', {
            method: 'PATCH',
            body: JSON.stringify(formData),
        });
        
        if (response.success) {
            showMessage('تم حفظ معلومات الاتصال بنجاح', 'success');
        } else {
            throw new Error(response.message || 'فشل حفظ البيانات');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في حفظ البيانات', 'error');
    }
}

// Handle Add Employee
async function handleAddEmployee(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        password: document.getElementById('employeePassword').value,
        role: document.getElementById('employeeRole').value,
        salary: parseFloat(document.getElementById('employeeSalary').value) || null,
    };
    
    try {
        showMessage('جاري إضافة الموظف...', 'info');
        
        const response = await apiCall('/AdminElmtalq/Employees', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        
        if (response.success) {
            showMessage('تم إضافة الموظف بنجاح', 'success');
            closeModal('addEmployeeModal');
            document.getElementById('addEmployeeForm').reset();
            
            // Reload employees if on employees section
            if (currentSection === 'employees') {
                loadEmployees();
            }
        } else {
            throw new Error(response.message || 'فشل إضافة الموظف');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في إضافة الموظف', 'error');
    }
}

// Modal Functions
function showAddEmployeeModal() {
    document.getElementById('addEmployeeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Action Functions
function viewCandidate(id) {
    const candidate = candidatesData.find(c => c.id === id);
    if (candidate) {
        showMessage(`عرض تفاصيل المرشح: ${candidate.fullName || candidate.name}`, 'info');
    }
}

function viewCompany(id) {
    const company = companiesData.find(c => c.id === id);
    if (company) {
        showMessage(`عرض تفاصيل الشركة: ${company.companyName}`, 'info');
    }
}

function editEmployee(id) {
    const employee = employeesData.find(e => e.id === id);
    if (employee) {
        showMessage(`تعديل الموظف: ${employee.name}`, 'info');
    }
}

async function deleteCandidate(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المرشح؟')) return;
    
    try {
        const response = await apiCall(`/AdminElmtalq/Candidates/${id}`, {
            method: 'DELETE',
        });
        
        if (response.success) {
            showMessage('تم حذف المرشح بنجاح', 'success');
            loadCandidates();
        } else {
            throw new Error(response.message || 'فشل الحذف');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في حذف المرشح', 'error');
    }
}

async function deleteCompany(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;
    
    try {
        const response = await apiCall(`/AdminElmtalq/Companies/${id}`, {
            method: 'DELETE',
        });
        
        if (response.success) {
            showMessage('تم حذف الشركة بنجاح', 'success');
            loadCompanies();
        } else {
            throw new Error(response.message || 'فشل الحذف');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في حذف الشركة', 'error');
    }
}

async function deleteEmployee(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    try {
        const response = await apiCall(`/AdminElmtalq/Employees/${id}`, {
            method: 'DELETE',
        });
        
        if (response.success) {
            showMessage('تم حذف الموظف بنجاح', 'success');
            loadEmployees();
        } else {
            throw new Error(response.message || 'فشل الحذف');
        }
    } catch (error) {
        showMessage(error.message || 'حدث خطأ في حذف الموظف', 'error');
    }
}

// Utility Functions
function refreshData(type) {
    showMessage(`جاري تحديث ${type === 'candidates' ? 'المرشحين' : type === 'companies' ? 'الشركات' : 'الموظفين'}...`, 'info');
    
    switch(type) {
        case 'candidates':
            loadCandidates();
            break;
        case 'companies':
            loadCompanies();
            break;
        case 'employees':
            loadEmployees();
            break;
    }
}

function exportData(type) {
    showMessage(`جاري تصدير ${type === 'candidates' ? 'المرشحين' : 'الشركات'}...`, 'info');
    // In a real implementation, this would generate and download a CSV/Excel file
    setTimeout(() => {
        showMessage('تم تصدير البيانات بنجاح', 'success');
    }, 2000);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter current section data based on search term
    if (currentSection === 'candidates' && candidatesData.length > 0) {
        const filtered = candidatesData.filter(c => 
            (c.fullName && c.fullName.toLowerCase().includes(searchTerm)) ||
            (c.email && c.email.toLowerCase().includes(searchTerm)) ||
            (c.jobTitle && c.jobTitle.toLowerCase().includes(searchTerm))
        );
        updateCandidatesTable(filtered);
    } else if (currentSection === 'companies' && companiesData.length > 0) {
        const filtered = companiesData.filter(c => 
            c.companyName.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm) ||
            c.companyIndustry.toLowerCase().includes(searchTerm)
        );
        updateCompaniesTable(filtered);
    } else if (currentSection === 'employees' && employeesData.length > 0) {
        const filtered = employeesData.filter(e => 
            e.name.toLowerCase().includes(searchTerm) ||
            e.email.toLowerCase().includes(searchTerm) ||
            e.role.toLowerCase().includes(searchTerm)
        );
        updateEmployeesTable(filtered);
    }
}

function updateCandidatesTable(data) {
    // Implementation to update candidates table with filtered data
    // This would regenerate the table HTML with the filtered data
}

function updateCompaniesTable(data) {
    // Implementation to update companies table with filtered data
}

function updateEmployeesTable(data) {
    // Implementation to update employees table with filtered data
}
