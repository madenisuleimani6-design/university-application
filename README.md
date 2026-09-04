# AMIS - Academic Management Information System

**Professional, Production-Ready, Enterprise-Level University Management Portal**

A complete web-based solution for managing students, academics, finance, accommodation, and administration with professional UI matching enterprise university standards.

## 🎓 System Overview

This AMIS system consists of three main components:

1. **Frontend**: React + TypeScript + Vite (Port 3000)
2. **Backend**: Django REST Framework (Port 8080)
3. **Database**: PostgreSQL (Port 5432)

---

## 🚀 Quick Start

### Option 1: Frontend Only (Quick Demo)

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

### Option 2: Full Stack with Django Backend

#### Setup Django Backend

**Windows:**

```bash
setup-django.bat
```

**Linux/Mac:**

```bash
bash setup-django.sh
```

This will:

1. Create Python virtual environment
2. Install dependencies
3. Run database migrations
4. Create admin user (admin/admin123)
5. Start Django development server

#### In another terminal, start frontend:

```bash
cd frontend
npm run dev
```

**Access the System:**

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:8080/api**
- Django Admin: **http://localhost:8080/admin**

### Option 3: Docker Deployment

#### With Django Backend:

```bash
docker compose -f docker-compose-django.yml up --build
```

---

## 📋 Default Credentials

- **Admin Username:** admin
- **Admin Password:** admin123
- **Student Username:** student
- **Student Password:** student123
- **Role:** Administrator

The Java backend runs on JDK 25 and compiles application bytecode to Java 21 for compatibility with Spring Boot 3.3.4. See `LOGIN-SETUP.md` for the verified LAN login URLs.

---

## 📁 Project Structure

```
university application/
├── frontend/                  # React frontend (Port 3000)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API integration
│   │   └── styles/           # CSS styling
│   ├── package.json
│   └── vite.config.ts
│
├── backend-django/           # Django backend (Port 8080)
│   ├── amis/                 # Django project config
│   ├── amis_app/             # Main Django app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # Data serializers
│   │   └── admin.py          # Admin interface
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose-django.yml # Docker configuration
├── setup-django.sh/bat       # Setup scripts
├── QUICKSTART.md            # Quick start guide
└── README.md                # This file
```

---

## 🎨 Frontend Features

### Professional UI Components

- ✅ Modern university branding header
- ✅ Expandable sidebar navigation
- ✅ Multi-level submenus
- ✅ Dashboard with stat cards
- ✅ Student profile summary
- ✅ Registration verification timeline
- ✅ Multi-step registration wizard
- ✅ NHIF portal integration
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ FontAwesome icon integration

### Pages & Routes

- `/login` - Authentication
- `/` - Dashboard
- `/registration/*` - 10-step registration process
- `/nhif/*` - Health insurance portal (4 steps)
- `/student-services` - Student services
- `/academic` - Academic information
- `/account` - Account management
- `/students`, `/courses`, `/finance`, `/accommodation` - Legacy modules

---

## 🔧 Backend API

### Technology Stack

- **Framework:** Django 4.2.7
- **REST API:** Django REST Framework 3.14.0
- **Authentication:** JWT (Simple JWT 5.3.2)
- **Database:** PostgreSQL 16
- **Server:** Gunicorn 21.2.0
- **CORS:** django-cors-headers 4.3.1

### Core Models

**Student**

- registration_number (unique)
- first_name, last_name
- email, phone
- programme

**Course**

- course_code (unique)
- course_name
- credit_hours
- department

**Registration**

- student + course relationship
- semester, academic_year
- status (ENROLLED/DROPPED/COMPLETED)

**ResultRecord**

- student + course grades
- marks (0-100)
- grade (A-F)
- GPA calculation

**Payment**

- Financial records
- receipt_number (unique)
- transaction tracking

**Accommodation**

