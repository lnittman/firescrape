import 'server-only';
import { database } from '@repo/database';
import type { AISettings, UpdateAISettings } from '../../schemas/user/ai';

export class AISettingsService {
  /**
   * Get user AI settings, creating defaults if they don't exist
   */
  async getAISettings(userId: string): Promise<AISettings> {
    let settings = await database.aISettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await database.aISettings.create({
        data: { 
          userId,
          rules: null, // Default rules can be added here
        }
      });
    }

    return this.serializeAISettings(settings);
  }

  /**
   * Update user AI settings
   */
  async updateAISettings(userId: string, data: UpdateAISettings): Promise<AISettings> {
    // Only use the rules field which exists in the database
    const settings = await database.aISettings.upsert({
      where: { userId },
      update: {
        rules: data.rules !== undefined ? data.rules || null : undefined,
      },
      create: { 
        userId, 
        rules: data.rules || null,
      },
    });

    return this.serializeAISettings(settings);
  }

  /**
   * Delete user AI settings
   */
  async deleteAISettings(userId: string): Promise<void> {
    await database.aISettings.delete({
      where: { userId },
    });
  }

  /**
   * Serialize database user AI settings to API format
   */
  private serializeAISettings(settings: any): AISettings {
    return {
      id: settings.id,
      userId: settings.userId,
      // Default values for fields not in database
      defaultModel: 'google/gemini-2.5-flash-preview-05-20',
      openaiKey: null,
      anthropicKey: null,
      googleKey: null,
      openrouterKey: null,
      enabledModels: {},
      rules: settings.rules,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}

export const aiSettingsService = new AISettingsService();

 