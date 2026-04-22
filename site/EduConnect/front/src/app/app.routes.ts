import { Routes } from '@angular/router'; // FE-6: Importing routing functionality

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { authGuard } from './guards/auth.guard'; // FE-6: Importing route guard | FE-8: Part of JWT Auth flow

// FE-6: Route definitions array
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // FE-6: Defining path-to-component mapping
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent }, // FE-6: Defining path-to-component mapping
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CourseListComponent }, // FE-6: Defining path-to-component mapping
  { path: 'courses/:id', component: CourseDetailComponent },
  { // FE-6: Using route guard for protected route | FE-8: Role-based access
    path: 'add-course',
    component: AddCourseComponent,
    canActivate: [authGuard],
    data: { role: 'teacher' }
  },
  { // FE-6: Using route guard for protected route | FE-8: Role-based access
    path: 'my-courses',
    component: MyCoursesComponent,
    canActivate: [authGuard],
    data: { role: 'student' }
  },
  { // FE-6: Using route guard for protected route | FE-8: Role-based access
    path: 'courses/edit/:id',
    component: EditCourseComponent,
    canActivate: [authGuard],
    data: { role: 'teacher' }
  },
  { path: '**', component: NotFoundComponent }
];