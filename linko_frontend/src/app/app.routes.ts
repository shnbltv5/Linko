import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Step1BasicComponent } from './pages/step1-basic/step1-basic.component';
import { Step2BodyComponent } from './pages/step2-body/step2-body.component';
import { Step3StyleComponent } from './pages/step3-style/step3-style.component';
import { Step4WeatherComponent } from './pages/step4-weather/step4-weather.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';

const routes: Routes = [
  { path: '', component: Step1BasicComponent },
  { path: 'body', component: Step2BodyComponent },
  { path: 'style', component: Step3StyleComponent },
  { path: 'weather', component: Step4WeatherComponent },
  { path: 'result', component: RecommendationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}