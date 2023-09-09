import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { postInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public readonly DEFAULT_IMAGE =
    'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png';

  constructor(private afs: AngularFirestore) {}

  public createPost(post: postInterface) {
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

  public updatePost(post: postInterface) {
    return this.afs.doc(`/posts/${post.id}`).update(post);
  }

  public deletePosts(post: postInterface) {
    return this.afs.doc(`/post/${post.id}`).delete();
  }
}
