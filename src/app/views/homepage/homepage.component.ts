import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { AdditionalInfoUser, PostInterface } from 'src/app/interfaces';
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
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  public posts: PostInterface[] = [];
  public user!: firebase.User;
  private additionalUserInfo: AdditionalInfoUser | null = null;
  public isAuthed: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.postService
      .getAllPosts()
      .pipe(
        tap((result) => {
          this.posts = [];
          result.forEach((item) => {
            this.posts.push(item.payload.doc.data() as PostInterface);
          });
          this.posts = this.sortBy(true);
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

  sortBy(isAsc: boolean = true) {
    return this.posts.sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();
      return isAsc ? firstTime - secondTime : secondTime - firstTime;
    });
  }

  updateSort(direction: boolean) {
    this.posts = this.sortBy(direction);
  }

  deletePost(post: PostInterface) {
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
        this.postService.deletePost(post);
      }
    });
  }

  isPostAuthor(post: PostInterface) {
    return (
      post.creatorId === this.user?.uid ||
      this.additionalUserInfo?.role === UserRoleEnum.Admin
    );
  }
}
