import os
from datetime import datetime, timezone as datetime_timezone
from uuid import uuid4

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction, models
from django.db.models import Count
from django.utils import timezone

from amis_app.models import (
    Role, Student, Course, Registration, 
    ResultRecord, Payment, Accommodation, Election, ElectionPosition, Candidate, Vote, Announcement
)
from amis_app.serializers import (
    UserSerializer, RoleSerializer, StudentSerializer, CourseSerializer,
    RegistrationSerializer, ResultRecordSerializer, PaymentSerializer, 
    AccommodationSerializer, AnnouncementSerializer
)


def parse_election_datetime(value):
    # datetime-local inputs send local wall-clock without a zone; naive.astimezone()
    # attaches the server's local timezone so voting opens/closes when the admin intended.
    parsed = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        parsed = parsed.astimezone()
    return parsed.astimezone(datetime_timezone.utc)


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))


class IsStudentUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and not (request.user.is_staff or request.user.is_superuser))


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
            'role': 'ADMIN' if (user.is_staff or user.is_superuser) else 'STUDENT',
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


def election_view(election, voter=None):
    voted_position_ids = set()
    if voter:
        voted_position_ids = set(Vote.objects.filter(election=election, voter=voter).values_list('position_id', flat=True))
    return {
        'id': election.id,
        'title': election.title,
        'description': election.description,
        'startsAt': election.starts_at,
        'endsAt': election.ends_at,
        'active': election.active,
        'closed': election.closed,
        'positions': [{
            'id': position.id,
            'name': position.name,
            'displayOrder': position.display_order,
            'voted': position.id in voted_position_ids,
            'candidates': [{
                'id': candidate.id,
                'name': candidate.name,
                'manifesto': candidate.manifesto,
                'photoUrl': candidate.photo_url or '',
                'votes': 0,
                'percentage': 0,
                'voted': False,
            } for candidate in position.candidates.all()],
        } for position in election.positions.all()],
    }


class ElectionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        elections = Election.objects.prefetch_related('positions__candidates').all()
        return Response([election_view(election, request.user) for election in elections])

    def create(self, request):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        starts_at, ends_at = request.data.get('startsAt'), request.data.get('endsAt')
        if not request.data.get('title') or not starts_at or not ends_at:
            return Response({'detail': 'Title, start time, and end time are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            starts_dt = parse_election_datetime(starts_at)
            ends_dt = parse_election_datetime(ends_at)
        except ValueError:
            return Response({'detail': 'Invalid start or end time.'}, status=status.HTTP_400_BAD_REQUEST)
        election = Election(title=request.data['title'].strip(), description=request.data.get('description', ''), starts_at=starts_dt, ends_at=ends_dt)
        if election.ends_at <= election.starts_at:
            return Response({'detail': 'End time must be after start time.'}, status=status.HTTP_400_BAD_REQUEST)
        election.save()
        return Response(election_view(election), status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='positions')
    def positions(self, request, pk=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        election = Election.objects.filter(pk=pk).first()
        if not election:
            return Response({'detail': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
        if election.active or election.closed:
            return Response({'detail': 'A live or closed election cannot be changed.'}, status=status.HTTP_409_CONFLICT)
        name = str(request.data.get('name', '')).strip()
        if not name:
            return Response({'detail': 'Position name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if election.positions.filter(name__iexact=name).exists():
            return Response({'detail': f'Position "{name}" already exists in this election.'}, status=status.HTTP_409_CONFLICT)
        position = ElectionPosition.objects.create(election=election, name=name, display_order=request.data.get('displayOrder', election.positions.count() + 1))
        return Response({'id': position.id, 'name': position.name, 'displayOrder': position.display_order, 'candidates': [], 'voted': False}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='status')
    def status_update(self, request, pk=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        election = Election.objects.prefetch_related('positions__candidates').filter(pk=pk).first()
        if not election:
            return Response({'detail': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
        closed = bool(request.data.get('closed', False))
        active = bool(request.data.get('active', False))
        if closed:
            election.closed, election.active = True, False
        elif active:
            if not election.positions.exists() or any(not position.candidates.exists() for position in election.positions.all()):
                return Response({'detail': 'Add positions and candidates before activating the election.'}, status=status.HTTP_409_CONFLICT)
            election.active = True
        else:
            election.active = False
        election.save()
        return Response(election_view(election))

    @action(detail=True, methods=['post'], url_path='votes')
    def vote(self, request, pk=None):
        if not IsStudentUser().has_permission(request, self):
            return Response({'detail': 'Only students can vote.'}, status=status.HTTP_403_FORBIDDEN)
        election = Election.objects.filter(pk=pk).first()
        candidate = Candidate.objects.select_related('position__election').filter(pk=request.data.get('candidateId')).first()
        if not election or not candidate or candidate.position.election_id != election.id:
            return Response({'detail': 'Candidate was not found in this election.'}, status=status.HTTP_400_BAD_REQUEST)
        now = timezone.now()
        if not election.active or election.closed or now < election.starts_at or now > election.ends_at:
            return Response({'detail': 'This election is not accepting votes.'}, status=status.HTTP_409_CONFLICT)
        try:
            with transaction.atomic():
                Vote.objects.create(voter=request.user, election=election, position=candidate.position, candidate=candidate)
        except IntegrityError:
            return Response({'detail': 'You have already voted for this position.'}, status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='results')
    def results(self, request, pk=None):
        election = Election.objects.prefetch_related('positions__candidates').filter(pk=pk).first()
        if not election:
            return Response({'detail': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
        counts = dict(Vote.objects.filter(election=election).values('candidate_id').annotate(total=Count('id')).values_list('candidate_id', 'total'))
        positions = []
        for position in election.positions.all():
            candidates = sorted([{'id': candidate.id, 'name': candidate.name, 'manifesto': candidate.manifesto, 'photoUrl': candidate.photo_url or '', 'votes': counts.get(candidate.id, 0), 'percentage': 0, 'voted': False} for candidate in position.candidates.all()], key=lambda item: item['votes'], reverse=True)
            total_votes = sum(item['votes'] for item in candidates)
            for item in candidates:
                item['percentage'] = (item['votes'] * 100 / total_votes) if total_votes else 0
            positions.append({'position': position.name, 'totalVotes': total_votes, 'winner': candidates[0] if candidates else None, 'candidates': candidates})
        return Response({'electionId': election.id, 'title': election.title, 'positions': positions})


class CandidateCreateViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, position_id=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        position = ElectionPosition.objects.select_related('election').filter(pk=position_id).first()
        if not position:
            return Response({'detail': 'Position not found.'}, status=status.HTTP_404_NOT_FOUND)
        if position.election.active or position.election.closed:
            return Response({'detail': 'A live or closed election cannot be changed.'}, status=status.HTTP_409_CONFLICT)
        name = str(request.data.get('name', '')).strip()
        if not name:
            return Response({'detail': 'Candidate name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        candidate = Candidate.objects.create(position=position, name=name, manifesto=request.data.get('manifesto', ''))
        return Response({'id': candidate.id, 'name': candidate.name, 'manifesto': candidate.manifesto, 'photoUrl': '', 'votes': 0, 'percentage': 0, 'voted': False}, status=status.HTTP_201_CREATED)


class CandidatePhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, candidate_id=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        candidate = Candidate.objects.filter(pk=candidate_id).first()
        if not candidate:
            return Response({'detail': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        photo = request.FILES.get('photo')
        if not photo:
            return Response({'detail': 'Photo file is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not photo.content_type.startswith('image/'):
            return Response({'detail': 'Only image files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
        directory = settings.MEDIA_ROOT / 'candidates'
        directory.mkdir(parents=True, exist_ok=True)
        extension = os.path.splitext(photo.name)[1].lower() or '.png'
        filename = f'{uuid4().hex}{extension}'
        with open(directory / filename, 'wb') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)
        candidate.photo_url = f'{settings.MEDIA_URL}candidates/{filename}'
        candidate.save(update_fields=['photo_url'])
        return Response({'id': candidate.id, 'name': candidate.name, 'manifesto': candidate.manifesto, 'photoUrl': candidate.photo_url, 'votes': 0, 'percentage': 0, 'voted': False})


ATTACHMENT_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip'}


class AnnouncementAttachmentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, announcement_id=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        announcement = Announcement.objects.filter(pk=announcement_id).first()
        if not announcement:
            return Response({'detail': 'Announcement not found.'}, status=status.HTTP_404_NOT_FOUND)
        attachment = request.FILES.get('attachment')
        if not attachment:
            return Response({'detail': 'Attachment file is required.'}, status=status.HTTP_400_BAD_REQUEST)
        extension = os.path.splitext(attachment.name)[1].lower()
        if extension not in ATTACHMENT_EXTENSIONS:
            return Response({'detail': 'File type is not allowed.'}, status=status.HTTP_400_BAD_REQUEST)
        directory = settings.MEDIA_ROOT / 'announcements'
        directory.mkdir(parents=True, exist_ok=True)
        filename = f'{uuid4().hex}{extension}'
        with open(directory / filename, 'wb') as destination:
            for chunk in attachment.chunks():
                destination.write(chunk)
        announcement.attachment_url = f'{settings.MEDIA_URL}announcements/{filename}'
        announcement.save(update_fields=['attachment_url'])
        return Response({'id': announcement.id, 'attachmentUrl': announcement.attachment_url})


class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]
    queryset = Announcement.objects.all()

    def list(self, request):
        now = timezone.now()
        items = self.get_queryset().filter(published=True, publish_at__lte=now).filter(models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=now))
        return Response(self.get_serializer(items, many=True).data)

    def create(self, request, *args, **kwargs):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author_username=request.user.username)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='manage')
    def manage(self, request):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(self.get_serializer(self.get_queryset(), many=True).data)

    @action(detail=True, methods=['patch'], url_path='published')
    def set_published(self, request, pk=None):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        item = self.get_object()
        item.published = bool(request.data.get('published'))
        item.save(update_fields=['published'])
        return Response(self.get_serializer(item).data)

    def destroy(self, request, *args, **kwargs):
        if not IsAdminUser().has_permission(request, self):
            return Response({'detail': 'Administrator access is required.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
