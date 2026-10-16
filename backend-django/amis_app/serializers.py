from rest_framework import serializers
from django.contrib.auth.models import User
from amis_app.models import (
    Role, Student, Course, Registration, 
    ResultRecord, Payment, Accommodation, Announcement
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


class AnnouncementSerializer(serializers.ModelSerializer):
    authorUsername = serializers.CharField(source='author_username', read_only=True)
    attachmentUrl = serializers.CharField(source='attachment_url', required=False, allow_blank=True)
    targetYear = serializers.CharField(source='target_year', required=False, allow_blank=True)
    targetProgramme = serializers.CharField(source='target_programme', required=False, allow_blank=True)
    targetCourse = serializers.CharField(source='target_course', required=False, allow_blank=True)
    publishAt = serializers.DateTimeField(source='publish_at', required=False)
    expiresAt = serializers.DateTimeField(source='expires_at', required=False, allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'category', 'priority', 'attachmentUrl',
                  'targetYear', 'targetProgramme', 'targetCourse', 'publishAt', 'expiresAt',
                  'published', 'authorUsername', 'createdAt']
        read_only_fields = ['authorUsername', 'createdAt']
