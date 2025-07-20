import 'server-only';
import { database } from '@repo/database';
import type { Profile, UpdateProfile } from '../../schemas/user/profile';

export class ProfileService {
  /**
   * Get user profile, creating default profile if it doesn't exist
   */
  async getProfile(userId: string): Promise<Profile> {
    let user = await database.user.findUnique({
      where: { userId },
    });

    if (!user) {
      // This shouldn't happen as user should be created during auth
      throw new Error('User not found');
    }

    return this.serializeProfile(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfile): Promise<Profile> {
    const user = await database.user.update({
      where: { userId },
      data: {
        name: data.displayName,
        username: data.username,
        tier: data.tier,
        // phoneNumber is not stored in User model
      },
    });

    return this.serializeProfile(user);
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    // We don't actually delete users, just their data
    await database.user.update({
      where: { userId },
      data: {
        name: null,
        username: null,
        location: null,
        emergencyContact: null as any,
      },
    });
  }

  /**
   * Serialize database user profile to API format
   */
  private serializeProfile(user: any): Profile {
    return {
      id: user.id,
      userId: user.userId,
      displayName: user.name,
      username: user.username,
      phoneNumber: null, // Not stored in User model
      tier: user.tier as 'free' | 'premium',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export const profileService = new ProfileService();

 