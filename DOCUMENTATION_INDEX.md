# 📚 AMIS Documentation Index

## Quick Navigation

### 🚀 Getting Started

1. **[README.md](README.md)** ⭐ START HERE
   - Project overview
   - Quick start options
   - Technology stack
   - Key features

2. **[QUICKSTART.md](QUICKSTART.md)**
   - One-minute setup
   - Default credentials
   - Frontend/Backend/Docker options

### 🔧 Backend Setup

#### Django Backend (Recommended)

- **[DJANGO_SETUP.md](DJANGO_SETUP.md)** - Complete Django setup guide
  - Installation instructions
  - API endpoint reference
  - Admin panel guide
  - Docker deployment
  - Troubleshooting

- **[backend-django/README.md](backend-django/README.md)** - Django backend documentation
  - Feature list
  - Installation steps
  - API endpoints
  - Admin interface
  - Development commands
  - Docker Dockerfile

- **[DJANGO_COMPLETE.md](DJANGO_COMPLETE.md)** - Implementation summary
  - What was created
  - Architecture overview
  - Complete file listing
  - Verification checklist
  - Next steps

### 🛠️ Troubleshooting & Support

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**
  - Common issues and solutions
  - Maven/Python setup issues
  - Port conflicts
  - Database connection errors
  - Verification checklist

---

## 📋 Project Structure

```
university application/
│
├── 📁 frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/             # Layout, Dashboard, Registration, etc.
│   │   ├── pages/                  # Page components
│   │   ├── services/api.ts         # API client with JWT
│   │   └── styles/                 # Professional CSS styling
│   ├── Dockerfile                  # Frontend container image
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 backend-django/              # Django REST Framework backend ⭐
│   ├── amis/                       # Django project config
│   │   ├── settings.py             # Database, auth, apps config
│   │   ├── urls.py                 # API routing
│   │   └── wsgi.py                 # Production server config
│   ├── amis_app/                   # Main Django application
│   │   ├── models.py               # Student, Course, etc. (7 models)
│   │   ├── views.py                # API ViewSets (7 viewsets)
│   │   ├── serializers.py          # Data serializers (7 serializers)
│   │   ├── admin.py                # Django admin configuration
│   │   ├── tests.py                # Unit tests
│   │   └── migrations/             # Database migrations
│   ├── manage.py                   # Django CLI
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables template
│   ├── Dockerfile                  # Backend container image
│   └── README.md                   # Backend documentation
│
├── 📁 backend/                     # Spring Boot backend (legacy - optional)
│   ├── pom.xml                     # Maven configuration
│   ├── src/main/java/com/example/amis/
│   │   ├── config/                 # JWT, Security, CORS config
│   │   ├── entity/                 # Database models (8 entities)
│   │   ├── repository/             # Data access layer
│   │   ├── controller/             # REST endpoints (7 controllers)
│   │   └── dto/                    # Request/Response objects
│   ├── src/main/resources/
│   │   ├── application.properties  # Development config (H2)
│   │   ├── application-postgres.properties  # Production config
│   │   ├── schema.sql              # Database schema
│   │   └── data.sql                # Initial data
│   ├── Dockerfile                  # Backend container
│   ├── mvnw / mvnw.cmd             # Maven wrapper
│   └── README.md                   # Backend documentation
│
├── 📄 docker-compose.yml           # Docker compose for Spring Boot + PostgreSQL
├── 📄 docker-compose-django.yml    # Docker compose for Django + PostgreSQL ⭐
├── 📄 setup-django.bat             # Windows Django setup automation
├── 📄 setup-django.sh              # Linux/Mac Django setup automation
├── 📄 build.bat                    # Windows Maven build script
├── 📄 build.sh                     # Linux/Mac Maven build script
│
├── 📚 Documentation Files:
│   ├── README.md                   # Main project README
│   ├── QUICKSTART.md               # Quick start guide (1 minute)
│   ├── DJANGO_SETUP.md             # Comprehensive Django setup
│   ├── DJANGO_COMPLETE.md          # Django implementation summary
│   ├── TROUBLESHOOTING.md          # Common issues & solutions
│   └── DOCUMENTATION_INDEX.md      # This file
│
└── .gitignore                      # Git ignore patterns
```

---

## 🎯 Choose Your Path

### Path 1: Frontend Only (Fastest)

**Time: 2 minutes**

