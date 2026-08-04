# AMIS Backend - Django

Professional Django REST framework backend for the Academic Management Information System (AMIS).

## Features

- ✅ JWT Token-based Authentication
- ✅ PostgreSQL Database Support
- ✅ RESTful API Endpoints
- ✅ Role-based Access Control (RBAC)
- ✅ Complete Student Management
- ✅ Course Registration System
- ✅ Results & Grades Management
- ✅ Financial Management
- ✅ Accommodation Management
- ✅ Django Admin Interface
- ✅ CORS Support for Frontend Integration

## Prerequisites

- Python 3.9+
- PostgreSQL 12+ (for production)
- pip or conda

## Installation

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Database

Create a `.env` file in the project root:

```env
# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=amisdb
DB_USER=amis
DB_PASSWORD=amis123
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Django
DEBUG=True
SECRET_KEY=your-django-secret-key
```

### 4. Create PostgreSQL Database

```sql
CREATE DATABASE amisdb;
CREATE USER amis WITH PASSWORD 'amis123';
ALTER ROLE amis SET client_encoding TO 'utf8';
ALTER ROLE amis SET default_transaction_isolation TO 'read committed';
ALTER ROLE amis SET default_transaction_deferrable TO on;
ALTER ROLE amis SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE amisdb TO amis;
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser (Admin)

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@amis.edu
# Password: admin123
```

### 7. Load Initial Data (Optional)

```bash
python manage.py loaddata initial_data.json
```

## Running the Server

### Development Server

```bash
python manage.py runserver 0.0.0.0:8080
```

Server will start at: **http://localhost:8080**

### Production Server (Gunicorn)

```bash
gunicorn amis.wsgi:application --bind 0.0.0.0:8080
```

## API Endpoints

### Authentication

- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/register/` - Register new user

### Students

- `GET /api/students/` - List all students
- `POST /api/students/` - Create new student
- `GET /api/students/{id}/` - Get student details
- `PUT /api/students/{id}/` - Update student
- `DELETE /api/students/{id}/` - Delete student

### Courses

- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create new course
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course
- `DELETE /api/courses/{id}/` - Delete course

### Registration

- `GET /api/registration/` - List all registrations
- `POST /api/registration/` - Register for course
- `GET /api/registration/by_student/?student_id=1` - Get student registrations

### Results

- `GET /api/results/` - List all results
- `POST /api/results/` - Record result
- `GET /api/results/by_student/?student_id=1` - Get student results

### Payments

- `GET /api/payments/` - List all payments
- `POST /api/payments/` - Record payment
- `GET /api/payments/by_student/?student_id=1` - Get student payments

### Accommodation

- `GET /api/accommodation/` - List all accommodation
- `POST /api/accommodation/` - Assign accommodation
- `GET /api/accommodation/{id}/` - Get accommodation details

## Admin Interface

Access Django admin panel:

- URL: **http://localhost:8080/admin**
- Username: `admin`
- Password: `admin123`

## Authentication

All API endpoints (except login/register) require JWT token in request header:

```
Authorization: Bearer {token}
```

Tokens expire in 24 hours.

## Database Models

### Student

- registration_number (unique)
- first_name, last_name
- email (unique)
- phone
- programme
- user (one-to-one with Django User)

### Course

- course_code (unique)
- course_name
- credit_hours (1-6)
- department

### Registration

- student (foreign key)
- course (foreign key)
- semester
- academic_year
- status (ENROLLED/DROPPED/COMPLETED)

### ResultRecord

- student (foreign key)
- course (foreign key)
- marks (0-100)
- grade (A-F)
- semester
- gpa

### Payment

- student (foreign key)
- amount
- receipt_number (unique)
- payment_date

### Accommodation

- student (one-to-one)
- hostel_name
- room_number
- allocation_date

## Docker Deployment

Build and run with Docker Compose:

```bash
docker compose up --build
```

This will start:

- Django Backend on port 8080
- PostgreSQL on port 5432

## Troubleshooting

### "Database connection refused"

- Ensure PostgreSQL is running
- Check credentials in `.env` file
- Verify database exists: `psql -l`

### "No module named 'django'"

- Activate virtual environment
- Run `pip install -r requirements.txt`

### "Migration errors"

- Delete all migrations except `__init__.py` in `amis_app/migrations/`
- Run `python manage.py makemigrations`
- Run `python manage.py migrate`

## Development Commands

```bash
# Create new app
python manage.py startapp app_name

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test

# Shell access
python manage.py shell

# Flush database (delete all data)
python manage.py flush
```

## Project Structure

```
backend-django/
├── manage.py              # Django CLI
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── amis/                 # Project configuration
│   ├── settings.py       # Django settings
│   ├── urls.py           # URL routing
│   ├── wsgi.py           # WSGI application
│   └── __init__.py
├── amis_app/             # Main application
│   ├── models.py         # Database models
│   ├── views.py          # API views
│   ├── serializers.py    # Data serializers
│   ├── admin.py          # Admin interface
│   ├── apps.py           # App configuration
│   ├── urls.py           # App URLs
│   ├── tests.py          # Unit tests
│   └── migrations/       # Database migrations
└── README.md             # This file
```

## Support & Documentation

- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- Simple JWT: https://django-rest-framework-simplejwt.readthedocs.io/

---

**AMIS Backend - Built with Django & Django REST Framework** 🎓
