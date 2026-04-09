import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterName } from './register-name';

describe('RegisterName', () => {
  let component: RegisterName;
  let fixture: ComponentFixture<RegisterName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterName],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
