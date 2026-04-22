import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router'; // FE-6: Imports for routing functionality
import { AuthService } from '../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation
import { ToastrService } from 'ngx-toastr';

// FE-6: Route Guard definition | FE-8: Part of JWT Auth flow
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // FE-2: Injecting AuthService | FE-8: Using service for JWT state checks
  const router = inject(Router); // FE-6: Injecting Router for navigation
  const toastr = inject(ToastrService);

  const expectedRole = route.data['role'] as 'student' | 'teacher' | undefined;
  const isLoggedIn = authService.isLoggedIn(); // FE-8: Checking JWT login status

  if (!isLoggedIn) {
    console.log('AuthGuard: User not logged in, redirecting to login.');
    toastr.info('Please log in to access this page.', 'Authentication Required');
    router.navigate(['/login']); // FE-6: Redirecting using Router if check fails | FE-8: Part of JWT Auth flow
    return false;
  }

  if (expectedRole) {
    let hasRequiredRole = false;
    if (expectedRole === 'student' && authService.isStudent()) { // FE-8: Checking user role based on JWT data
      hasRequiredRole = true;
    } else if (expectedRole === 'teacher' && authService.isTeacher()) { // FE-8: Checking user role based on JWT data
      hasRequiredRole = true;
    }

    if (hasRequiredRole) {
      console.log(`AuthGuard: Access granted for role '${expectedRole}'.`);
      return true;
    } else {
      console.log(`AuthGuard: User does not have required role '${expectedRole}', redirecting.`);
      toastr.warning('You do not have permission to access this page.', 'Access Denied');
      router.navigate(['/home']); // FE-6: Redirecting using Router if check fails | FE-8: Part of JWT Auth flow
      return false;
    }
  } else {
    console.log('AuthGuard: Access granted (login required, no specific role).');
    return true;
  }
};