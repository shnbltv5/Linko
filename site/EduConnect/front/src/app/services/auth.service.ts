import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

// FE-1: Interface for JWT token payload
interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
  is_student?: boolean;
  is_teacher?: boolean;
}

@Injectable({
  providedIn: 'root'
})
// FE-2: Service for Authentication and API data | FE-8: Implements JWT Auth logic
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInStatus.asObservable();

  private currentUser = new BehaviorSubject<DecodedToken | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor( // FE-2: Injecting HttpClient for API calls | FE-6: Injecting Router for navigation
    private http: HttpClient,
    private router: Router
    ) {
      this.decodeTokenAndUpdateSubjects();
    }

  register(userData: any): Observable<any> { // FE-2: Method for registration API call | FE-3: Hits API
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(credentials: any): Observable<any> { // FE-2: Method for login API call | FE-3: Hits API | FE-8: Handles JWT token login/storage
    return this.http.post<any>(`${this.apiUrl}/token/`, credentials)
      .pipe(
        tap(response => {
          if (response && response.access && response.refresh) {
            this.storeTokens(response.access, response.refresh); // FE-8: Storing JWT tokens
            this.decodeTokenAndUpdateSubjects();
            console.log('Tokens stored and user status updated');
          } else {
             console.error('Login response did not contain tokens:', response);
          }
        })
      );
  }

  logout(): void { // FE-6: Programmatic navigation | FE-8: Implements Logout functionality (clears tokens)
    this.removeTokens(); // FE-8: Clearing JWT tokens
    this.loggedInStatus.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']); // FE-6: Programmatic navigation
    console.log('Logged out, tokens removed, user status cleared');
  }

  private decodeTokenAndUpdateSubjects(): void { // FE-8: Part of JWT token handling
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token); // FE-8: Decodes JWT token
        console.log('AuthService: Decoded JWT Payload:', decoded);
        if (decoded.exp * 1000 > Date.now()) {
          this.currentUser.next(decoded);
          this.loggedInStatus.next(true);
        } else {
          console.log('AuthService: Token expired');
          this.removeTokens();
          this.currentUser.next(null);
          this.loggedInStatus.next(false);
        }
      } catch (error) {
        console.error("AuthService: Error decoding token", error);
        this.removeTokens();
        this.currentUser.next(null);
        this.loggedInStatus.next(false);
      }
    } else {
      this.currentUser.next(null);
      this.loggedInStatus.next(false);
    }
  }

  // FE-8: Helper methods for JWT token storage
  private storeTokens(accessToken: string, refreshToken: string): void { localStorage.setItem('access_token', accessToken); localStorage.setItem('refresh_token', refreshToken); }
  private removeTokens(): void { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); }
  getAccessToken(): string | null { return localStorage.getItem('access_token'); }
  getRefreshToken(): string | null { return localStorage.getItem('refresh_token'); }
  private hasToken(): boolean { return !!this.getAccessToken(); }

  // FE-8: Methods providing state based on JWT
  isLoggedIn(): boolean { return this.loggedInStatus.value; }
  isStudent(): boolean { return this.currentUser.value?.is_student ?? false; }
  isTeacher(): boolean { return this.currentUser.value?.is_teacher ?? false; }
  getCurrentUserId(): number | null { return this.currentUser.value?.user_id ?? null; }
  getCurrentUsername(): string | null { return this.currentUser.value?.username ?? null; }

}