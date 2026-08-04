# Django Backend Setup Guide

## ✨ What's New?

Your AMIS system now has a complete **Django REST Framework** backend to replace the Spring Boot backend. This provides:

- ✅ Pythonic, clean API implementation
- ✅ Built-in Django admin panel
- ✅ JWT token authentication
- ✅ PostgreSQL database support
- ✅ RESTful API design
- ✅ Easy-to-maintain codebase
- ✅ Docker containerization
- ✅ Production-ready with Gunicorn

---

## 🚀 Getting Started with Django Backend

### Prerequisites

- Python 3.9+
- PostgreSQL 12+ (optional, can use local SQLite for testing)
- pip or conda

### Option 1: Automated Setup (Recommended)

#### Windows:

```bash
setup-django.bat
```

#### Linux/Mac:

```bash
bash setup-django.sh
```

This script will:

1. ✅ Create Python virtual environment
2. ✅ Install all dependencies from requirements.txt
3. ✅ Run database migrations
4. ✅ Create admin user (admin/admin123)
5. ✅ Start Django development server on port 8080

### Option 2: Manual Setup

```bash
cd backend-django

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Configure database in .env (if using PostgreSQL)

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver 0.0.0.0:8080
```

---

## 📁 Project Structure

```
backend-django/
├── amis/                      # Django project config
│   ├── settings.py           # Main configuration
│   ├── urls.py               # URL routing
│   ├── wsgi.py               # WSGI application
│   └── __init__.py
│
├── amis_app/                 # Main Django application
│   ├── models.py             # Database models (Student, Course, etc.)
│   ├── views.py              # API views/viewsets
│   ├── serializers.py        # Data serializers
│   ├── admin.py              # Django admin configuration
│   ├── apps.py               # App configuration
│   ├── tests.py              # Unit tests
│   ├── urls.py               # App-level URLs
│   ├── migrations/           # Database migrations
│   └── __init__.py
│
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── Dockerfile               # Docker image definition
├── README.md                # Backend documentation
└── .gitignore
```

---

## 🔗 API Endpoints

All endpoints require JWT token in Authorization header (except login/register):

```
Authorization: Bearer {token}
```

### Authentication

```
POST   /api/auth/login/          - Login (returns JWT token)
POST   /api/auth/register/       - Register new user
```

### Students

```
GET    /api/students/            - List students (paginated, searchable)
POST   /api/students/            - Create new student
GET    /api/students/{id}/       - Get student details
PUT    /api/students/{id}/       - Update student
DELETE /api/students/{id}/       - Delete student
```

### Courses

```
GET    /api/courses/             - List courses
POST   /api/courses/             - Create course
GET    /api/courses/{id}/        - Get course details
PUT    /api/courses/{id}/        - Update course
DELETE /api/courses/{id}/        - Delete course
```

### Registration

```
GET    /api/registration/        - List registrations
POST   /api/registration/        - Register student for course
GET    /api/registration/{id}/   - Get registration details
GET    /api/registration/by_student/?student_id=1 - Student's courses
```

### Results

```
GET    /api/results/             - List results
POST   /api/results/             - Record result
GET    /api/results/{id}/        - Get result details
GET    /api/results/by_student/?student_id=1 - Student's grades
```

### Payments

```
GET    /api/payments/            - List payments
POST   /api/payments/            - Record payment
GET    /api/payments/{id}/       - Get payment details
GET    /api/payments/by_student/?student_id=1 - Student's payments
```

### Accommodation

```
GET    /api/accommodation/       - List accommodation
POST   /api/accommodation/       - Assign accommodation
GET    /api/accommodation/{id}/  - Get accommodation details
PUT    /api/accommodation/{id}/  - Update accommodation
DELETE /api/accommodation/{id}/  - Delete accommodation
```

---

## 📊 Django Admin Panel

Access the admin interface at: **http://localhost:8080/admin**

**Login:**

- Username: admin
- Password: admin123

**Features:**

- Manage all students, courses, registrations
- Record grades and results
- Track payments
- Assign accommodation
- User management
- Searchable, filterable lists
- Bulk operations

---

## 🔐 Authentication

