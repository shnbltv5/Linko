import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap, catchError, of, tap } from 'rxjs';
import { CourseService, Course } from '../../services/course.service'; // FE-1: Importing API data interface | FE-2: Importing service for API data access
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [ CommonModule, RouterLink ], // FE-7: Required for async pipe/*ngIf | FE-6: Required for routerLink
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'] // FE-5: Component-specific styles can be added here
})
export class CourseDetailComponent implements OnInit {
  course$: Observable<Course | null>; // FE-2: Observable holding API data
  currentCourse: Course | null = null;
  errorLoading: boolean = false;
  isEnrolling: boolean = false;
  isUnenrolling: boolean = false;
  isEnrolled: boolean = false;
  isDeleting: boolean = false;
  currentCourseId: number | null = null;

  constructor( // FE-2: Injecting services for API data, Auth | FE-6: Injecting services for Routing
    private route: ActivatedRoute,
    private courseService: CourseService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService // FE-8: Using AuthService for JWT-related checks
  ) {
    this.course$ = of(null);
  }

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse(): void { // FE-2: Method calling service to fetch API data
    this.errorLoading = false;
    this.isEnrolled = false;
    this.currentCourse = null;
    this.course$ = this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.currentCourseId = +idParam;
          return this.courseService.getCourse(this.currentCourseId).pipe( // FE-2: Calling service method
             tap(course => {
               if (course) {
                 this.isEnrolled = course.is_enrolled ?? false;
                 this.currentCourse = course;
                 console.log('Course loaded:', this.currentCourse);
                 console.log('Enrolled status:', this.isEnrolled);
               } else {
                 this.currentCourse = null;
               }
             }),
            catchError(error => {
              console.error('Error fetching course details:', error);
              this.errorLoading = true;
              this.currentCourse = null;
              let errorMsg = 'Failed to load course details.';
              if (error.status === 404) { errorMsg = 'Course not found.'; }
              this.toastr.error(errorMsg, 'Error');
              return of(null);
            })
          );
        } else {
          this.errorLoading = true;
          this.currentCourse = null;
          this.toastr.error('Course ID is missing.', 'Error');
          return of(null);
        }
      })
    );
  }

  goBack(): void { this.router.navigate(['/courses']); } // FE-6: Programmatic navigation

  enroll(): void { // FE-3: Method handling Enroll button click, calls service hitting API | BE-7: Part of Enrollment CRUD
    if (!this.currentCourseId || this.isEnrolled) return;
    if (!this.authService.isStudent()) { this.toastr.warning('Only students can enroll.'); return; }
    this.isEnrolling = true;
    this.courseService.enroll(this.currentCourseId).subscribe({ // FE-2: Calling service method
      next: (response) => { this.isEnrolling = false; this.isEnrolled = true; this.toastr.success('Successfully enrolled!'); },
      error: (error) => { this.isEnrolling = false; this.toastr.error('Enrollment failed.', 'Error'); }
    });
   }

  unenroll(): void { // FE-3: Method handling Unenroll button click, calls service hitting API | BE-7: Part of Enrollment CRUD
    if (!this.currentCourseId || !this.isEnrolled) return;
    if (!this.authService.isStudent()) { this.toastr.warning('Only students can unenroll.'); return; }
    this.isUnenrolling = true;
    this.courseService.unenroll(this.currentCourseId).subscribe({ // FE-2: Calling service method
       next: () => { this.isUnenrolling = false; this.isEnrolled = false; this.toastr.success('Successfully unenrolled.'); },
       error: (error) => { this.isUnenrolling = false; this.toastr.error('Unenrollment failed.', 'Error'); }
    });
  }

  deleteCourse(): void { // FE-3: Method handling Delete button click, calls service hitting API | BE-7: Part of Course CRUD
    if (!this.currentCourseId) { this.toastr.error('Cannot delete without course ID.', 'Error'); return; }
    if (!(this.authService.isTeacher() && this.authService.getCurrentUserId() === this.currentCourse?.teacher?.id)) { this.toastr.error('You do not have permission to delete this course.', 'Error'); return; }

    if (confirm(`Are you sure you want to delete the course "${this.currentCourse?.title}"? This action cannot be undone.`)) {
      this.isDeleting = true;
      this.courseService.deleteCourse(this.currentCourseId).subscribe({ // FE-2: Calling service method
        next: () => {
          this.isDeleting = false;
          this.toastr.success('Course deleted successfully.');
          this.router.navigate(['/courses']); // FE-6: Programmatic navigation
        },
        error: (error) => {
          this.isDeleting = false;
          console.error('Error deleting course:', error);
          let errorMsg = 'Failed to delete course.';
          if (error.status === 403) { errorMsg = 'You do not have permission to delete this course.'; }
          else if (error.status === 404) { errorMsg = 'Course not found.'; }
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

}