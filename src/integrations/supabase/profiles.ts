
import { supabase } from "./client";
import { UserProfile } from "@/types";

export async function findUsers(searchQuery: string): Promise<UserProfile[]> {
  if (!searchQuery || searchQuery.length < 1) return [];
  
  // Search for users by email or username
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    .limit(10);
  
  if (error) {
    console.error("Error finding users:", error);
    throw error;
  }
  
  // Map the data to the UserProfile type
  return data.map(profile => ({
    id: profile.id,
    username: profile.username || '',
    email: '', // This info may not be available directly due to privacy concerns
    fullName: '', // Will need to be filled by another query if needed
    avatarUrl: profile.avatar_url || `https://avatar.vercel.sh/${profile.username}`
  }));
}
