export type BlueskyPostType = {
  uri: string;
  text: string;
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  createdAt: string;
}; 