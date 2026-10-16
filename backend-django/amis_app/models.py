from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


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


class Election(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    active = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'elections'
        ordering = ['-starts_at']

    def __str__(self):
        return self.title


class ElectionPosition(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='positions')
    name = models.CharField(max_length=150)
    display_order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'election_positions'
        ordering = ['display_order', 'id']
        unique_together = ('election', 'name')

    def __str__(self):
        return f"{self.election.title} - {self.name}"


class Candidate(models.Model):
    position = models.ForeignKey(ElectionPosition, on_delete=models.CASCADE, related_name='candidates')
    name = models.CharField(max_length=200)
    manifesto = models.TextField(blank=True)
    photo_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'election_candidates'
        ordering = ['name']

    def __str__(self):
        return self.name


class Vote(models.Model):
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='election_votes', db_column='voter_id')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='votes')
    position = models.ForeignKey(ElectionPosition, on_delete=models.CASCADE, related_name='votes')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='votes')
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'election_votes'
        constraints = [models.UniqueConstraint(fields=['voter', 'position'], name='one_vote_per_position')]


class Announcement(models.Model):
    title = models.CharField(max_length=250)
    content = models.TextField()
    category = models.CharField(max_length=30)
    priority = models.CharField(max_length=20, default='NORMAL')
    attachment_url = models.URLField(blank=True)
    target_year = models.CharField(max_length=50, blank=True)
    target_programme = models.CharField(max_length=150, blank=True)
    target_course = models.CharField(max_length=150, blank=True)
    publish_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(blank=True, null=True)
    published = models.BooleanField(default=True)
    author_username = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'announcements'
        ordering = ['-publish_at', '-created_at']

    def __str__(self):
        return self.title
