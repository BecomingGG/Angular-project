import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AlertService, AuthService, PostService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  title: string = '';
  description: string = '';
  imageURL: string = '';

  created: boolean = false;

  private user!: firebase.User;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imageURL = this.postService.DEFAULT_IMAGE;
    this.authService.fireAuthState
      .pipe(
        tap((user) => {
          if (user) this.user = user;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  createPost() {
    if (this.title && this.description) {
      this.postService.createPost({
        id: '',
        title: this.title,
        description: this.description,
        imageURL: this.imageURL,
        creatorId: this.user.uid,
        createdAt: new Date().toString(),
        reactsIds: [],
        comments: [],
      });
      this.alertService.displayToast('post Created', 'success', 'green');
      this.created = true;
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 1500);
    } else {
      this.alertService.displayToast('Fill every input', 'error', 'red');
    }
  }

  onImageInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]);
      reader.onloadend = () => {
        this.imageURL = reader.result as string;
      };
    }
  }
}
