export interface User {
  _id: string;
  username: string;
  avatarImageURL?: string;
}

export enum UserBoardRoles {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  REGULAR = "REGULAR",
  GUEST = "GUEST",
}

export interface TagI {
  _id: string,
  color: string,
  name: string
} 

export interface BoardUserI {
  role: UserBoardRoles;
  user: User;
}

export interface BoardI {
  _id: string;
  name: string;
  description: string;
  author: string;
  isAuthor: boolean;
  pinned: boolean;
  members: BoardUserI;
}

export interface TaskI {
  _id: string;
  title: string;
  description: string;
  author: string;
  board: string;
  people: User[];
  tags: TagI[];
}
