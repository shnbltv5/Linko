import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // FE-6: Router imports
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, // FE-7: Required for *ngIf
    FormsModule, // FE-4: Required for ngModel
    RouterLink // FE-6: Required for routerLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // FE-5: Component-specific styles can be added here
})
export class RegisterComponent {
  userData = { // FE-4: Component property for [(ngModel)] form binding
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  };
  role: 'student' | 'teacher' = 'student'; // FE-4: Component property for [(ngModel)] form binding
  isLoading = false;
  errorMessages: any = {};

  constructor( // FE-2: Injecting AuthService | FE-6: Injecting Router
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit(): void { // FE-3: Method handling form submit event, calls service hitting API | FE-4: Uses data bound with [(ngModel)]
    this.isLoading = true;
    this.errorMessages = {};

    if (this.userData.password !== this.userData.password2) {
      this.errorMessages.password2 = ['Passwords do not match.'];
      this.toastr.error('Passwords do not match.');
      this.isLoading = false;
      return;
    }

    const registrationData = {
      ...this.userData,
      is_student: this.role === 'student',
      is_teacher: this.role === 'teacher'
    };

    console.log('Attempting registration with:', registrationData);

    this.authService.register(registrationData).subscribe( // FE-2: Calling service method for API POST request
      (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        this.toastr.success('Registration successful! Please log in.');
        this.router.navigate(['/login']); // FE-6: Programmatic navigation on success
      },
      (error) => {
        this.isLoading = false;
        console.error('Registration failed:', error);
        if (error.error && typeof error.error === 'object') {
          this.errorMessages = error.error;
          let combinedErrorMessage = 'Registration failed. Please check the form fields.';
          try {
             const firstKey = Object.keys(this.errorMessages)[0];
             const firstMessage = this.errorMessages[firstKey][0];
             combinedErrorMessage = `${firstKey}: ${firstMessage}`;
          } catch (e) { }
           this.toastr.error(combinedErrorMessage, 'Registration Failed');
        } else {
          this.errorMessages.general = ['An unexpected error occurred. Please try again.'];
          this.toastr.error(this.errorMessages.general[0], 'Registration Failed');
        }
      }
    );
  }
}