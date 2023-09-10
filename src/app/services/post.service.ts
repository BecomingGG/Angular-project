import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PostInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public readonly DEFAULT_IMAGE =
    'https://citycom.ge/wp-content/uploads/2022/12/placeholder-2.png';

  constructor(private afs: AngularFirestore) {}

  public createPost(post: PostInterface) {
    return this.afs
      .collection('/posts')
      .add(post)
      .then(
        (result) => {
          post.id = result.id;
          this.updatePost(post);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public getPostById(id: string) {
    return this.afs.doc(`/posts/${id}`).snapshotChanges();
  }

  public getAllPosts() {
    return this.afs.collection('/posts').snapshotChanges();
  }

  public updatePost(post: PostInterface) {
    return this.afs.doc(`/posts/${post.id}`).update(post);
  }

  public deletePost(post: PostInterface) {
    return this.afs.doc(`/posts/${post.id}`).delete();
  }
}
