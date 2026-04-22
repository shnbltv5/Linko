import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // FE-2: Importing service for Auth state | FE-8: Part of JWT Auth implementation

// FE-8: JWT Login Interceptor definition
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // FE-2: Injecting AuthService | FE-8: Using service for JWT token access
  const token = authService.getAccessToken(); // FE-8: Retrieving JWT access token

  const apiUrl = 'http://127.0.0.1:8000/api';

  if (token && req.url.startsWith(apiUrl)) {
    const clonedReq = req.clone({ // FE-8: Cloning request and adding JWT Authorization header
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor: Adding token to request for', req.url);
    return next(clonedReq);
  } else {
    return next(req);
  }
};