export interface postInterface {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  reactsIds: string[];
  creatorId: string;
  createdAt: string;
  comments: postCommentInterface[];
}

export interface postCommentInterface {
  id: string;
  email: string;
  comment: string;
}
