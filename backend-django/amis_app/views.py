from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from amis_app.models import (
    Role, Student, Course, Registration, 
    ResultRecord, Payment, Accommodation
)
from amis_app.serializers import (
    UserSerializer, RoleSerializer, StudentSerializer, CourseSerializer,
    RegistrationSerializer, ResultRecordSerializer, PaymentSerializer, 
    AccommodationSerializer
)


class AuthViewSet(viewsets.ViewSet):
    """Authentication endpoints"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login endpoint to get JWT token"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
            'user_id': user.id,
        })
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register new user"""
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        return Response({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_201_CREATED)


class StudentViewSet(viewsets.ModelViewSet):
    """Student management endpoints"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['registration_number', 'first_name', 'last_name', 'email']
    ordering_fields = ['registration_number', 'first_name', 'created_at']
    ordering = ['registration_number']


class CourseViewSet(viewsets.ModelViewSet):
    """Course management endpoints"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['course_code', 'course_name', 'department']
    ordering_fields = ['course_code', 'course_name']
    ordering = ['course_code']


class RegistrationViewSet(viewsets.ModelViewSet):
    """Course registration endpoints"""
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['student__registration_number', 'course__course_code']
    ordering_fields = ['registered_at', 'semester']
    ordering = ['-registered_at']
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get registrations for a specific student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response(
                {'error': 'student_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registrations = Registration.objects.filter(student_id=student_id)
        serializer = self.get_serializer(registrations, many=True)
        return Response(serializer.data)


class ResultViewSet(viewsets.ModelViewSet):
    """Academic results endpoints"""
    queryset = ResultRecord.objects.all()
    serializer_class = ResultRecordSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['student__registration_number', 'course__course_code', 'semester']
    ordering_fields = ['recorded_at', 'marks', 'grade']
    ordering = ['-recorded_at']
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get results for a specific student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response(
                {'error': 'student_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = ResultRecord.objects.filter(student_id=student_id)
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ModelViewSet):
    """Financial/payment endpoints"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['receipt_number', 'student__registration_number']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get payments for a specific student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response(
                {'error': 'student_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payments = Payment.objects.filter(student_id=student_id)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)


class AccommodationViewSet(viewsets.ModelViewSet):
    """Accommodation/hostel management endpoints"""
    queryset = Accommodation.objects.all()
    serializer_class = AccommodationSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['hostel_name', 'room_number', 'student__registration_number']
