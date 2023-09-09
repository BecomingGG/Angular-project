import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Subject, takeUntil, tap } from 'rxjs';
import { postInterface } from 'src/app/interfaces';

import { AlertService, AuthService, PostService } from 'src/app/services';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  public posts: postInterface[] = [];
  public user!: firebase.User;
  public isAuthed: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postService
      .getAllPosts()
      .pipe(
        tap((result) => {
          this.posts = [];
          result.forEach((item) => {
            this.posts.push(item.payload.doc.data() as postInterface);
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.authService.fireAuthState
      .pipe(
        tap((user) => {
          if (user) this.user = user;
          this.isAuthed = user ? true : false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleReact(post: postInterface) {
    if (this.user) {
      const reactIndex = post.reactsIds.findIndex((id) => id === this.user.uid);
      if (reactIndex === -1) {
        post.reactsIds.push(this.user.uid);
      } else {
        post.reactsIds.splice(reactIndex, 1);
      }
      this.postService.updatePost(post);
    }
  }

  getUserReactStatus(post: postInterface) {
    const reactIndex = post.reactsIds.findIndex(
      (id) => id === (this.user?.uid || '')
    );
    return reactIndex !== -1;
  }
}
