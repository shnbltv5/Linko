import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // FE-7: Required for *ngIf/*ngFor | FE-6: Required for routerLink
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // FE-5: Component-specific styles can be added here
})
export class HomeComponent {

  constructor(public authService: AuthService) { } // FE-2: Injecting AuthService | FE-8: Making service public for template access for JWT state checks

}