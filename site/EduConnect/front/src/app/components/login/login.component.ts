import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router'; // FE-6: Router imports

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // FE-7: Required for *ngIf | FE-4: Required for ngModel | FE-6: Required for routerLink
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // FE-5: Component-specific styles can be added here
})
// FE-8: Login Component definition
export class LoginComponent {
  credentials = { // FE-4: Component property for [(ngModel)] form binding
    username: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor( // FE-2: Injecting AuthService | FE-6: Injecting Router
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit(): void { // FE-3: Method handling form submit event, calls service hitting API | FE-4: Uses data bound with [(ngModel)] | FE-8: Implements Login logic
    if (!this.credentials.username || !this.credentials.password) {
      this.toastr.warning('Please fill in both username and password.');
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Attempting login with:', this.credentials);
    this.authService.login(this.credentials).subscribe( // FE-2: Calling service method for API POST request
      (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        this.toastr.success('Login successful!');
        this.router.navigate(['/home']); // FE-6: Programmatic navigation on success
      },
      (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        if (error.error && error.error.detail) {
          this.errorMessage = error.error.detail;
        } else if (error.status === 0) {
          this.errorMessage = 'Could not connect to server. Please try again later.';
        } else {
          this.errorMessage = `An error occurred (Status: ${error.status}). Please try again.`;
        }
        this.toastr.error(this.errorMessage, 'Login Failed');
      }
    );
  }
}