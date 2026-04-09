import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Step1BasicComponent } from './pages/step1-basic/step1-basic.component';
import { Step2BodyComponent } from './pages/step2-body/step2-body.component';
import { Step3StyleComponent } from './pages/step3-style/step3-style.component';
import { Step4WeatherComponent } from './pages/step4-weather/step4-weather.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';

@NgModule({
  declarations: [
    AppComponent,
    Step1BasicComponent,
    Step2BodyComponent,
    Step3StyleComponent,
    Step4WeatherComponent,
    RecommendationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }