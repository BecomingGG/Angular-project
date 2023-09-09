export interface postInterface {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  reactsIds: string[];
  creatorId: string;
  creatorDisplayName: string;
  creatorImage: string;
  createdAt: string;
  comments: postCommentInterface[];
}

export interface postCommentInterface {
  id: string;
  displayName: string;
  createdAt: string;
  comment: string;
}
