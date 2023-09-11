import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { AdditionalInfoUser, CommentsInterface } from 'src/app/interfaces';
import { AlertService, AuthService } from 'src/app/services';
import firebase from 'firebase/compat/app';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.scss'],
})
export class GlobalChatComponent implements OnInit, OnDestroy {
  creatorDisplayName: string = '';
  createdAt: string = '';
  comment: string = '';

  public comments: CommentsInterface[] = [];

  private user!: firebase.User;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.authService.fireAuthState
      .pipe(
        tap((user) => {
          if (user) {
            this.user = user;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.commentsService
      .getAllComments()
      .pipe(
        tap((result) => {
          this.comments = [];
          result.forEach((item) => {
            this.comments.push(item.payload.doc.data() as CommentsInterface);
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  createComment() {
    if (this.comment) {
      this.commentsService.createComment({
        id: '',
        comments: this.comment,
        creatorId: this.user.uid,
        createdAt: new Date().toString(),
        creatorDisplayName: this.user.displayName || '',
      });
      this.comment = '';
    }
  }

  sortBy(isAsc: boolean = true) {
    return this.comments.sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();
      return isAsc ? firstTime - secondTime : secondTime - firstTime;
    });
  }

  updateSort(direction: boolean) {
    this.comments = this.sortBy(direction);
  }
}