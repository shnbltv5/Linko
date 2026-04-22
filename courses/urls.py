from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'courses', views.CourseViewSet, basename='course')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('enrollments/', views.EnrollmentListCreateView.as_view(), name='enrollment-list-create'),
    path('enrollments/<int:pk>/', views.EnrollmentDetailView.as_view(), name='enrollment-detail'),
    path('test-fbv/', views.simple_test_view, name='test-fbv'), # BE-5: URL mapping for the required Function-Based View (FBV)
    path('courses/<int:course_pk>/unenroll/', views.UnenrollView.as_view(), name='course-unenroll'),
    path('course-count/', views.course_count_view, name='course-count'), # BE-5: URL mapping for the required Function-Based View (FBV 2/2+)
    path('', include(router.urls)),
]