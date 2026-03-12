import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSetup } from './email-setup';

describe('EmailSetup', () => {
  let component: EmailSetup;
  let fixture: ComponentFixture<EmailSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
