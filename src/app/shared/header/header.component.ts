import { Component, OnInit } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { AuthService } from 'src/app/services';
import firebase from 'firebase/compat/app';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserRoleEnum } from 'src/app/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isAuthed: boolean = false;
  public isAdmin: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  public fireAuthState = this.authService.fireAuthState;

  ngOnInit(): void {
    this.authService.userStateStream$
      .pipe(
        tap((fullUser) => {
          this.isAuthed = fullUser.user ? true : false;
          this.isAdmin = fullUser.additionalInfo?.role === UserRoleEnum.Admin;
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
