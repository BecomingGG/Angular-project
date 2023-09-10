import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public photoURL: string = '';
  public name: string = '';
  public updated: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.fireAuthState
      .pipe(
        tap((user) => {
          this.name = user?.displayName || '';
          this.photoURL = user?.photoURL || '';
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  update() {
    this.authService.updateInfo({
      displayName: this.name,
      photoURL: this.photoURL,
    });
    this.updated = true;
  }
}
