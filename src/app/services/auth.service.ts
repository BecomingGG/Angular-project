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
import { BehaviorSubject, map, take, tap } from 'rxjs';
import {
  AdditionalInfoUser,
  FullUserInterface,
  IUserUpdate,
} from '../interfaces';
import { UserService } from './user.service';
import { UserRoleEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userState$ = new BehaviorSubject<FullUserInterface>({
    user: null,
    additionalInfo: null,
  });

  public userStateStream$ = this.userState$.asObservable();

  get userData() {
    return this.userState$.value;
  }

  set userData(user: FullUserInterface) {
    this.userState$.next(user);
  }

  get fireAuthState() {
    return this.fireAuth.authState;
  }

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.init();
  }

  private init() {
    this.fireAuthState
      .pipe(
        tap((user) => {
          if (user) {
            this.userService
              .getAllUsers()
              .pipe(
                take(1),
                tap((users) => {
                  users.forEach((userDoc) => {
                    const userData =
                      userDoc.payload.doc.data() as AdditionalInfoUser;
                    if (userData.uid === user.uid) {
                      this.userData = {
                        user,
                        additionalInfo: userData,
                      };
                      return;
                    }
                  });
                })
              )
              .subscribe();
          } else {
            this.userData = {
              user: null,
              additionalInfo: null,
            };
          }
        })
      )
      .subscribe();
  }

  public register(email: string, password: string) {
    this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          localStorage.setItem('email', result.user.email || '');
          this.userService.createUser({
            id: '',
            name: result.user.displayName?.split(' ')[0] || null,
            lastName: result.user.displayName?.split(' ')[1] || null,
            phoneNumber: result.user.phoneNumber,
            imageURL: result.user.photoURL,
            email: result.user.email,
            uid: result.user.uid,
            role: UserRoleEnum.Default,
          });
        }
        this.alertService.displayToast(
          'Successfully registered',
          'success',
          'green'
        );
        setTimeout(() => {
          this.sendEmailForVerification(result.user);
          this.router.navigateByUrl('/sign_in');
        }, 1500);
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
              'Successfully authorized',
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
          `${err.message.slice(10) || ''}`,
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
              'Successfully authorized',
              'success',
              'green'
            );
            this.userService
              .getAllUsers()
              .pipe(
                take(1),
                tap((users) => {
                  let isUserAlreadyCreated = false;
                  users.forEach((userDoc) => {
                    const userData =
                      userDoc.payload.doc.data() as AdditionalInfoUser;
                    if (userData.uid === result.user?.uid) {
                      isUserAlreadyCreated = true;
                      return;
                    }
                  });
                  if (!isUserAlreadyCreated && result.user) {
                    this.userService.createUser({
                      id: '',
                      name: result.user.displayName?.split(' ')[0] || null,
                      lastName: result.user.displayName?.split(' ')[1] || null,
                      phoneNumber: result.user.phoneNumber,
                      imageURL: result.user.photoURL,
                      email: result.user.email,
                      uid: result.user.uid,
                      role: UserRoleEnum.Default,
                    });
                  }
                })
              )
              .subscribe();
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
          `${err.message.slice(10) || 'Unexpected error'}`,
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
        this.alertService.displayToast('Reset email sent', 'success', 'green');
        setTimeout(() => {
          this.router.navigateByUrl('/verify');
        }, 1500);
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

  public isUserAuthed() {
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
  return inject(AuthService).isUserAuthed();
};
