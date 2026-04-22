from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        # BE-6: Check for specific role (Teacher) as part of access control
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.is_teacher
        )

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        # BE-6: Check for specific role (Student) as part of access control
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.is_student
        )

class IsTeacherOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # BE-7: Custom permission checking if the authenticated request user is the teacher owner of the course object for CRUD operations
        # BE-6: Includes authentication check
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(obj, 'teacher') and
            obj.teacher == request.user and
            hasattr(request.user, 'profile') and
            request.user.profile.is_teacher
        )

class IsStudentOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # BE-7: Custom permission checking if the authenticated request user is the student owner of the enrollment object for CRUD operations
        # BE-6: Includes authentication check
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(obj, 'student') and
            obj.student == request.user and
            hasattr(request.user, 'profile') and
            request.user.profile.is_student
        )