import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // FE-6: Required for <router-outlet>
import { CommonModule } from '@angular/common'; // FE-7: Required for *ngIf/*ngFor/async pipe in template
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ // FE-7: Importing needed modules/components | FE-6: Importing RouterOutlet for routing
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // FE-5: Component-specific styles can be added here
})
export class AppComponent {

}