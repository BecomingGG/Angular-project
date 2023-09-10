import { Component, OnInit } from '@angular/core';
import { AlertService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  ngOnInit(): void {}

  email: string = '';
  password: string = '';
  authed: boolean = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  login() {
    if (this.email && this.password) {
      this.authed = true;
      this.authService.login(this.email, this.password);
    } else {
      this.alertService.displayToast('Fill every input', 'error', 'red');
    }
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }
}
