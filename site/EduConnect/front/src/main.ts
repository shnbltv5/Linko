import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // FE-6: Importing function for routing setup
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // FE-2: Importing function for HttpClient setup | FE-8: Importing function for interceptor setup
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // FE-6: Importing route definitions
import { authInterceptor } from './app/interceptors/auth.interceptor'; // FE-8: Importing JWT interceptor function

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // FE-6: Providing application routes
    provideHttpClient(withInterceptors([ // FE-2: Providing HttpClient | FE-8: Registering JWT interceptor
      authInterceptor
    ])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ]
})
  .catch(err => console.error(err));