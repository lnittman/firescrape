import "server-only";
import { database } from "@repo/database";
import type {
  AppearanceSettings,
  UpdateAppearanceSettings,
} from "../../schemas/user/appearance";

export class AppearanceSettingsService {
  /**
   * Get user appearance settings, creating defaults if they don't exist
   * Font handling is managed by the design system's typography components
   */
  async getAppearanceSettings(userId: string): Promise<AppearanceSettings> {
    let settings = await database.userPreferences.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await database.userPreferences.create({
        data: {
          userId,
          fontFamily: "iosevka-term", // Default font family
        },
      });
    }

    return this.serializeAppearanceSettings(settings);
  }

  /**
   * Update user appearance settings
   * Currently no user-configurable appearance options - design system handles typography
   */
  async updateAppearanceSettings(
    userId: string,
    data: UpdateAppearanceSettings,
  ): Promise<AppearanceSettings> {
    // For now, just ensure the record exists but don't update anything
    // since there are no valid appearance settings to update
    const settings = await database.userPreferences.upsert({
      where: { userId },
      update: {
        // Update fontFamily if provided
        fontFamily: data.fontFamily || undefined,
      },
      create: {
        userId,
        fontFamily: data.fontFamily || "iosevka-term",
      },
    });

    return this.serializeAppearanceSettings(settings);
  }

  /**
   * Delete user appearance settings
   */
  async deleteAppearanceSettings(userId: string): Promise<void> {
    await database.userPreferences.delete({
      where: { userId },
    });
  }

  /**
   * Serialize database user appearance settings to API format
   * Excludes font-related fields as they're managed by the design system
   */
  private serializeAppearanceSettings(settings: any): AppearanceSettings {
    return {
      id: settings.id,
      userId: settings.userId,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}

export const appearanceSettingsService = new AppearanceSettingsService();
