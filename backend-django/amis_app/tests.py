from django.test import TestCase
from django.contrib.auth.models import User
from amis_app.models import Student, Course, Registration, ResultRecord, Payment, Accommodation
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta


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


class ElectionAndInformationTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin-test', password='admin-pass', is_staff=True)
        self.student = User.objects.create_user(username='student-test', password='student-pass')
        self.admin_client = APIClient()
        self.admin_client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.admin).access_token}')
        self.student_client = APIClient()
        self.student_client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.student).access_token}')

    def test_admin_can_publish_information_and_run_an_election(self):
        announcement = self.admin_client.post('/api/announcements/', {
            'title': 'Voting is open', 'content': 'Please vote today.', 'category': 'ELECTION', 'priority': 'IMPORTANT', 'published': True,
        }, format='json')
        self.assertEqual(announcement.status_code, 201)
        self.assertEqual(self.student_client.get('/api/announcements/').status_code, 200)

        now = timezone.now()
        election = self.admin_client.post('/api/elections/', {
            'title': 'Student Leaders', 'description': 'Annual election',
            'startsAt': (now - timedelta(minutes=1)).isoformat(),
            'endsAt': (now + timedelta(hours=1)).isoformat(),
        }, format='json')
        self.assertEqual(election.status_code, 201)
        election_id = election.data['id']
        position = self.admin_client.post(f'/api/elections/{election_id}/positions/', {'name': 'President', 'displayOrder': 1}, format='json')
        self.assertEqual(position.status_code, 201)
        candidate = self.admin_client.post(f'/api/elections/positions/{position.data["id"]}/candidates/', {'name': 'Asha Juma', 'manifesto': 'Service first'}, format='json')
        self.assertEqual(candidate.status_code, 201)
        self.assertEqual(self.admin_client.patch(f'/api/elections/{election_id}/status/', {'active': True, 'closed': False}, format='json').status_code, 200)
        self.assertEqual(self.student_client.post(f'/api/elections/{election_id}/votes/', {'candidateId': candidate.data['id']}, format='json').status_code, 204)
        results = self.student_client.get(f'/api/elections/{election_id}/results/')
        self.assertEqual(results.status_code, 200)
        self.assertEqual(results.data['positions'][0]['candidates'][0]['percentage'], 100)
