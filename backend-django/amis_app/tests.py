from django.test import TestCase
from django.contrib.auth.models import User
from amis_app.models import Student, Course, Registration, ResultRecord, Payment, Accommodation
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class AuthenticationTestCase(TestCase):
    """Test authentication endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@amis.edu',
            password='testpass123'
        )
    
    def test_login_success(self):
        """Test successful login"""
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)


class StudentTestCase(TestCase):
    """Test student endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@amis.edu',
            password='testpass123'
        )
        self.student = Student.objects.create(
            registration_number='REG001',
            first_name='John',
            last_name='Doe',
            email='john@amis.edu',
            programme='Bachelor of Science'
        )
        
        # Authenticate
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_get_students_list(self):
        """Test getting list of students"""
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, 200)
    
    def test_create_student(self):
        """Test creating a new student"""
        data = {
            'registration_number': 'REG002',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@amis.edu',
            'programme': 'Bachelor of Commerce'
        }
        response = self.client.post('/api/students/', data)
        self.assertEqual(response.status_code, 201)


class CourseTestCase(TestCase):
    """Test course endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@amis.edu',
            password='testpass123'
        )
        self.course = Course.objects.create(
            course_code='CS101',
            course_name='Introduction to Programming',
            credit_hours=3,
            department='Computer Science'
        )
        
        # Authenticate
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_get_courses_list(self):
        """Test getting list of courses"""
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, 200)
    
    def test_create_course(self):
        """Test creating a new course"""
        data = {
            'course_code': 'CS102',
            'course_name': 'Data Structures',
            'credit_hours': 3,
            'department': 'Computer Science'
        }
        response = self.client.post('/api/courses/', data)
        self.assertEqual(response.status_code, 201)
