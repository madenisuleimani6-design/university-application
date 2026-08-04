from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Role(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('LECTURER', 'Lecturer'),
        ('FINANCE', 'Finance Officer'),
        ('STUDENT', 'Student'),
    ]
    
    name = models.CharField(max_length=50, unique=True, choices=ROLE_CHOICES)
    
    class Meta:
        db_table = 'roles'
    
    def __str__(self):
        return self.name


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    registration_number = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    programme = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'students'
        ordering = ['registration_number']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.registration_number})"


class Course(models.Model):
    course_code = models.CharField(max_length=100, unique=True)
    course_name = models.CharField(max_length=150)
    credit_hours = models.IntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(6)])
    department = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['course_code']
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"


class Registration(models.Model):
    STATUS_CHOICES = [
        ('ENROLLED', 'Enrolled'),
        ('DROPPED', 'Dropped'),
        ('COMPLETED', 'Completed'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='registrations')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='registrations')
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ENROLLED')
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'registrations'
        unique_together = ('student', 'course', 'semester', 'academic_year')
    
    def __str__(self):
        return f"{self.student.registration_number} - {self.course.course_code}"


class ResultRecord(models.Model):
    GRADE_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('F', 'F'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    marks = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)])
    grade = models.CharField(max_length=1, choices=GRADE_CHOICES)
    semester = models.CharField(max_length=20)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'results'
        unique_together = ('student', 'course', 'semester')
    
    def __str__(self):
        return f"{self.student.registration_number} - {self.course.course_code}: {self.grade}"


class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    receipt_number = models.CharField(max_length=100, unique=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-payment_date']
    
    def __str__(self):
        return f"{self.receipt_number} - {self.student.registration_number}"


class Accommodation(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='accommodation')
    hostel_name = models.CharField(max_length=150)
    room_number = models.CharField(max_length=50)
    allocation_date = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'accommodations'
    
    def __str__(self):
        return f"{self.student.registration_number} - {self.hostel_name} {self.room_number}"
