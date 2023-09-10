export interface PostInterface {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  creatorId: string;
  creatorDisplayName: string;
  creatorImage: string;
  createdAt: string;
  reactsIds: string[];
  comments: PostCommentInterface[];
}

export interface PostCommentInterface {
  id: string;
  displayName: string;
  createdAt: string;
  comment: string;
}
