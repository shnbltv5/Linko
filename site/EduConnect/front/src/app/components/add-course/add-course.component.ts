import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { CourseService, Category, Course } from '../../services/course.service'; // FE-1: Importing API data interfaces | FE-2: Importing service for API data access
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule], // FE-4: Required for ngModel | FE-7: Required for *ngIf/*ngFor
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'] // FE-5: Component-specific styles can be added here
})
export class AddCourseComponent implements OnInit {

  courseData = { // FE-4: Component property for [(ngModel)] form binding
    title: '',
    description: '',
    category_id: null as number | null
  };

  categories$: Observable<Category[]>; // FE-2: Observable holding API data from service

  isLoading = false;
  errorMessages: any = {};

  constructor(
    private courseService: CourseService, // FE-2: Injecting service for API data access
    private router: Router, // FE-6: Injecting Router for navigation
    private toastr: ToastrService
  ) {
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void { // FE-2: Method calling service to fetch API data
    this.categories$ = this.courseService.getCategories().pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        this.toastr.error('Failed to load categories.', 'Error');
        return of([]);
      })
    );
  }

  onSubmit(): void { // FE-3: Method handling form submit event, calls service hitting API | FE-4: Uses data bound with [(ngModel)]
    this.isLoading = true;
    this.errorMessages = {};

    if (!this.courseData.title) {
        this.toastr.warning('Title is required.');
        this.isLoading = false;
        return;
    }

    console.log('Submitting new course data:', this.courseData);

    this.courseService.addCourse(this.courseData).subscribe( // FE-2: Calling service method for API POST request
      (newCourse: Course) => {
        this.isLoading = false;
        console.log('Course added successfully:', newCourse);
        this.toastr.success('Course added successfully!');
        this.router.navigate(['/courses', newCourse.id]); // FE-6: Navigating after successful API call
      },
      (error) => {
        this.isLoading = false;
        console.error('Error adding course:', error);
        if (error.error && typeof error.error === 'object') {
          this.errorMessages = error.error;
          let errorDetail = 'Failed to add course. Please check the form fields.';
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
    );
  }

}