from rest_framework import serializers
from django.contrib.auth.models import User
from amis_app.models import (
    Role, Student, Course, Registration, 
    ResultRecord, Payment, Accommodation
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


class StudentSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'registration_number', 'first_name', 'last_name', 
                  'email', 'phone', 'programme', 'user_detail', 'created_at']
        read_only_fields = ['created_at']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_code', 'course_name', 'credit_hours', 
                  'department', 'created_at']
        read_only_fields = ['created_at']


class RegistrationSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Registration
        fields = ['id', 'student', 'course', 'student_detail', 'course_detail',
                  'semester', 'academic_year', 'status', 'registered_at']
        read_only_fields = ['registered_at']


class ResultRecordSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = ResultRecord
        fields = ['id', 'student', 'course', 'student_detail', 'course_detail',
                  'marks', 'grade', 'semester', 'gpa', 'recorded_at']
        read_only_fields = ['recorded_at']


class PaymentSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_detail', 'amount', 
                  'payment_date', 'receipt_number']
        read_only_fields = ['payment_date']


class AccommodationSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = Accommodation
        fields = ['id', 'student', 'student_detail', 'hostel_name', 
                  'room_number', 'allocation_date']
        read_only_fields = ['allocation_date']
