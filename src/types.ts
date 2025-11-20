
export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
