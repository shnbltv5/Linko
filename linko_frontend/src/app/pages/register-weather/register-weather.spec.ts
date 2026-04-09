import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWeather } from './register-weather';

describe('RegisterWeather', () => {
  let component: RegisterWeather;
  let fixture: ComponentFixture<RegisterWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWeather],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
