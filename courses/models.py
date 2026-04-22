from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from pytils import translit

# BE-1: Model definition (1/4+)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile') # BE-3: OneToOne relation to User
    is_student = models.BooleanField('Is student', default=True)
    is_teacher = models.BooleanField('Is teacher', default=False)

    def __str__(self):
        role = "Student" if self.is_student else "Teacher" if self.is_teacher else "Admin"
        return f"{self.user.username} ({role})"

# BE-1: Model definition (2/4+)
class Category(models.Model):
    name = models.CharField('Category Name', max_length=100, unique=True)
    slug = models.SlugField('Slug', max_length=110, unique=True, blank=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = translit.slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# BE-1: Model definition (3/4+)
class Course(models.Model):
    category = models.ForeignKey(Category, related_name='courses', on_delete=models.SET_NULL, null=True, blank=True) # BE-3: ForeignKey relation to Category
    title = models.CharField('Title', max_length=200)
    slug = models.SlugField('Slug', max_length=210, unique=True, blank=True)
    description = models.TextField('Description', blank=True)
    teacher = models.ForeignKey( # BE-3: ForeignKey relation to User (Teacher)
        User,
        related_name='courses_taught',
        on_delete=models.CASCADE,
        limit_choices_to={'profile__is_teacher': True}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
           self.slug = translit.slugify(self.title)
        if Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
             self.slug = f"{self.slug}-{self.pk or 'new'}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

# BE-1: Model definition (4/4+)
class Enrollment(models.Model):
    student = models.ForeignKey( # BE-3: ForeignKey relation to User (Student)
        User,
        related_name='enrollments',
        on_delete=models.CASCADE,
        limit_choices_to={'profile__is_student': True}
    )
    course = models.ForeignKey( # BE-3: ForeignKey relation to Course
        Course,
        related_name='enrollments',
        on_delete=models.CASCADE
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"