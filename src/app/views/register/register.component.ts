import { Component } from '@angular/core';

import { AlertService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registered: boolean = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  register() {
    if (this.email && this.password && this.confirmPassword) {
      if (this.password === this.confirmPassword) {
        this.registered = true;
        setTimeout(() => {
          this.registered = false;
        }, 1500);
        this.authService.register(
          this.email,
          this.password,
          this.confirmPassword
        );
      } else {
        this.alertService.displayToast('Password must match', 'error', 'red');
      }
    } else {
      this.alertService.displayToast('fill every input', 'error', 'red');
    }
  }
  signInWithGoogle() {
    this.authService.googleSignIn();
  }
}
