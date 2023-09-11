import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
  AdditionalInfoUser,
  PostCommentInterface,
  PostInterface,
} from 'src/app/interfaces';
import {
  AuthService,
  PostService,
  AlertService,
  UserService,
} from 'src/app/services';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2';
import { UserRoleEnum } from 'src/app/enums';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  public isAuthed: boolean = false;
  public post!: PostInterface;
  public user!: firebase.User;
  private additionalUserInfo: AdditionalInfoUser | null = null;
  public comment: string = '';
  private destroy$ = new Subject<void>();

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
      this.alertService.displayToast('Incorrect post id', 'error', 'red');
      this.router.navigateByUrl('/');
    }

    this.postService
      .getPostById(postID)
      .pipe(
        tap((result) => {
          const post = result.payload.data() as PostInterface;
          if (post) {
            this.post = post;
          } else {
            this.alertService.displayToast(
              'Not found post by this id',
              'error',
              'red'
            );
            this.router.navigateByUrl('/');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.authService.userStateStream$
      .pipe(
        tap((fullUserData) => {
          if (
            fullUserData &&
            fullUserData.user &&
            fullUserData.additionalInfo
          ) {
            this.user = fullUserData.user;
            this.additionalUserInfo = fullUserData.additionalInfo;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleReact(post: PostInterface) {
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

  getUserReactStatus(post: PostInterface) {
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
    if (this.isAuthed) {
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

  isAuthor(comment: PostCommentInterface, isDelete: boolean = true) {
    return (
      comment.id === this.user?.uid ||
      (this.additionalUserInfo?.role === UserRoleEnum.Admin && isDelete)
    );
  }

  deleteComment(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertService.displayToast('Deleted', 'success', 'green');
        this.post.comments.splice(index, 1);
        this.postService.updatePost(this.post);
      }
    });
  }

  deletePost() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertService.displayToast('Deleted', 'success', 'green');
        this.router.navigateByUrl('/');
        this.postService.deletePost(this.post);
      }
    });
  }

  isPostAuthor() {
    return (
      this.user?.uid === this.post?.creatorId ||
      this.additionalUserInfo?.role === UserRoleEnum.Admin
    );
  }
}
