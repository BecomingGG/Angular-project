import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AdditionalInfoUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private afs: AngularFirestore) {}

  public createUser(user: AdditionalInfoUser) {
    return this.afs
      .collection('/users')
      .add(user)
      .then(
        (result) => {
          user.id = result.id;
          this.updateUser(user);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public getUserById(id: string) {
    return this.afs.doc(`/users/${id}`).snapshotChanges();
  }

  public getAllUsers() {
    return this.afs.collection('/users').snapshotChanges();
  }

  public updateUser(user: AdditionalInfoUser) {
    return this.afs.doc(`/users/${user.id}`).update(user);
  }

  public deleteUser(user: AdditionalInfoUser) {
    return this.afs.doc(`/users/${user.id}`).delete();
  }
}
