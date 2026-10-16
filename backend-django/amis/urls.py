from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from amis_app.views import (
    AuthViewSet, StudentViewSet, CourseViewSet, RegistrationViewSet,
    ResultViewSet, PaymentViewSet, AccommodationViewSet, ElectionViewSet,
    CandidateCreateViewSet, CandidatePhotoUploadView, AnnouncementViewSet,
    AnnouncementAttachmentUploadView
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'registration', RegistrationViewSet, basename='registration')
router.register(r'results', ResultViewSet, basename='result')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'accommodation', AccommodationViewSet, basename='accommodation')
router.register(r'elections', ElectionViewSet, basename='election')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')

urlpatterns = [
    path('api/elections/positions/<int:position_id>/candidates/', CandidateCreateViewSet.as_view({'post': 'create'})),
    path('api/elections/candidates/<int:candidate_id>/photo/', CandidatePhotoUploadView.as_view()),
    path('api/announcements/<int:announcement_id>/attachment/', AnnouncementAttachmentUploadView.as_view()),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
