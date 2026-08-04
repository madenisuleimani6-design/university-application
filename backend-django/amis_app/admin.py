from django.contrib import admin
from amis_app.models import (
    Role, Student, Course, Registration, 
    ResultRecord, Payment, Accommodation
)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['registration_number', 'first_name', 'last_name', 'email', 'programme']
    search_fields = ['registration_number', 'first_name', 'last_name', 'email']
    list_filter = ['programme', 'created_at']
    ordering = ['registration_number']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_code', 'course_name', 'credit_hours', 'department']
    search_fields = ['course_code', 'course_name']
    list_filter = ['department', 'credit_hours']
    ordering = ['course_code']


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'semester', 'academic_year', 'status']
    search_fields = ['student__registration_number', 'course__course_code']
    list_filter = ['semester', 'academic_year', 'status']
    ordering = ['-registered_at']


@admin.register(ResultRecord)
class ResultRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'marks', 'grade', 'semester', 'gpa']
    search_fields = ['student__registration_number', 'course__course_code']
    list_filter = ['semester', 'grade']
    ordering = ['-recorded_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'student', 'amount', 'payment_date']
    search_fields = ['receipt_number', 'student__registration_number']
    list_filter = ['payment_date']
    ordering = ['-payment_date']


@admin.register(Accommodation)
class AccommodationAdmin(admin.ModelAdmin):
    list_display = ['student', 'hostel_name', 'room_number', 'allocation_date']
    search_fields = ['student__registration_number', 'hostel_name', 'room_number']
    list_filter = ['hostel_name', 'allocation_date']
