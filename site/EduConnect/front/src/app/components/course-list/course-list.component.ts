import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { CourseService, Course } from '../../services/course.service'; // FE-1: Importing API data interface | FE-2: Importing service for API data access
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule, // FE-7: Required for async pipe/*ngIf/*ngFor
    RouterLink    // FE-6: Required for routerLink
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'] // FE-5: Component-specific styles can be added here
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[]>; // FE-2: Observable holding API data from service
  errorLoading: boolean = false;

  constructor(
    private courseService: CourseService, // FE-2: Injecting service for API data access
    private toastr: ToastrService
    ) {
    this.courses$ = of([]);
   }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void { // FE-2: Method calling service to fetch API data
    this.errorLoading = false;
    this.courses$ = this.courseService.getCourses().pipe( // FE-2: Calling service method
      catchError((error: any) => {
        console.error('Error fetching courses:', error);
        this.toastr.error('Failed to load courses. Please try again later.', 'Error');
        this.errorLoading = true;
        return of([]);
      })
    );
  }
}