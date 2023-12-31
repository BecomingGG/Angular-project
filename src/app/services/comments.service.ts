import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommentsInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private afs: AngularFirestore) {}

  public createComment(comment: CommentsInterface) {
    return this.afs
      .collection('/comments')
      .add(comment)
      .then(
        (result) => {
          comment.id = result.id;
          this.updateComments(comment);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public getCommentById(id: string) {
    return this.afs.doc(`/comments/${id}`).snapshotChanges();
  }

  public getAllComments() {
    return this.afs.collection('/comments').snapshotChanges();
  }

  public updateComments(comments: CommentsInterface) {
    return this.afs.doc(`/comments/${comments.id}`).update(comments);
  }

  public deleteComments(comments: CommentsInterface) {
    return this.afs.doc(`/comments/${comments.id}`).delete();
  }
}
