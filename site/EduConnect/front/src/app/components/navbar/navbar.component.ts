import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // FE-6: Required for routerLink directives
import { CommonModule } from '@angular/common'; // FE-7: Required for async pipe/*ngIf
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, // FE-7: Required for async pipe/*ngIf
    RouterLink, // FE-6: Required for routerLink directives
    RouterLinkActive // FE-6: Required for routerLink directives
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // FE-5: Component-specific styles can be added here
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>; // FE-2: Observable holding Auth state from service | FE-8: Part of JWT Auth implementation
  username$: Observable<string | null>; // FE-2: Observable holding Auth state from service | FE-8: Part of JWT Auth implementation

  constructor(public authService: AuthService) { // FE-2: Injecting AuthService | FE-8: Making service public for template access & JWT state checks
    this.isLoggedIn$ = this.authService.loggedIn$;
    this.username$ = this.authService.currentUser$.pipe(
      map(user => user ? user.username : null)
    );
  }

  ngOnInit(): void {
  }

  logout(): void { // FE-3: Method handling logout click, calls service | FE-8: Implements Logout functionality
    this.authService.logout(); // FE-2: Calling service method
  }
}