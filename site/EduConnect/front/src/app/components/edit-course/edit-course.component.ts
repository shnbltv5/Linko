import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, catchError, tap } from 'rxjs';
import { CourseService, Category, Course } from '../../services/course.service'; // FE-1: Importing API data interfaces | FE-2: Importing service for API data access
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // FE-7: Required for async pipe/*ngIf/*ngFor | FE-4: Required for ngModel | FE-6: Required for routerLink
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'] // FE-5: Component-specific styles can be added here
})
export class EditCourseComponent implements OnInit {

  courseData = { // FE-4: Component property for [(ngModel)] form binding
    title: '',
    description: '',
    category_id: null as number | null
  };

  categories$: Observable<Category[]>; // FE-2: Observable holding API data from service
  currentCourseId: number | null = null;
  pageTitle = 'Loading course...';
  isLoading = false;
  isLoadingCourse = true;
  errorMessages: any = {};

  constructor( // FE-2: Injecting services for API data, Auth | FE-6: Injecting services for Routing
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService // FE-8: Using AuthService for JWT-related checks
  ) {
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourseData();
  }

  loadCategories(): void { // FE-2: Method calling service to fetch API data
    this.categories$ = this.courseService.getCategories().pipe( // FE-2: Calling service method
      catchError(error => {
        this.toastr.error('Failed to load categories.', 'Error');
        return of([]);
      })
    );
  }

  loadCourseData(): void { // FE-2: Method calling service to fetch existing course data | BE-7: Includes auth check for owner
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.toastr.error('Course ID not found in URL.', 'Error');
      this.router.navigate(['/courses']);
      return;
    }
    this.currentCourseId = +idParam;
    this.isLoadingCourse = true;

    this.courseService.getCourse(this.currentCourseId).subscribe({ // FE-2: Calling service method
      next: (course) => {
        if (!(this.authService.isTeacher() && this.authService.getCurrentUserId() === course.teacher?.id)) { // BE-7: Checking ownership
           this.toastr.error('You do not have permission to edit this course.', 'Access Denied');
           this.router.navigate(['/courses']); // FE-6: Programmatic navigation
           return;
        }
        this.courseData.title = course.title;
        this.courseData.description = course.description;
        this.courseData.category_id = course.category?.id ?? null;
        this.pageTitle = `Edit: ${course.title}`;
        this.isLoadingCourse = false;
      },
      error: (error) => {
        this.isLoadingCourse = false;
        console.error('Error fetching course for edit:', error);
        let errorMsg = 'Failed to load course data.';
        if (error.status === 404) { errorMsg = 'Course not found.'; }
        this.toastr.error(errorMsg, 'Error');
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit(): void { // FE-3: Method handling form submit event, calls service hitting API | FE-4: Uses data bound with [(ngModel)] | BE-7: Part of Course CRUD (Update)
    if (!this.currentCourseId) return;

    this.isLoading = true;
    this.errorMessages = {};

    if (!this.courseData.title) { }

    console.log('Updating course data:', this.courseData);

    this.courseService.updateCourse(this.currentCourseId, this.courseData).subscribe({ // FE-2: Calling service method for API PUT/PATCH request
      next: (updatedCourse) => {
        this.isLoading = false;
        this.toastr.success('Course updated successfully!');
        this.router.navigate(['/courses', this.currentCourseId]); // FE-6: Programmatic navigation
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating course:', error);
        if (error.error && typeof error.error === 'object') {
          this.errorMessages = error.error;
          let errorDetail = 'Update failed. Check fields.';
          try {
             const firstKey = Object.keys(this.errorMessages)[0];
             const firstMessage = this.errorMessages[firstKey][0];
             errorDetail = `${firstKey}: ${firstMessage}`;
          } catch (e) { }
          this.toastr.error(errorDetail, 'Validation Error');
        } else {
          this.errorMessages.general = 'An unexpected server error occurred.';
          this.toastr.error(this.errorMessages.general, 'Server Error');
        }
      }
    });
  }
}