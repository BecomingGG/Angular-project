import {
  AlertService,
  AuthService,
  PostService,
  UserService,
} from 'src/app/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserRoleEnum } from 'src/app/enums';
import { Router } from '@angular/router';
import { AdditionalInfoUser, PostInterface } from 'src/app/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public users: AdditionalInfoUser[] = [];
  public posts: PostInterface[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.authService.userStateStream$
      .pipe(
        tap((fullUser) => {
          if (fullUser && fullUser.additionalInfo) {
            if (
              fullUser.additionalInfo.role !== UserRoleEnum.Admin &&
              fullUser.additionalInfo !== null
            ) {
              this.alertService.displayToast(
                "You don't have perimssion",
                'error',
                'red'
              );
              this.router.navigateByUrl('/');
            }
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.userService
      .getAllUsers()
      .pipe(
        tap((users) => {
          users.forEach((document) => {
            this.users.push(document.payload.doc.data() as AdditionalInfoUser);
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.postService
      .getAllPosts()
      .pipe(
        tap((posts) => {
          posts.forEach((document) => {
            this.posts.push(document.payload.doc.data() as PostInterface);
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
