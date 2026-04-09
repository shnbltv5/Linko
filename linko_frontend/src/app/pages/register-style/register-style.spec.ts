import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStyle } from './register-style';

describe('RegisterStyle', () => {
  let component: RegisterStyle;
  let fixture: ComponentFixture<RegisterStyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStyle],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterStyle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
