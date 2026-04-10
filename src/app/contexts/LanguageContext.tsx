import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Comprehensive Translations
const translations = {
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'candidates': 'Candidates',
    'companies': 'Companies',
    'settings': 'Settings',
    'home': 'Home',
    'about': 'About',
    'contact': 'Contact',
    'adminLogin': 'Admin Login',
    'employees': 'Employees',
    'logout': 'Logout',
    
    // Common Actions
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'create': 'Create',
    'update': 'Update',
    'search': 'Search',
    'filter': 'Filter',
    'loading': 'Loading...',
    'error': 'Error',
    'noData': 'No data available',
    'retry': 'Retry',
    'back': 'Back',
    'close': 'Close',
    'submit': 'Submit',
    'next': 'Next',
    'previous': 'Previous',
    'confirm': 'Confirm',
    'view': 'View',
    'download': 'Download',
    'upload': 'Upload',
    'clear': 'Clear',
    'apply': 'Apply',
    'reset': 'Reset',
    
    // Status
    'active': 'Active',
    'inactive': 'Inactive',
    'pending': 'Pending',
    'completed': 'Completed',
    'unassigned': 'Unassigned',
    'assigned': 'Assigned',
    'notAssigned': 'Not assigned',
    
    // Pagination
    'rowsPerPage': 'Rows per page',
    'of': 'of',
    'showing': 'Showing',
    'to': 'to',
    'results': 'results',
    'page': 'Page',
    
    // Candidates
    'candidateName': 'Candidate Name',
    'candidateNamePlaceholder': 'Enter full name',
    'phoneNumber': 'Phone Number',
    'phonePlaceholder': '+20 123 456 7890',
    'jobTitle': 'Job Title',
    'jobTitlePlaceholder': 'e.g., Software Developer',
    'experience': 'Experience',
    'years': 'years',
    'yearsOfExperience': 'Years of Experience',
    'yearsPlaceholder': '0',
    'cv': 'CV',
    'photo': 'Photo',
    'video': 'Video',
    'cvResume': 'CV / Resume',
    'personalPhoto': 'Personal Photo',
    'introductionVideo': 'Introduction Video',
    'uploadCV': 'Upload CV',
    'uploadPhoto': 'Upload Photo',
    'uploadVideo': 'Upload Video',
    'pdfOnly': 'PDF only',
    'jpgPngOnly': 'JPG/PNG only',
    'mp4Only': 'MP4 only',
    'clickToUpload': 'Click to upload',
    'noFiles': 'No files',
    
    // Gender
    'gender': 'Gender',
    'male': 'Male',
    'female': 'Female',
    'selectGender': 'Select gender',
    
    // Education
    'education': 'Education',
    'educationalQualification': 'Educational Qualification',
    'selectQualification': 'Select qualification',
    'highSchool': 'High School',
    'diploma': 'Diploma',
    'bachelor': 'Bachelor',
    'master': 'Master',
    'phd': 'PhD',
    'other': 'Other',
    'graduationYear': 'Graduation Year',
    
    // Location
    'location': 'Location',
    'country': 'Country',
    'countryPlaceholder': 'Egypt',
    'governorate': 'Governorate',
    'governoratePlaceholder': 'Cairo',
    'city': 'City',
    'cityPlaceholder': 'Cairo',
    
    // Companies
    'companyName': 'Company Name',
    'companyNamePlaceholder': 'Enter company name',
    'contactPhone': 'Contact Phone',
    'companyIndustry': 'Company Industry',
    'industry': 'Industry',
    'industryPlaceholder': 'e.g., Technology, Healthcare',
    'technology': 'Technology',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'ecommerce': 'E-commerce',
    'requiredJob': 'Required Job',
    'requiredJobTitle': 'Required Job Title',
    'requiredJobPlaceholder': 'e.g., Senior Software Developer',
    'manageCompanies': 'Manage company requests and assignments',
    'assignedStatus': 'Assignment Status',
    'contactInformation': 'Contact Information',
    'created': 'Created',
    'createdAt': 'Created At',
    'lastUpdated': 'Last Updated',
    
    // Employees
    'employeeName': 'Employee Name',
    'employeeEmail': 'Employee Email',
    'role': 'Role',
    'selectRole': 'Select role',
    'owner': 'Owner',
    'secretary': 'Secretary',
    'salary': 'Salary',
    'accountStatus': 'Account Status',
    'totalEmployees': 'Total Employees',
    'activeEmployees': 'Active Employees',
    'inactiveEmployees': 'Inactive Employees',
    'manageEmployees': 'Manage employee accounts and permissions',
    'addNewEmployee': 'Add New Employee',
    'editEmployee': 'Edit Employee',
    'createEmployee': 'Create Employee',
    'updateEmployee': 'Update Employee',
    'password': 'Password',
    'passwordPlaceholder': 'Enter password',
    'passwordLeaveBlank': 'leave blank to keep current',
    'employmentDetails': 'Employment Details',
    
    // Forms - Headers
    'addNewCandidate': 'Add New Candidate',
    'addNewCompany': 'Add New Company',
    'editCandidate': 'Edit Candidate',
    'editCompany': 'Edit Company',
    'createCandidate': 'Create Candidate',
    'createCompany': 'Create Company',
    'updateCandidate': 'Update Candidate',
    'updateCompany': 'Update Company',
    'uploadDocuments': 'Upload Documents',
    'companyInformation': 'Company Information',
    'educationExperience': 'Education & Experience',
    'basicInformation': 'Basic Information',
    'personalInformation': 'Personal Information',
    'professionalInformation': 'Professional Information',
    'jobRequirements': 'Job Requirements',
    
    // Form Actions
    'saving': 'Saving...',
    'submitProfile': 'Submit Profile',
    'postRequirements': 'Post Requirements',
    'applyAsCandidate': 'Apply as Candidate',
    'postAJob': 'Post a Job',
    'submitApplication': 'Submit Application',
    'submitAnother': 'Submit Another',
    
    // Form validation
    'required': 'Required',
    'invalidEmail': 'Invalid email address',
    'invalidPhone': 'Invalid phone number',
    'minLength': 'Minimum {min} characters required',
    'maxLength': 'Maximum {max} characters allowed',
    
    // Public Pages
    'heroTitle': 'Connecting exceptional talent with outstanding opportunities',
    'heroSubtitle': 'Join hundreds of candidates and companies who trust Elmotalq',
    'imCandidate': "I'm a Candidate",
    'imCompany': "I'm a Company",
    'forCandidates': 'For Candidates',
    'forCompanies': 'For Companies',
    'professionalScreening': 'Professional Screening',
    'personalizedMatching': 'Personalized Matching',
    'applyNow': 'Apply Now',
    'howItWorks': 'How Elmotalq Works',
    'howItWorksSubtitle': 'Our streamlined process makes recruitment simple and effective',
    'readyToStart': 'Ready to Get Started?',
    'submitYourProfile': 'Submit Your Profile',
    'postJobRequirements': 'Post Job Requirements',
    
    // Step indicators
    'step': 'Step',
    'basicInfo': 'Basic Info',
    'details': 'Details',
    'documents': 'Documents',
    
    // About Page
    'aboutTitle': 'About Elmotalq',
    'ourStory': 'Our Story',
    'ourValues': 'Our Values',
    'excellence': 'Excellence',
    'excellenceDesc': 'We strive for excellence in every placement',
    'peopleFirst': 'People First',
    'peopleFirstDesc': 'Our candidates and clients are at the heart of everything we do',
    'integrity': 'Integrity',
    'integrityDesc': 'We operate with transparency and honesty',
    'ourOffice': 'Our Office',
    
    // Contact Page
    'getInTouch': 'Get in Touch',
    'getInTouchSubtitle': "Have questions? We'd love to hear from you",
    'email': 'Email',
    'phone': 'Phone',
    'whatsapp': 'WhatsApp',
    'address': 'Address',
    'followUs': 'Follow Us',
    'followUsSubtitle': 'Stay updated with our latest opportunities',
    'officeHours': 'Office Hours',
    'sundayToThursday': 'Sunday - Thursday',
    'fridaySaturday': 'Friday - Saturday',
    'closed': 'Closed',
    
    // Messages - Success/Error
    'candidateCreated': 'Candidate created successfully',
    'candidateUpdated': 'Candidate updated successfully',
    'candidateDeleted': 'Candidate deleted successfully',
    'companyCreated': 'Company created successfully',
    'companyUpdated': 'Company updated successfully',
    'companyDeleted': 'Company deleted successfully',
    'employeeCreated': 'Employee created successfully',
    'employeeUpdated': 'Employee updated successfully',
    'settingsSaved': 'Settings saved successfully',
    'applicationSubmitted': 'Application Submitted!',
    'requestSubmitted': 'Request Submitted!',
    'thankYouSubmission': 'Thank you for submitting your profile. Our team will review your application and contact you soon.',
    'thankYouRequest': 'Thank you for your interest. Our team will review your requirements and contact you soon.',
    
    'failedToLoadCandidate': 'Failed to load candidate',
    'failedToLoadCompany': 'Failed to load company',
    'failedToLoadEmployee': 'Failed to load employee',
    'failedToCreateCandidate': 'Failed to create candidate',
    'failedToCreateCompany': 'Failed to create company',
    'failedToUpdateCandidate': 'Failed to update candidate',
    'failedToUpdateCompany': 'Failed to update company',
    'failedToDeleteCandidate': 'Failed to delete candidate',
    'failedToDeleteCompany': 'Failed to delete company',
    'confirmDeleteCandidate': 'Are you sure you want to delete this candidate?',
    'confirmDeleteCompany': 'Are you sure you want to delete this company?',
    
    // Dashboard
    'totalCandidates': 'Total Candidates',
    'totalCompanies': 'Total Companies',
    'placementsThisMonth': 'Placements This Month',
    'monthlyOverview': 'Monthly Overview',
    'quickActions': 'Quick Actions',
    'recentCandidates': 'Recent Candidates',
    'recentCompanies': 'Recent Companies',
    'viewAll': 'View All',
    'backToCandidates': 'Back to Candidates',
    'backToCompanies': 'Back to Companies',
    
    // Table columns
    'name': 'Name',
    'fullName': 'Full Name',
    'job': 'Job Title',
    'genderDisplay': 'Gender',
    'educationDisplay': 'Education',
    'files': 'Files',
    'actions': 'Actions',
    
    // Filters
    'searchPlaceholder': 'Search...',
    'filterBy': 'Filter by',
    'sortBy': 'Sort by',
    'all': 'All',
    
    // Assignment
    'assignment': 'Assignment',
    'assignedTo': 'Assigned to',
    'reassign': 'Reassign',
    'assignToEmployee': 'Assign to Employee',
    
    // Metadata
    'metadata': 'Metadata',
    'candidateId': 'Candidate ID',
    'companyId': 'Company ID',
    
    // Uploaded Documents
    'uploadedDocuments': 'Uploaded Documents',
    'pdfDocument': 'PDF Document',
    'jpgPngImage': 'JPG/PNG Image',
    'mp4Video': 'MP4 Video',
    
    // Admin Login
    'adminPanel': 'Admin Panel',
    'signIn': 'Sign In',
    'invalidCredentials': 'Invalid email or password',
    'adminAccessOnly': 'For admin access only',
    'enterPassword': 'Enter your password',
    
    // Settings Page
    'aboutPageSettings': 'About Page Settings',
    'aboutPageSettingsDesc': 'Information displayed on the public About page',
    'companyDescription': 'Company Description',
    'companyDescriptionPlaceholder': 'Enter company description',
    'companyDescriptionHelp': 'This text will be displayed on the About page',
    'officeLocation': 'Office Location (Google Maps URL)',
    'officeLocationPlaceholder': 'https://maps.google.com/...',
    'officeLocationHelp': 'Paste a Google Maps link or coordinates',
    'saveAboutSettings': 'Save About Settings',
    'contactPageSettings': 'Contact Page Settings',
    'contactPageSettingsDesc': 'Contact information and social media links',
    'contactEmail': 'Contact Email',
    'whatsappNumber': 'WhatsApp Number',
    'facebookUrl': 'Facebook URL',
    'instagramUrl': 'Instagram URL',
    'linkedinUrl': 'LinkedIn URL',
    'saveContactSettings': 'Save Contact Settings',
    'note': 'Note',
    'settingsNote': 'Changes to these settings will be immediately reflected on the public-facing About and Contact pages.',
    
    // Employee Roles Info
    'employeeRoles': 'Employee Roles',
    'ownerRole': 'Owner',
    'ownerRoleDesc': 'Full access to all features including employee management, deletions, and assignments',
    'secretaryRole': 'Secretary',
    'secretaryRoleDesc': 'Limited access - can view and update assigned candidates and companies',
    
    // File Upload
    'chooseFile': 'Choose',
    'optionalButRecommended': 'All files are optional but recommended for better matching',
    
    // Company Form Info
    'whatHappensNext': 'What happens next?',
    'reviewTimeline': 'Our team will review your requirements within 24 hours',
    'matchingProcess': "We'll match you with suitable candidates from our database",
    'receiveProfiles': "You'll receive candidate profiles that match your criteria",
    
    // Theme
    'darkMode': 'Dark Mode',
    'lightMode': 'Light Mode',
    
    // Language
    'language': 'Language',
    'english': 'English',
    'arabic': 'العربية',
    
    // Footer
    'connectingTalent': 'Connecting talent with opportunity',
    'allRightsReserved': 'All rights reserved',
    'aboutUs': 'About Us',
    
    // Validation messages
    'fieldRequired': 'This field is required',
    'enterValidEmail': 'Please enter a valid email',
    'enterValidPhone': 'Please enter a valid phone number',
    
    // Loading states
    'loadingData': 'Loading data...',
    'pleaseWait': 'Please wait...',
    
    // Empty states
    'noCandidatesFound': 'No candidates found',
    'noCompaniesFound': 'No companies found',
    'noEmployeesFound': 'No employees found',
    'candidateNotFound': 'Candidate not found',
    'companyNotFound': 'Company not found',
    
    // Info sections
    'personalInfo': 'Personal Information',
    'contactInfo': 'Contact Information',
  },
  ar: {
    // Navigation
    'dashboard': 'لوحة التحكم',
    'candidates': 'المرشحين',
    'companies': 'الشركات',
    'settings': 'الإعدادات',
    'home': 'الرئيسية',
    'about': 'من نحن',
    'contact': 'اتصل بنا',
    'adminLogin': 'تسجيل دخول المشرف',
    'employees': 'الموظفين',
    'logout': 'تسجيل الخروج',
    
    // Common Actions
    'add': 'إضافة',
    'edit': 'تعديل',
    'delete': 'حذف',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'create': 'إنشاء',
    'update': 'تحديث',
    'search': 'بحث',
    'filter': 'تصفية',
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'noData': 'لا توجد بيانات',
    'retry': 'إعادة المحاولة',
    'back': 'رجوع',
    'close': 'إغلاق',
    'submit': 'إرسال',
    'next': 'التالي',
    'previous': 'السابق',
    'confirm': 'تأكيد',
    'view': 'عرض',
    'download': 'تحميل',
    'upload': 'رفع',
    'clear': 'مسح',
    'apply': 'تطبيق',
    'reset': 'إعادة تعيين',
    
    // Status
    'active': 'نشط',
    'inactive': 'غير نشط',
    'pending': 'معلق',
    'completed': 'مكتمل',
    'unassigned': 'غير مسند',
    'assigned': 'مسند',
    'notAssigned': 'غير مسند',
    
    // Pagination
    'rowsPerPage': 'صفوف لكل صفحة',
    'of': 'من',
    'showing': 'عرض',
    'to': 'إلى',
    'results': 'نتيجة',
    'page': 'صفحة',
    
    // Candidates
    'candidateName': 'اسم المرشح',
    'candidateNamePlaceholder': 'أدخل الاسم الكامل',
    'phoneNumber': 'رقم الهاتف',
    'phonePlaceholder': '+20 123 456 7890',
    'jobTitle': 'المسمى الوظيفي',
    'jobTitlePlaceholder': 'مثال: مطور برمجيات',
    'experience': 'الخبرة',
    'years': 'سنوات',
    'yearsOfExperience': 'سنوات الخبرة',
    'yearsPlaceholder': '0',
    'cv': 'السيرة الذاتية',
    'photo': 'الصورة',
    'video': 'الفيديو',
    'cvResume': 'السيرة الذاتية',
    'personalPhoto': 'الصورة الشخصية',
    'introductionVideo': 'الفيديو التعريفي',
    'uploadCV': 'رفع السيرة الذاتية',
    'uploadPhoto': 'رفع الصورة',
    'uploadVideo': 'رفع الفيديو',
    'pdfOnly': 'PDF فقط',
    'jpgPngOnly': 'JPG/PNG فقط',
    'mp4Only': 'MP4 فقط',
    'clickToUpload': 'انقر للرفع',
    'noFiles': 'لا توجد ملفات',
    
    // Gender
    'gender': 'الجنس',
    'male': 'ذكر',
    'female': 'أنثى',
    'selectGender': 'اختر الجنس',
    
    // Education
    'education': 'التعليم',
    'educationalQualification': 'المؤهل التعليمي',
    'selectQualification': 'اختر المؤهل',
    'highSchool': 'الثانوية العامة',
    'diploma': 'دبلوم',
    'bachelor': 'بكالوريوس',
    'master': 'ماجستير',
    'phd': 'دكتوراه',
    'other': 'أخرى',
    'graduationYear': 'سنة التخرج',
    
    // Location
    'location': 'الموقع',
    'country': 'الدولة',
    'countryPlaceholder': 'مصر',
    'governorate': 'المحافظة',
    'governoratePlaceholder': 'القاهرة',
    'city': 'المدينة',
    'cityPlaceholder': 'القاهرة',
    
    // Companies
    'companyName': 'اسم الشركة',
    'companyNamePlaceholder': 'أدخل اسم الشركة',
    'contactPhone': 'هاتف الاتصال',
    'companyIndustry': 'مجال الشركة',
    'industry': 'المجال',
    'industryPlaceholder': 'مثال: التكنولوجيا، الصحة',
    'technology': 'تكنولوجيا',
    'healthcare': 'صحة',
    'finance': 'مالية',
    'ecommerce': 'تجارة إلكترونية',
    'requiredJob': 'الوظيفة المطلوبة',
    'requiredJobTitle': 'المسمى الوظيفي المطلوب',
    'requiredJobPlaceholder': 'مثال: مطور برمجيات أول',
    'manageCompanies': 'إدارة طلبات الشركات والتخصيصات',
    'assignedStatus': 'حالة التخصيص',
    'contactInformation': 'معلومات الاتصال',
    'created': 'تاريخ الإنشاء',
    'createdAt': 'تاريخ الإنشاء',
    'lastUpdated': 'آخر تحديث',
    
    // Employees
    'employeeName': 'اسم الموظف',
    'employeeEmail': 'بريد الموظف',
    'role': 'الدور',
    'selectRole': 'اختر الدور',
    'owner': 'المالك',
    'secretary': 'سكرتير',
    'salary': 'الراتب',
    'accountStatus': 'حالة الحساب',
    'totalEmployees': 'إجمالي الموظفين',
    'activeEmployees': 'الموظفين النشطين',
    'inactiveEmployees': 'الموظفين غير النشطين',
    'manageEmployees': 'إدارة حسابات وصلاحيات الموظفين',
    'addNewEmployee': 'إضافة موظف جديد',
    'editEmployee': 'تعديل الموظف',
    'createEmployee': 'إنشاء موظف',
    'updateEmployee': 'تحديث الموظف',
    'password': 'كلمة المرور',
    'passwordPlaceholder': 'أدخل كلمة المرور',
    'passwordLeaveBlank': 'اتركه فارغاً للإبقاء على الحالي',
    'employmentDetails': 'تفاصيل التوظيف',
    
    // Forms - Headers
    'addNewCandidate': 'إضافة مرشح جديد',
    'addNewCompany': 'إضافة شركة جديدة',
    'editCandidate': 'تعديل المرشح',
    'editCompany': 'تعديل الشركة',
    'createCandidate': 'إنشاء مرشح',
    'createCompany': 'إنشاء شركة',
    'updateCandidate': 'تحديث المرشح',
    'updateCompany': 'تحديث الشركة',
    'uploadDocuments': 'رفع المستندات',
    'companyInformation': 'معلومات الشركة',
    'educationExperience': 'التعليم والخبرة',
    'basicInformation': 'المعلومات الأساسية',
    'personalInformation': 'المعلومات الشخصية',
    'professionalInformation': 'المعلومات المهنية',
    'jobRequirements': 'متطلبات الوظيفة',
    
    // Form Actions
    'saving': 'جاري الحفظ...',
    'submitProfile': 'تقديم الملف الشخصي',
    'postRequirements': 'نشر المتطلبات',
    'applyAsCandidate': 'التقديم كمرشح',
    'postAJob': 'نشر وظيفة',
    'submitApplication': 'إرسال الطلب',
    'submitAnother': 'تقديم طلب آخر',
    
    // Form validation
    'required': 'مطلوب',
    'invalidEmail': 'بريد إلكتروني غير صالح',
    'invalidPhone': 'رقم هاتف غير صالح',
    'minLength': 'الحد الأدنى {min} أحرف',
    'maxLength': 'الحد الأقصى {max} أحرف',
    
    // Public Pages
    'heroTitle': 'نربط المواهب المتميزة بالفرص الاستثنائية',
    'heroSubtitle': 'انضم إلى المئات من المرشحين والشركات الذين يثقون بإلمتالق',
    'imCandidate': 'أنا مرشح',
    'imCompany': 'أنا شركة',
    'forCandidates': 'للمرشحين',
    'forCompanies': 'للشركات',
    'professionalScreening': 'الفحص المهني',
    'personalizedMatching': 'المطابقة الشخصية',
    'applyNow': 'قدم الآن',
    'howItWorks': 'كيف يعمل إلمتالق',
    'howItWorksSubtitle': 'عمليتنا المبسطة تجعل التوظيف بسيطاً وفعالاً',
    'readyToStart': 'هل أنت مستعد للبدء؟',
    'submitYourProfile': 'قدم ملفك الشخصي',
    'postJobRequirements': 'نشر متطلبات الوظيفة',
    
    // Step indicators
    'step': 'الخطوة',
    'basicInfo': 'المعلومات الأساسية',
    'details': 'التفاصيل',
    'documents': 'المستندات',
    
    // About Page
    'aboutTitle': 'عن إلمتالق',
    'ourStory': 'قصتنا',
    'ourValues': 'قيمنا',
    'excellence': 'التميز',
    'excellenceDesc': 'نسعى للتميز في كل توظيف',
    'peopleFirst': 'الأشخاص أولاً',
    'peopleFirstDesc': 'مرشحونا وعملاؤنا في قلب كل ما نقوم به',
    'integrity': 'النزاهة',
    'integrityDesc': 'نعمل بشفافية وأمانة',
    'ourOffice': 'مكتبنا',
    
    // Contact Page
    'getInTouch': 'تواصل معنا',
    'getInTouchSubtitle': 'هل لديك أسئلة؟ نود أن نسمع منك',
    'email': 'البريد الإلكتروني',
    'phone': 'الهاتف',
    'whatsapp': 'واتساب',
    'address': 'العنوان',
    'followUs': 'تابعنا',
    'followUsSubtitle': 'ابقَ على اطلاع بأحدث الفرص لدينا',
    'officeHours': 'ساعات العمل',
    'sundayToThursday': 'الأحد - الخميس',
    'fridaySaturday': 'الجمعة - السبت',
    'closed': 'مغلق',
    
    // Messages - Success/Error
    'candidateCreated': 'تم إنشاء المرشح بنجاح',
    'candidateUpdated': 'تم تحديث المرشح بنجاح',
    'candidateDeleted': 'تم حذف المرشح بنجاح',
    'companyCreated': 'تم إنشاء الشركة بنجاح',
    'companyUpdated': 'تم تحديث الشركة بنجاح',
    'companyDeleted': 'تم حذف الشركة بنجاح',
    'employeeCreated': 'تم إنشاء الموظف بنجاح',
    'employeeUpdated': 'تم تحديث الموظف بنجاح',
    'settingsSaved': 'تم حفظ الإعدادات بنجاح',
    'applicationSubmitted': 'تم إرسال الطلب!',
    'requestSubmitted': 'تم إرسال الطلب!',
    'thankYouSubmission': 'شكراً لتقديم ملفك الشخصي. سيراجع فريقنا طلبك وسيتصل بك قريباً.',
    'thankYouRequest': 'شكراً لاهتمامك. سيراجع فريقنا متطلباتك وسيتصل بك قريباً.',
    
    'failedToLoadCandidate': 'فشل في تحميل المرشح',
    'failedToLoadCompany': 'فشل في تحميل الشركة',
    'failedToLoadEmployee': 'فشل في تحميل الموظف',
    'failedToCreateCandidate': 'فشل في إنشاء المرشح',
    'failedToCreateCompany': 'فشل في إنشاء الشركة',
    'failedToUpdateCandidate': 'فشل في تحديث المرشح',
    'failedToUpdateCompany': 'فشل في تحديث الشركة',
    'failedToDeleteCandidate': 'فشل في حذف المرشح',
    'failedToDeleteCompany': 'فشل في حذف الشركة',
    'confirmDeleteCandidate': 'هل أنت متأكد من حذف هذا المرشح؟',
    'confirmDeleteCompany': 'هل أنت متأكد من حذف هذه الشركة؟',
    
    // Dashboard
    'totalCandidates': 'إجمالي المرشحين',
    'totalCompanies': 'إجمالي الشركات',
    'placementsThisMonth': 'التعيينات هذا الشهر',
    'monthlyOverview': 'نظرة شهرية',
    'quickActions': 'إجراءات سريعة',
    'recentCandidates': 'أحدث المرشحين',
    'recentCompanies': 'أحدث الشركات',
    'viewAll': 'عرض الكل',
    'backToCandidates': 'العودة للمرشحين',
    'backToCompanies': 'العودة للشركات',
    
    // Table columns
    'name': 'الاسم',
    'fullName': 'الاسم الكامل',
    'job': 'المسمى الوظيفي',
    'genderDisplay': 'الجنس',
    'educationDisplay': 'التعليم',
    'files': 'الملفات',
    'actions': 'الإجراءات',
    
    // Filters
    'searchPlaceholder': 'بحث...',
    'filterBy': 'تصفية حسب',
    'sortBy': 'ترتيب حسب',
    'all': 'الكل',
    
    // Assignment
    'assignment': 'التخصيص',
    'assignedTo': 'مسند إلى',
    'assignedEmployee': 'الموظف المسند',
    'reassign': 'إعادة التخصيص',
    'assignToEmployee': 'تخصيص لموظف',
    
    // Metadata
    'metadata': 'البيانات الوصفية',
    'candidateId': 'معرف المرشح',
    'companyId': 'معرف الشركة',
    
    // Uploaded Documents
    'uploadedDocuments': 'المستندات المرفوعة',
    'pdfDocument': 'مستند PDF',
    'jpgPngImage': 'صورة JPG/PNG',
    'mp4Video': 'فيديو MP4',
    
    // Admin Login
    'adminPanel': 'لوحة الإدارة',
    'signIn': 'تسجيل الدخول',
    'invalidCredentials': 'بريد إلكتروني أو كلمة مرور غير صالحة',
    'adminAccessOnly': 'للوصول المشرفين فقط',
    'enterPassword': 'أدخل كلمة المرور',
    
    // Settings Page
    'aboutPageSettings': 'إعدادات صفحة من نحن',
    'aboutPageSettingsDesc': 'المعلومات المعروضة على صفحة من نحن العامة',
    'companyDescription': 'وصف الشركة',
    'companyDescriptionPlaceholder': 'أدخل وصف الشركة',
    'companyDescriptionHelp': 'سيتم عرض هذا النص على صفحة من نحن',
    'officeLocation': 'موقع المكتب (رابط Google Maps)',
    'officeLocationPlaceholder': 'https://maps.google.com/...',
    'officeLocationHelp': 'ألصق رابط Google Maps أو الإحداثيات',
    'saveAboutSettings': 'حفظ إعدادات من نحن',
    'contactPageSettings': 'إعدادات صفحة الاتصال',
    'contactPageSettingsDesc': 'معلومات الاتصال وروابط التواصل الاجتماعي',
    'contactEmail': 'بريد الاتصال',
    'whatsappNumber': 'رقم واتساب',
    'facebookUrl': 'رابط فيسبوك',
    'instagramUrl': 'رابط إنستغرام',
    'linkedinUrl': 'رابط لينكدإن',
    'saveContactSettings': 'حفظ إعدادات الاتصال',
    'note': 'ملاحظة',
    'settingsNote': 'سيتم عكس التغييرات على هذه الإعدادات فوراً على صفحات من نحن والاتصال العامة.',
    
    // Employee Roles Info
    'employeeRoles': 'أدوار الموظفين',
    'ownerRole': 'المالك',
    'ownerRoleDesc': 'وصول كامل لجميع الميزات بما في ذلك إدارة الموظفين والحذف والتخصيصات',
    'secretaryRole': 'السكرتير',
    'secretaryRoleDesc': 'وصول محدود - يمكن عرض وتحديث المرشحين والشركات المخصصة له',
    
    // File Upload
    'chooseFile': 'اختر',
    'optionalButRecommended': 'جميع الملفات اختيارية لكنها موصى بها لمطابقة أفضل',
    
    // Company Form Info
    'whatHappensNext': 'ماذا سيحدث بعد ذلك؟',
    'reviewTimeline': 'سيراجع فريقنا متطلباتك خلال 24 ساعة',
    'matchingProcess': 'سنطابقك مع المرشحين المناسبين من قاعدة بياناتنا',
    'receiveProfiles': 'ستتلقى ملفات المرشحين التي تطابق معاييرك',
    
    // Theme
    'darkMode': 'الوضع الليلي',
    'lightMode': 'الوضع النهاري',
    
    // Language
    'language': 'اللغة',
    'english': 'English',
    'arabic': 'العربية',
    
    // Footer
    'connectingTalent': 'ربط المواهب بالفرص',
    'allRightsReserved': 'جميع الحقوق محفوظة',
    'aboutUs': 'من نحن',
    
    // Validation messages
    'fieldRequired': 'هذا الحقل مطلوب',
    'enterValidEmail': 'الرجاء إدخال بريد إلكتروني صالح',
    'enterValidPhone': 'الرجاء إدخال رقم هاتف صالح',
    
    // Loading states
    'loadingData': 'جاري تحميل البيانات...',
    'pleaseWait': 'الرجاء الانتظار...',
    
    // Empty states
    'noCandidatesFound': 'لم يتم العثور على مرشحين',
    'noCompaniesFound': 'لم يتم العثور على شركات',
    'noEmployeesFound': 'لم يتم العثور على موظفين',
    'candidateNotFound': 'المرشح غير موجود',
    'companyNotFound': 'الشركة غير موجودة',
    
    // Info sections
    'personalInfo': 'المعلومات الشخصية',
    'contactInfo': 'معلومات الاتصال',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    if (translation) {
      return translation as string;
    }
    // Log missing translation key in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing translation key: "${key}" for language: "${language}"`);
    }
    return fallback || key;
  }, [language]);

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
