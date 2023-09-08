import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isAuthed: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  public fireAuthState = this.authService.fireAuthState;

  ngOnInit(): void {
    this.authService.fireAuthState
      .pipe(
        tap((user) => {
          this.isAuthed = user ? true : false;
          this.fireAuthState = this.authService.fireAuthState;
        })
      )
      .subscribe();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  logOut() {
    this.authService.logOut();
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