### Login Flow

1. **Send credentials:**

```bash
curl -X POST http://localhost:8080/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

2. **Receive token:**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "username": "admin",
  "user_id": 1
}
```

3. **Use token in requests:**

```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/students/
```

4. **Token expires in 24 hours** - Use refresh token to get new access token

---

## 🐳 Docker Deployment

### Quick Start

```bash
docker compose -f docker-compose-django.yml up --build
```

This starts:

- **PostgreSQL** on port 5432
- **Django Backend** on port 8080
- **React Frontend** on port 3000

### Access

- Frontend: http://localhost:3000
- API: http://localhost:8080/api
- Admin: http://localhost:8080/admin
- Database: postgresql://amis:amis123@localhost:5432/amisdb

---

## 📋 Database Models

### Student

```python
- registration_number (unique)
- first_name, last_name
- email (unique)
- phone
- programme
- user (OneToOne with Django User)
- created_at, updated_at
```

### Course

```python
- course_code (unique)
- course_name
- credit_hours (1-6)
- department
- created_at
```

### Registration

```python
- student (ForeignKey)
- course (ForeignKey)
- semester
- academic_year
- status (ENROLLED/DROPPED/COMPLETED)
- registered_at
```

### ResultRecord

```python
- student (ForeignKey)
- course (ForeignKey)
- marks (0-100)
- grade (A-F)
- semester
- gpa
- recorded_at
```

### Payment

```python
- student (ForeignKey)
- amount
- payment_date
- receipt_number (unique)
```

### Accommodation

```python
- student (OneToOne)
- hostel_name
- room_number
- allocation_date
```

---

## 🧪 Running Tests

```bash
cd backend-django

# Run all tests
python manage.py test

# Run specific test class
python manage.py test amis_app.tests.StudentTestCase

# Run with verbose output
python manage.py test -v 2

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

---

## 🔧 Common Commands

```bash
# Create database migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create new Django app
python manage.py startapp app_name

# Access Django shell (Python REPL with Django context)
python manage.py shell

# Collect static files (production)
python manage.py collectstatic

# Flush database (delete all data)
python manage.py flush

# Load data from JSON
python manage.py loaddata fixture_name.json

# Export data to JSON
python manage.py dumpdata > backup.json

# Check for issues
python manage.py check

# Show all URLs
python manage.py show_urls
```

---

## 📝 Environment Variables

Edit `.env` file to configure:

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=amisdb
DB_USER=amis
DB_PASSWORD=amis123
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=jwt-secret-key-here

# Server
SERVER_PORT=8080
```

---

## 🚨 Troubleshooting

### "ModuleNotFoundError: No module named 'django'"

```bash
# Activate virtual environment and reinstall
pip install -r requirements.txt
```

### "Connection refused" (Database)

```bash
# Ensure PostgreSQL is running
# On Windows: Services > PostgreSQL
# On Mac: brew services start postgresql
# On Linux: sudo systemctl start postgresql

# Or use SQLite (default for development)
```

### "Port 8080 already in use"

```bash
# Find and kill process
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8080 | xargs kill -9
```

### "Migrations error"

```bash
# Reset migrations (development only!)
python manage.py migrate amis_app zero
rm amis_app/migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

---

## 🔄 Integrating with Frontend

The React frontend at `http://localhost:3000` is already configured to use the Django backend API:

**API client:** [frontend/src/services/api.ts](../frontend/src/services/api.ts)

```typescript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Automatically adds JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)

---

## 🎯 Next Steps

1. ✅ Complete Django backend setup
2. ✅ Start development server on port 8080
3. ✅ Run React frontend on port 3000
4. ✅ Test login with admin/admin123
5. ✅ Explore Django admin panel
6. ✅ Test API endpoints with Postman or curl
7. ✅ Implement remaining features
8. ✅ Deploy to production

---

## 📞 Support

For issues or questions:

1. Check [backend-django/README.md](../backend-django/README.md)
2. See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
3. Review error logs in terminal
4. Check Django debug page at `http://localhost:8080` (when DEBUG=True)

---

**Happy coding! 🚀**

Built with Django + Django REST Framework + PostgreSQL