```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

**Use:** UI testing, frontend development

---

### Path 2: Frontend + Django Backend (Recommended)

**Time: 5-10 minutes**

**Windows:**

```bash
setup-django.bat
# In another terminal:
cd frontend && npm run dev
```

**Linux/Mac:**

```bash
bash setup-django.sh
# In another terminal:
cd frontend && npm run dev
```

**Use:** Full development, API testing, production deployment

---

### Path 3: Docker Deployment (Production)

**Time: 3-5 minutes**

```bash
docker compose -f docker-compose-django.yml up --build
```

**Use:** Production environment, testing deployment

---

## 📊 Comparison: Django vs Spring Boot Backend

| Feature         | Django       | Spring Boot            |
| --------------- | ------------ | ---------------------- |
| Language        | Python       | Java                   |
| Framework       | Django 4.2.7 | Spring Boot 3.3.4      |
| REST API        | DRF 3.14.0   | Spring Web             |
| Authentication  | SimpleJWT    | Spring Security + jjwt |
| Setup Time      | 5 min        | 5 min                  |
| Learning Curve  | Easier       | More complex           |
| Performance     | Fast         | Fast                   |
| Scalability     | High         | High                   |
| Admin Panel     | Built-in     | Not included           |
| Community       | Large        | Very Large             |
| **Recommended** | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐               |

**Current Status:** Django backend is implemented and ready. Spring Boot backend is optional.

---

## 🔑 Key Credentials

### Frontend & Admin Panel

- **URL:** http://localhost:3000
- **Username:** admin
- **Password:** admin123

### Django Admin Panel

- **URL:** http://localhost:8080/admin
- **Username:** admin
- **Password:** admin123

### API

- **Base URL:** http://localhost:8080/api
- **Auth:** Bearer token in Authorization header
- **Token Duration:** 24 hours

### Database (PostgreSQL)

- **Host:** localhost
- **Port:** 5432
- **Database:** amisdb
- **User:** amis
- **Password:** amis123

---

## 🔌 API Endpoints Summary

All endpoints require JWT token except `/auth/login/` and `/auth/register/`

| Endpoint              | Method   | Purpose                    |
| --------------------- | -------- | -------------------------- |
| `/api/auth/login/`    | POST     | Get JWT token              |
| `/api/auth/register/` | POST     | Create user account        |
| `/api/students/`      | GET/POST | List/create students       |
| `/api/courses/`       | GET/POST | List/create courses        |
| `/api/registration/`  | GET/POST | Manage course registration |
| `/api/results/`       | GET/POST | Record academic results    |
| `/api/payments/`      | GET/POST | Process payments           |
| `/api/accommodation/` | GET/POST | Manage accommodation       |

Full endpoint list: See [DJANGO_SETUP.md](DJANGO_SETUP.md)

---

## 🛠️ Installation Prerequisites

### Minimum Requirements

- **Node.js:** 18+ ([Download](https://nodejs.org/))
- **Python:** 3.9+ ([Download](https://www.python.org/))
- **PostgreSQL:** 12+ ([Download](https://www.postgresql.org/)) - Optional for dev

### Check Installation

```bash
node --version      # v18+
npm --version       # 10+
python --version    # 3.9+
psql --version      # 12+ (optional)
```

---

## 📖 Common Tasks

### Start Frontend

```bash
cd frontend
npm run dev
# Frontend: http://localhost:3000
```

### Start Django Backend

```bash
cd backend-django
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
python manage.py runserver 0.0.0.0:8080
# Backend: http://localhost:8080
# Admin: http://localhost:8080/admin
```

### Run Tests

```bash
cd backend-django
python manage.py test
```

### Build Production Frontend

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Deploy with Docker

```bash
docker compose -f docker-compose-django.yml up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5432
```

### Create Admin User

```bash
cd backend-django
python manage.py createsuperuser
```

### Reset Database (⚠️ Development Only)

```bash
cd backend-django
python manage.py flush              # Delete all data
python manage.py migrate             # Recreate tables
python manage.py createsuperuser     # Create admin
```

---

## 🆘 Quick Troubleshooting

| Issue                        | Solution                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Port 3000 in use             | Kill process: `netstat -ano \| findstr :3000` then `taskkill /PID <id> /F`       |
| Port 8080 in use             | Kill process: `lsof -ti:8080 \| xargs kill -9`                                   |
| "No module named django"     | Activate venv: `source venv/bin/activate` then `pip install -r requirements.txt` |
| Database connection error    | Ensure PostgreSQL running and credentials correct in `.env`                      |
| Frontend can't reach backend | Check CORS config, ensure backend running on 8080                                |
| Build errors                 | Delete `node_modules` and `.npm` cache, run `npm install` again                  |

Full troubleshooting: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📞 Getting Help

### Documentation Priority

1. **[README.md](README.md)** - Start here for overview
2. **[QUICKSTART.md](QUICKSTART.md)** - For quick setup
3. **[DJANGO_SETUP.md](DJANGO_SETUP.md)** - For backend details
4. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - For issues
5. **[backend-django/README.md](backend-django/README.md)** - For API details

### External Resources

- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/

---

## ✅ Project Status

- ✅ Frontend: Production-ready React + TypeScript UI
- ✅ Backend: Complete Django REST API
- ✅ Database: PostgreSQL support
- ✅ Authentication: JWT tokens implemented
- ✅ Admin Panel: Django admin fully configured
- ✅ Docker: Multi-container setup ready
- ✅ Documentation: Comprehensive guides
- ✅ Tests: Unit tests included
- ✅ Security: Best practices implemented

**Status:** 🟢 Ready for Development & Production

---

## 🎓 Project Features

### Frontend Features

- Professional university branding
- Responsive design (mobile/tablet/desktop)
- Multi-step registration wizard (10 steps)
- NHIF portal (4 steps)
- Dashboard with statistics
- Student profile management
- Sidebar navigation with submenus
- FontAwesome icons

### Backend Features

- RESTful API (7 resource endpoints)
- JWT authentication
- Role-based access control
- 7 database models
- Automatic pagination & filtering
- Django admin interface
- Comprehensive error handling
- CORS configuration

### Database Features

- 7 main tables
- Automatic timestamps
- Foreign key relationships
- Unique constraints
- Data validation

---

## 🚀 Next Steps

1. **Read [README.md](README.md)** for overview
2. **Run [QUICKSTART.md](QUICKSTART.md)** for quick demo
3. **Follow [DJANGO_SETUP.md](DJANGO_SETUP.md)** for full setup
4. **Access http://localhost:3000** and login
5. **Test API at http://localhost:8080/api**
6. **Explore admin panel at http://localhost:8080/admin**
7. **Deploy with [docker-compose-django.yml](docker-compose-django.yml)**

---

**Welcome to AMIS! Happy Coding! 🎓**

_Academic Management Information System - Professional • Scalable • Secure_
