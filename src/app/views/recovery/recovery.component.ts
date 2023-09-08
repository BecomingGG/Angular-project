import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent {
  email: string = '';
  recoveried: boolean = false;
  constructor(private authService: AuthService) {}
  recovery() {
    this.authService.forgotPassword(this.email);
    this.recoveried = true;
  }
}
