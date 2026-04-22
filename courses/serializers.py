from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Category, Course, Enrollment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token

# BE-4: ModelSerializer (1/2+)
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('is_student', 'is_teacher')

# BE-4: ModelSerializer (2/2+)
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

# BE-4: Base Serializer (Token Customization)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # BE-6: Adding custom user data to JWT payload
        token['username'] = user.username
        try:
            profile = user.profile
            token['is_student'] = profile.is_student
            token['is_teacher'] = profile.is_teacher
        except AttributeError:
            token['is_student'] = False
            token['is_teacher'] = False
        return token

# BE-4: Base Serializer (User Registration - 1/2+)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm Password', style={'input_type': 'password'})
    is_student = serializers.BooleanField(write_only=True, required=False, default=True)
    is_teacher = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'is_student', 'is_teacher')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if attrs.get('is_student') and attrs.get('is_teacher'):
            raise serializers.ValidationError("User cannot be both student and teacher.")
        return attrs

    def create(self, validated_data):
        is_student = validated_data.pop('is_student', True)
        is_teacher = validated_data.pop('is_teacher', False)
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        try:
            profile = user.profile
            profile.is_student = is_student
            profile.is_teacher = is_teacher
            profile.save()
        except Profile.DoesNotExist:
            Profile.objects.create(user=user, is_student=is_student, is_teacher=is_teacher)
        return user

# BE-4: ModelSerializer (3/2+)
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')

# BE-4: ModelSerializer (4/2+)
class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(profile__is_teacher=True),
        source='teacher', write_only=True, allow_null=True, required=False
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category', write_only=True, allow_null=True, required=False
    )
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'description', 'category', 'teacher',
            'created_at', 'updated_at', 'category_id', 'teacher_id',
            'is_enrolled'
        )
        read_only_fields = ('slug', 'created_at', 'updated_at')

    def get_is_enrolled(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Enrollment.objects.filter(course=obj, student=user).exists()
        return False

# BE-4: ModelSerializer (5/2+)
class EnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'course', 'enrolled_at', 'course_id')
        read_only_fields = ('enrolled_at', 'student', 'course')

    def validate(self, attrs):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            raise serializers.ValidationError({"detail": "User not found in request context."})
        student = request.user
        course = attrs.get('course')
        if not course:
             raise serializers.ValidationError({"course_id": "Valid Course ID is required."})
        if not hasattr(student, 'profile') or not student.profile.is_student:
             raise serializers.ValidationError({"detail": "User is not a student."})
        if Enrollment.objects.filter(student=student, course=course).exists():
             raise serializers.ValidationError({"non_field_errors": ["Already enrolled in this course."]})
        return attrs

# BE-4: Base Serializer (2/2+)
class SimpleMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)