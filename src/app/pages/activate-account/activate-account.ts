import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { CodeInputModule } from 'angular-code-input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule, RouterModule, CodeInputModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css',
})
export class ActivateAccount {

  message = '';
  isOkay = true;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  private confirmAccount(token: string) {
    this.authService.confirm({token}).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to the login page.'
        this.submitted = true;
      },
      error: () => {
        this.message = 'Token expired or invalid'
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['signin']);
  }
}
