export type AuthProvider = 'platform' | 'google' | 'github' | 'microsoft';

export interface UserConfig {
  username: string;
  avatarUrl: string | null;
}

export interface AuthLogin {
  authLogin: string;
  provider: AuthProvider;
  providerEmail: string | null;
  providerUsername: string | null;
  providerAvatarUrl: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface User {
  id: string;
  userId: string;
  email: string;
  isVerified: boolean;
  authLogins: AuthLogin[];
  config: UserConfig;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
