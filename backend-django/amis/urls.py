from django.urls import path, include
from rest_framework.routers import DefaultRouter
from amis_app.views import (
    AuthViewSet, StudentViewSet, CourseViewSet, RegistrationViewSet,
    ResultViewSet, PaymentViewSet, AccommodationViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'registration', RegistrationViewSet, basename='registration')
router.register(r'results', ResultViewSet, basename='result')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'accommodation', AccommodationViewSet, basename='accommodation')

urlpatterns = [
    path('api/', include(router.urls)),
]
