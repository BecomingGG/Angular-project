import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { postInterface } from 'src/app/interfaces';
import { AlertService, AuthService, PostService } from 'src/app/services';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public user!: firebase.User;
  public isAuthed: boolean = false;
  public post!: postInterface;
  public comment: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private postService: PostService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const postID = this.activatedRoute.snapshot.params['id'] as string;

    if (!postID || postID.length < 15) {
      this.alertService.displayToast('incorect post id', 'error', 'red');
      this.router.navigateByUrl('/');
    }

    this.postService
      .getPostById(postID)
      .pipe(
        tap((result) => {
          const post = result.payload.data() as postInterface;
          if (post) {
            this.post = post;
          } else {
            this.alertService.displayToast('Post not found', 'error', 'red');
            this.router.navigateByUrl('/');
          }
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

  sendComment() {
    const comment = this.comment;

    if (!comment) {
      return;
    }

    if (!this.isAuthed) {
      this.alertService.displayToast('First sign in', 'error', 'red');
      this.comment = '';
      return;
    }
    this.comment = '';
    this.post.comments.push({
      id: this.user.uid,
      displayName: this.user.displayName || this.user.email || '',
      createdAt: new Date().toString(),
      comment,
    });
    this.postService.updatePost(this.post);
  }
}
