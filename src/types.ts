
export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id?: string;
}
