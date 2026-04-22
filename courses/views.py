from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from .models import Category, Course, Enrollment
from .serializers import (
    RegisterSerializer, UserSerializer, CategorySerializer,
    CourseSerializer, EnrollmentSerializer, SimpleMessageSerializer
)
from .permissions import IsTeacher, IsStudent, IsTeacherOwnerOrReadOnly, IsStudentOwnerOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

# BE-5: CBV (1/2+) | BE-6: Handles JWT Login
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# BE-5: CBV (2/2+) - Handles user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# BE-5: CBV (ViewSet) - Handles Category List/Retrieve (ReadOnly)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# BE-5: CBV (ViewSet) | BE-7: Provides Authenticated CRUD for Course model
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().select_related('teacher', 'category', 'teacher__profile')
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes_list = [permissions.AllowAny]
        elif self.action == 'create':
            permission_classes_list = [permissions.IsAuthenticated, IsTeacher]
        else:
            permission_classes_list = [permissions.IsAuthenticated, IsTeacherOwnerOrReadOnly]
        return [permission() for permission in permission_classes_list]

    def perform_create(self, serializer):
         serializer.save(teacher=self.request.user)

# BE-5: CBV | BE-7: Provides Authenticated Create/List for Enrollment model
class EnrollmentListCreateView(generics.ListCreateAPIView):
     serializer_class = EnrollmentSerializer
     permission_classes = [permissions.IsAuthenticated]

     def get_queryset(self):
         user = self.request.user
         if hasattr(user, 'profile') and user.profile.is_student:
              return Enrollment.objects.filter(student=user).select_related('student', 'course', 'course__teacher')
         return Enrollment.objects.none()

     def perform_create(self, serializer):
         if not (hasattr(self.request.user, 'profile') and self.request.user.profile.is_student):
              raise PermissionDenied("Only students can enroll in courses.")
         serializer.save(student=self.request.user)

# BE-5: CBV | BE-7: Provides Authenticated Retrieve/Delete for Enrollment model
class EnrollmentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.is_student:
             return Enrollment.objects.filter(student=user)
        return Enrollment.objects.none()

# BE-5: FBV (1/2) - Example Function-Based View
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def simple_test_view(request):
    import datetime
    data = {
        "message": f"Hello, {request.user.username}! API is working.",
        "timestamp": datetime.datetime.now()
    }
    serializer = SimpleMessageSerializer(data)
    return Response(serializer.data)

# BE-5: CBV | BE-7: Provides Authenticated Delete for Enrollment (custom unenroll)
class UnenrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, course_pk, format=None):
        student = request.user
        if not hasattr(student, 'profile') or not student.profile.is_student:
            return Response(
                {"detail": "Only students can unenroll."},
                status=status.HTTP_403_FORBIDDEN
            )
        course = get_object_or_404(Course, pk=course_pk)
        try:
            enrollment = Enrollment.objects.get(student=student, course=course)
        except Enrollment.DoesNotExist:
            return Response(
                {"detail": "You are not enrolled in this course."},
                status=status.HTTP_404_NOT_FOUND
            )
        enrollment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# BE-5: FBV (2/2+) - Example #2 Function-Based View
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated]) 
def course_count_view(request):
    try:
        count = Course.objects.count() 
        return Response({"total_courses": count}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
