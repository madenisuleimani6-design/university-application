# AMIS - Quick Start Guide

## 🎓 Professional AMIS Portal Now Ready

Your Academic Management Information System has been transformed into a production-grade, professional application with a comprehensive UI matching enterprise university standards.

---

## 🚀 How to Run

### **Option 1: Frontend Only (Recommended for Quick Demo)**

```bash
# Terminal 1: Start the frontend
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

### **Option 2: Full Stack (Frontend + Backend)**

```bash
# Terminal 1: Start the backend
cd backend
mvn spring-boot:run

# Terminal 2: Start the frontend
cd frontend
npm run dev
```

Frontend: **http://localhost:3000**
Backend API: **http://localhost:8080**

### **Option 3: Docker Setup (With PostgreSQL)**

```bash
docker compose up --build
```

Frontend: **http://localhost:3000** (when configured)
Backend: **http://localhost:8080**
Database: PostgreSQL on port 5432

---

## 👤 Default Login Credentials

- **Username:** admin
- **Password:** admin123

---

## 📋 Available Features

### **Dashboard**

- Academic statistics cards (Enrolled Courses, Credits, Passed/Failed)
- Student profile summary with avatar
- Registration verification timeline
- Recent updates feed

### **Registration Portal**

- Multi-step registration process
- Form sections for:
  - Basic Details
  - Admission Details
  - Attended Schools
  - Attended College(s)
  - Health Insurance
  - Work Experience
  - Contact Information
  - Study Sponsors
  - Enrolled Courses
  - Registration Form Download

### **NHIF Portal**

- Membership Registration
- Card Application
- Application Invoices
- Card Verification

### **Student Services**

- Quick access to academic services

### **Academic**

- Course management
- Registration tracking

### **My Account**

- Profile management
- Settings

---

## 🎨 UI Features

✓ Professional university branding header with logo
✓ Expandable sidebar navigation with submenu support
✓ Color-coded stat cards (Blue, Orange, Green, Red)
✓ Registration verification timeline with progress indicators
✓ Multi-step form wizards
✓ Responsive design for mobile/tablet/desktop
✓ Font Awesome icons throughout
✓ Professional color scheme matching Ardhi University reference design

---

## 📝 System Architecture

- **Frontend:** React + TypeScript + Bootstrap
- **Backend:** Spring Boot REST API + JWT Authentication
- **Database:** H2 (default) or PostgreSQL (production)
- **Authentication:** JWT Token-based
- **Authorization:** Role-based access control (RBAC)

---

## 🔗 API Endpoints

```
POST   /api/auth/login
GET    /api/students
POST   /api/students
GET    /api/courses
POST   /api/courses
GET    /api/results
POST   /api/results
GET    /api/registration
POST   /api/registration
GET    /api/payments
POST   /api/payments
GET    /api/accommodation
POST   /api/accommodation
```

---

## 💡 Next Steps

1. Start the frontend to see the professional UI
2. Log in with: admin / admin123
3. Navigate through the dashboard, registration, and NHIF portals
4. Customize the university logo and colors in [frontend/src/components/Layout.tsx](frontend/src/components/Layout.tsx)
5. Connect the backend for full authentication and data persistence

---

## 📞 Support

For additional configurations, database setup, or API integration, refer to:

- [Backend README](backend/README.md)
- [Docker Configuration](docker-compose.yml)
- Frontend component styles in `src/styles/`

**The AMIS is now ready for deployment and further development!** 🎉
