import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { map, take, tap } from 'rxjs';
import { IUserUpdate } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get fireAuthState() {
    return this.fireAuth.authState;
  }

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private alertService: AlertService
  ) {}

  public register(email: string, password: string, confirmPassword: string) {
    this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user && (password = confirmPassword)) {
          localStorage.setItem('email', result.user.email || '');
        }
        this.alertService.displayToast(
          'Successfully registered',
          'success',
          'green'
        );
        setTimeout(() => {
          this.sendEmailForVerification(result.user);
          this.router.navigateByUrl('/sign_in');
        });
      })
      .catch((err) => {
        this.alertService.displayToast(
          `${err.message.slice(10) || ''}`,
          'error',
          'red',
          5000
        );
      });
  }

  public login(email: string, password: string) {
    this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          localStorage.setItem('token', result.user.uid);
          if (result.user.emailVerified) {
            this.alertService.displayToast(
              'successfully authorized',
              'success',
              'green'
            );
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 1500);
          } else {
            this.alertService.displayToast('Check your email', 'info', 'blue');
            setTimeout(() => {
              this.router.navigateByUrl('/verify');
            }, 1500);
          }
        }
      })
      .catch((err) => {
        this.alertService.displayToast(
          `${err.message.slice(10) || ''} `,
          'error',
          'red',
          5000
        );
      });
  }

  public sendEmailForVerification(user: firebase.default.User | null) {
    if (user) {
      user
        .sendEmailVerification()
        .then((result) => {
          this.router.navigateByUrl('/verify');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public googleSignIn() {
    this.fireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((result) => {
        if (result.user) {
          localStorage.setItem('token', result.user.uid);
          if (result.user.emailVerified) {
            this.alertService.displayToast(
              'successfully authorized',
              'success',
              'green'
            );
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 1500);
          } else {
            this.alertService.displayToast('Check your email', 'info', 'blue');
            setTimeout(() => {
              this.router.navigateByUrl('/verify');
            }, 1500);
          }
        }
      })
      .catch((err) => {
        this.alertService.displayToast(
          `${err.message.slice(10) || 'Unexpected error'} `,
          'error',
          'red',
          5000
        );
      });
  }

  public logOut() {
    this.fireAuth
      .signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/sign_in');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public forgotPassword(email: string) {
    this.fireAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.alertService.displayToast(
          'successfully Recoveried',
          'success',
          'green'
        );
        setTimeout(() => {
          this.router.navigateByUrl('/verify');
        }, 1500);
      })
      .catch((err) => {
        this.alertService.displayToast(
          `${err.message.slice(10) || 'Unexpected error'} `,
          'error',
          'red',
          5000
        );
      });
  }

  public isNotUserAuthed() {
    return this.fireAuthState.pipe(
      map((user) => {
        if (user) {
          this.router.navigateByUrl('/');
          return false;
        } else {
          return true;
        }
      })
    );
  }

  public isUserAuth() {
    return this.fireAuthState.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }

  public updateInfo(userUpdate: IUserUpdate) {
    this.fireAuth.user
      .pipe(
        take(1),
        tap((user) => {
          if (user) {
            user.updateProfile({
              displayName: userUpdate.displayName,
              photoURL: userUpdate.photoURL,
            });
            this.alertService.displayToast('User updated', 'success', 'green');
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 1500);
          }
        })
      )
      .subscribe();
  }
}

export const isUserAuthed: CanActivateFn = (
  router: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthService).isNotUserAuthed();
};

export const isUserAuth: CanActivateFn = (
  router: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthService).isUserAuth();
};
