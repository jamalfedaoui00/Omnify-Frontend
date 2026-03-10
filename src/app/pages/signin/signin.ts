import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from "@angular/router";
import { AuthenticationRequest } from '../../services/models';
import { AuthenticationService } from '../../services/services/authentication.service';
import { NgZone } from '@angular/core';
import { Token } from '../../services/token/token';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {

  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMessage: Array<string> = [];

  loading = false;
  errors: any = {};
  showPassword = false;
  generalError = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private tokenService: Token
  ) { }

  register(): void {
    this.router.navigate(['/signup']);
  }

  hideShowPassword(buttonClicked: string) {
    if (buttonClicked === 'showPassword')
      this.showPassword = !this.showPassword;
  }

  signin() {
    this.errorMessage = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        if (res instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const body = JSON.parse(reader.result as string);
            this.zone.run(() => {
              this.tokenService.token = body.token;
              this.cdr.detectChanges();
            });
          };
          this.router.navigate(['dashboard']);
          reader.readAsText(res);
        } else {
          this.tokenService.token = res.token as string;
          this.router.navigate(['dashboard']);
        }
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
        } else {
          if (err.error.validationErrors) {
            this.errorMessage = err.error.validationErrors;
            this.cdr.detectChanges();
          } else {
            this.errorMessage.push(err.error.error);
            this.cdr.detectChanges();
          }
        }
      }
    })
  }


}
