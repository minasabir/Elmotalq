# نظام إدارة التوظيف - التطبيق الإداري

## نظرة عامة

تطبيق إداري شامل لإدارة نظام التوظيف "الملتق"، مصمم لإدارة المرشحين والشركات والموظفين بكفاءة.

## المميزات الرئيسية

### 🔐 المصادقة والأمان
- تسجيل الدخول الآمن باستخدام JWT
- حماية المسارات بحارس الأمان
- إدارة الجلسات المستمرة

### 👥 إدارة المرشحين
- عرض جميع المرشحين
- فلترة المرشحين غير المعينين
- البحث والتصفية المتقدم
- تعيين المرشحين للمساعدين
- عمليات CRUD كاملة

### 🏢 إدارة الشركات
- إدارة قواعد بيانات الشركات
- تتبع طلبات التوظيف
- تعيين الشركات للمساعدين
- معلومات الاتصال والتفاصيل

### 👔 إدارة الموظفين
- إدارة حسابات الموظفين
- تحديث الأدوار والصلاحيات
- تفعيل/إلغاء تفعيل الحسابات
- إدارة معلومات الموظفين

### 📊 لوحة التحكم
- إحصائيات شاملة
- رسوم بيانية تفاعلية
- آخر النشاطات
- إجراءات سريعة

### 🔍 البحث العام
- بحث متقدم في جميع البيانات
- سجل البحث المحفوظ
- فلترة حسب النوع والتاريخ

### ⚙️ الإعدادات
- معلومات النظام
- بيانات الاتصال
- إعدادات متقدمة

## التقنيات المستخدمة

- **Angular 21** - إطار العمل الرئيسي
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - إطار التصميم
- **RxJS** - البرمجة التفاعلية
- **Angular Forms** - إدارة النماذج

## بنية المشروع

```
src/
├── app/
│   ├── auth/                    # وحدة المصادقة
│   ├── candidates/              # وحدة المرشحين
│   ├── companies/               # وحدة الشركات
│   ├── employees/               # وحدة الموظفين
│   ├── shared/                  # المكونات المشتركة
│   ├── core/                    # الخدمات الأساسية
│   └── dashboard/               # لوحة التحكم
├── assets/                     # الملفات الثابتة
└── environments/               # إعدادات البيئة
```

## واجهة برمجة التطبيقات (API)

يتصل التطبيق بواجهة برمجة التطبيقات التالية:

### المصادقة
- `POST /api/AdminElmtalq/Auth/Login`

### المرشحين
- `GET /api/AdminElmtalq/Candidates`
- `GET /api/AdminElmtalq/Candidates/Unassigned`
- `GET /api/AdminElmtalq/Candidates/{id}`
- `PUT /api/AdminElmtalq/Candidates/{id}`
- `PATCH /api/AdminElmtalq/Candidates/{id}`
- `DELETE /api/AdminElmtalq/Candidates/{id}`
- `PUT /api/AdminElmtalq/Candidates/{id}/Assign/{secretaryId}`

### الشركات
- `GET /api/AdminElmtalq/Companies`
- `GET /api/AdminElmtalq/Companies/Unassigned`
- `GET /api/AdminElmtalq/Companies/{id}`
- `PUT /api/AdminElmtalq/Companies/{id}`
- `PATCH /api/AdminElmtalq/Companies/{id}`
- `DELETE /api/AdminElmtalq/Companies/{id}`
- `PUT /api/AdminElmtalq/Companies/{id}/Assign/{secretaryId}`

### الموظفين
- `GET /api/AdminElmtalq/Employees`
- `POST /api/AdminElmtalq/Employees`
- `PATCH /api/AdminElmtalq/Employees/{id}`

### البحث
- `GET /api/AdminElmtalq/Search`

### الإعدادات
- `PATCH /api/AdminElmtalq/About`
- `PATCH /api/AdminElmtalq/Contact`

## التثبيت والتشغيل

1. **تثبيت الاعتماديات**
   ```bash
   npm install
   ```

2. **تشغيل خادم التطوير**
   ```bash
   npm run start
   ```

3. **بناء المشروع للإنتاج**
   ```bash
   npm run build
   ```

## المتطلبات

- Node.js 18 أو أحدث
- npm 9 أو أحدث
- Angular CLI 21 أو أحدث

## التطوير

### إضافة مكون جديد
```bash
ng generate component component-name
```

### إضافة خدمة جديدة
```bash
ng generate service service-name
```

### إضافة وحدة جديدة
```bash
ng generate module module-name
```

## المساهمين

- فريق تطوير الملتق

## الترخيص

جميع الحقوق محفوظة © 2024 الملتق