- Hostel assignment
- room_number
- allocation_date

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/login/        - Login with username/password
POST   /api/auth/register/     - Create new user account
```

### Students

```
GET    /api/students/          - List all students
POST   /api/students/          - Create new student
GET    /api/students/{id}/     - Get student details
PUT    /api/students/{id}/     - Update student
DELETE /api/students/{id}/     - Delete student
```

### Courses

```
GET    /api/courses/           - List all courses
POST   /api/courses/           - Create new course
GET    /api/courses/{id}/      - Get course details
PUT    /api/courses/{id}/      - Update course
DELETE /api/courses/{id}/      - Delete course
```

### Registration

```
GET    /api/registration/      - List all registrations
POST   /api/registration/      - Register for course
GET    /api/registration/{id}/ - Get registration details
GET    /api/registration/by_student/?student_id=1 - Student registrations
```

### Results

```
GET    /api/results/           - List all results
POST   /api/results/           - Record result
GET    /api/results/{id}/      - Get result details
GET    /api/results/by_student/?student_id=1 - Student results
```

### Payments

```
GET    /api/payments/          - List all payments
POST   /api/payments/          - Record payment
GET    /api/payments/{id}/     - Get payment details
GET    /api/payments/by_student/?student_id=1 - Student payments
```

### Accommodation

```
GET    /api/accommodation/     - List all accommodation
POST   /api/accommodation/     - Assign accommodation
GET    /api/accommodation/{id}/ - Get accommodation details
PUT    /api/accommodation/{id}/ - Update accommodation
DELETE /api/accommodation/{id}/ - Delete accommodation
```

---

## 🔐 Authentication & Security

### JWT Token Flow

1. User logs in with credentials
2. Backend returns JWT access token (24-hour expiration)
3. Frontend stores token in localStorage
4. All API requests include token in Authorization header
5. Backend validates token on each request

### Security Features

- ✅ Password hashing (Django's PBKDF2)
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ CSRF token for form submissions
- ✅ Role-based access control (RBAC)
- ✅ Secure password validation

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm 10+
- Python 3.9+
- PostgreSQL 12+ (optional, embedded DB for dev)
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Development server
npm run build        # Production build
```

### Django Backend Setup

```bash
# Windows
setup-django.bat

# Linux/Mac
bash setup-django.sh
```

**Manual Setup:**

```bash
cd backend-django

# Create virtual environment
python -m venv venv

# Activate it
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure database (edit .env)
cp .env.example .env

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver 0.0.0.0:8080
```

---

## 🐳 Docker Deployment

### Prerequisites

- Docker & Docker Compose installed

### Run with Django Backend

```bash
docker compose -f docker-compose-django.yml up --build
```

This will start:

- PostgreSQL database (port 5432)
- Django backend (port 8080)
- React frontend (port 3000)

### Access

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- Admin: http://localhost:8080/admin

---

## 📊 Admin Panel

Access Django admin interface: **http://localhost:8080/admin**

Features:

- Manage students, courses, registrations
- Record results and grades
- Process payments
- Assign accommodation
- View audit logs
- User management

---

## 🎯 Color Scheme & Branding

Professional university branding colors:

- **Primary Blue:** #003d82 (Headers, buttons)
- **Secondary Blue:** #0066cc (Links, titles)
- **Orange Accent:** #ff6600 (Active items, highlights)
- **Success Green:** #2d5016 (Confirmations, verification)
- **Neutral Gray:** #f5f5f5 - #e0e0e0 (Backgrounds)

---

## 📚 Documentation

- [Frontend README](frontend/README.md)
- [Django Backend README](backend-django/README.md)
- [Quick Start Guide](QUICKSTART.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## 🚨 Troubleshooting

### Frontend Build Errors

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Django Backend Issues

```bash
cd backend-django
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8080
```

### Database Connection Failed

- Ensure PostgreSQL is running
- Check credentials in `.env` file
- Verify database exists: `psql -l`

For detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📦 Technologies Used

### Frontend

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.10
- Bootstrap 5.3.3
- Axios 1.7.2
- React Router DOM 6.21.0

### Backend

- Django 4.2.7
- Django REST Framework 3.14.0
- Simple JWT 5.3.2
- PostgreSQL 16
- Gunicorn 21.2.0

### DevOps

- Docker & Docker Compose
- GitHub for version control

---

## ✨ Key Features

- ✅ Complete student information management
- ✅ Course registration with validation
- ✅ Automatic grade calculation
- ✅ Financial transaction tracking
- ✅ Hostel allocation management
- ✅ Registration verification workflow
- ✅ Multi-step enrollment process
- ✅ NHIF health insurance portal
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Responsive mobile-friendly design
- ✅ Professional university branding
- ✅ Complete REST API
- ✅ Django admin panel
- ✅ Docker containerization
- ✅ Production-ready deployment

---

## 📝 License

Academic Management Information System (AMIS)
Built for Ardhi University

---

## 📞 Support

For technical support or issues:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [Backend README](backend-django/README.md)
3. Check error logs in terminal

---

**AMIS - Powering University Management** 🎓

_Built with React + Django + PostgreSQL_
_Professional • Scalable • Secure_
