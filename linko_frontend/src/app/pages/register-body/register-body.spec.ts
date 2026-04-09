import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBody } from './register-body';

describe('RegisterBody', () => {
  let component: RegisterBody;
  let fixture: ComponentFixture<RegisterBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBody],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterBody);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
