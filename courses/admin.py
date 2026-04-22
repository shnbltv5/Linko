from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Category, Course, Enrollment

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profiles'
    fk_name = 'user'

class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_is_student', 'get_is_teacher')
    list_select_related = ('profile',)

    @admin.display(boolean=True, description='Is Student?')
    def get_is_student(self, instance):
        return getattr(instance, 'profile', None) and instance.profile.is_student

    @admin.display(boolean=True, description='Is Teacher?')
    def get_is_teacher(self, instance):
         return getattr(instance, 'profile', None) and instance.profile.is_teacher

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'category', 'created_at', 'updated_at')
    list_filter = ('category', 'teacher', 'created_at')
    search_fields = ('title', 'description', 'teacher__username')
    prepopulated_fields = {'slug': ('title',)}
    list_select_related = ('teacher', 'category', 'teacher__profile')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('course', 'enrolled_at')
    search_fields = ('student__username', 'course__title')
    autocomplete_fields = ('student', 'course')
    list_select_related = ('student', 'course')