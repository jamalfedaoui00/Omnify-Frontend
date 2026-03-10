import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RegistrationRequest } from '../../services/models';
import { AuthenticationService } from '../../services/services';
// import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  loading = false;
  errors: any = {};
  generalError = '';
  showPassword = false;
  showConfirm = false;

  registerRequest: RegistrationRequest = { email: '', firstname: '', lastname: '', password: '' };
  errorMessage: Array<string> = [];

  // inject ChangeDetectorRef
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }


  // validate(): boolean {
  //   this.errors = {};
  //   if (!this.firstName.trim())
  //     this.errors.firstName = 'First name is required';
  //   if (!this.lastName.trim())
  //     this.errors.lastName = 'Last name is required';
  //   if (!this.email.trim())
  //     this.errors.email = 'Email is required';
  //   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
  //     this.errors.email = 'Enter a valid email address';
  //   if (!this.password)
  //     this.errors.password = 'Password is required';
  //   else if (this.password.length < 8)
  //     this.errors.password = 'Password must be at least 8 characters';
  //   if (!this.confirmPassword)
  //     this.errors.confirmPassword = 'Please confirm your password';
  //   else if (this.password !== this.confirmPassword)
  //     this.errors.confirmPassword = 'Passwords do not match';
  //   if (this.phoneNumber && !/^\+?[\d\s\-()]{7,15}$/.test(this.phoneNumber))
  //     this.errors.phoneNumber = 'Enter a valid phone number';
  //   return Object.keys(this.errors).length === 0;
  // }

  hideShowPassword(buttonClicked: string) {
    if (buttonClicked === 'showPassword')
      this.showPassword = !this.showPassword;
    if (buttonClicked === 'showConfirm')
      this.showConfirm = !this.showConfirm;
  }

  register() {
    this.errorMessage = [];
    this.authService.register({
      body: this.registerRequest
    }).subscribe({
      next: () => {
        this.router.navigate(['activate-account']);
      },
      error: (err) => {
        if (err.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const errorBody = JSON.parse(reader.result as string);
            this.zone.run(() => {
              if (errorBody.validationErrors) {
                this.errorMessage = errorBody.validationErrors;
              } else {
                this.errorMessage.push(errorBody.error);
              }
              this.cdr.detectChanges();
            });
          };
          reader.readAsText(err.error);
        }
      }
    })
  }

  login() {
    this.router.navigate(['signin']);
  }

  // onSignup() {
  //   if (!this.validate()) return;

  //   this.loading = true;
  //   this.generalError = '';

  //   this.authService.signup({
  //     firstName:   this.firstName,
  //     lastName:    this.lastName,
  //     email:       this.email,
  //     password:    this.password,
  //     phoneNumber: this.phoneNumber
  //   }).subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.cdr.detectChanges(); // trigger re-render on success
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (err: Error) => {
  //       this.loading = false;
  //       this.generalError = err.message;
  //       this.cdr.detectChanges(); // force Angular to re-render and show the error
  //     }
  //   });
  // }
}