import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { CourseService, Enrollment } from '../../services/course.service'; // FE-1: Importing API data interface | FE-2: Importing service for API data access
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink], // FE-7: Required for async pipe/*ngIf/*ngFor | FE-6: Required for routerLink
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'] // FE-5: Component-specific styles can be added here
})
export class MyCoursesComponent implements OnInit {

  enrollments$: Observable<Enrollment[]>; // FE-2: Observable holding API data from service
  errorLoading: boolean = false;

  constructor(
    private courseService: CourseService, // FE-2: Injecting service for API data access
    private toastr: ToastrService
  ) {
    this.enrollments$ = of([]);
  }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void { // FE-2: Method calling service to fetch API data | BE-7: Fetches enrollments for authenticated user
    this.errorLoading = false;
    this.enrollments$ = this.courseService.getMyEnrollments().pipe( // FE-2: Calling service method
      catchError(error => {
        console.error('Error fetching enrollments:', error);
        this.toastr.error('Failed to load your enrolled courses.', 'Error');
        this.errorLoading = true;
        return of([]);
      })
    );
  }

}