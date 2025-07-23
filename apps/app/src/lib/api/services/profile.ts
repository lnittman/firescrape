import 'server-only';

import { db } from '@repo/database';

import type { Profile, UpdateProfile } from '@/lib/api/schemas/profile';

export class ProfileService {
  /**
   * Get user profile, creating default profile if it doesn't exist
   */
  async getProfile(userId: string): Promise<Profile> {
    let user = await db.profile.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // This shouldn't happen as user should be created during auth
      throw new Error('User not found');
    }

    return this.serializeProfile(user);
  }

  /**
   * Get or create profile for a Clerk user
   */
  async ensureProfile(clerkId: string, userData?: {
    email?: string;
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  }): Promise<Profile> {
    let user = await db.profile.findUnique({
      where: { clerkId },
    });

    if (!user && userData) {
      user = await db.profile.create({
        data: {
          clerkId,
          email: userData.email ?? '',
          username: userData.username ?? `user_${clerkId.slice(-8)}`,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          avatarUrl: userData.avatarUrl || null,
        },
      });
    }

    if (!user) {
      throw new Error('Unable to create or find user profile');
    }

    return this.serializeProfile(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfile): Promise<Profile> {
    const user = await db.profile.update({
      where: { clerkId: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      },
    });

    return this.serializeProfile(user);
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    // We don't actually delete users, just their data
    await db.profile.update({
      where: { clerkId: userId },
      data: {
        firstName: null,
        lastName: null,
        username: null,
      },
    });
  }

  /**
   * Serialize database user profile to API format
   */
  private serializeProfile(user: any): Profile {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      lifetimeRuns: user.lifetimeRuns,
      monthlyRunsUsed: user.monthlyRunsUsed,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const profileService = new ProfileService();

 