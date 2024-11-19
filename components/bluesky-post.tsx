import { formatDistanceToNow } from 'date-fns';
import type { BlueskyPostType } from '@/lib/types';

interface BlueskyPostProps {
  post: BlueskyPostType;
}

export const BlueskyPost = ({ post }: BlueskyPostProps) => {
  const webUrl = post.uri
    .replace('at://', '')
    .replace('/app.bsky.feed.post/', '/post/');
  
  const profileUrl = `https://bsky.app/profile/${webUrl}`;
  
  return (
    <a 
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground truncate">
          @{post.author.replace('.bsky.social', '')}
          {' · '}
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
        <div className="text-sm break-words overflow-wrap-anywhere">
          {post.text}
        </div>
      </div>
    </a>
  );
}; 