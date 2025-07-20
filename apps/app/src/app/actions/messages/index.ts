'use server';

import { auth } from '@repo/auth/server';
import type { Message, CreateMessageInput, CreateMessagesInput } from '@repo/api';
import { revalidatePath } from 'next/cache';

// Temporary stub implementation until message storage is properly implemented
// Messages are currently handled through API endpoints, not database storage

export async function createMessage(input: CreateMessageInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    // TODO: Implement proper message creation
    // For now, return a stub message
    const message: Message = {
      id: crypto.randomUUID(),
      content: input.content,
      type: input.type || 'TEXT',
      createdAt: new Date().toISOString(),
      threadId: input.threadId,
    };

    revalidatePath('/');
    return { data: message };
  } catch (error) {
    console.error('Error creating message:', error);
    return { error: 'Failed to create message' };
  }
}

export async function addMessageToThread(threadId: string, input: CreateMessageInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    // TODO: Implement proper message creation
    const message: Message = {
      id: crypto.randomUUID(),
      content: input.content,
      type: input.type || 'TEXT',
      createdAt: new Date().toISOString(),
      threadId,
    };

    revalidatePath('/');
    return { data: message };
  } catch (error) {
    console.error('Error adding message to thread:', error);
    return { error: 'Failed to add message to thread' };
  }
}

export async function saveMessagesForThread(threadId: string, messages: CreateMessagesInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    // TODO: Implement proper message storage
    const savedMessages: Message[] = messages.map((msg, index) => ({
      id: msg.id || crypto.randomUUID(),
      content: msg.content,
      type: msg.type || 'TEXT',
      createdAt: msg.createdAt ? (typeof msg.createdAt === 'string' ? msg.createdAt : msg.createdAt.toISOString()) : new Date(Date.now() + index * 1000).toISOString(),
      threadId: msg.threadId,
    }));

    revalidatePath('/');
    return { data: savedMessages };
  } catch (error) {
    console.error('Error saving messages for thread:', error);
    return { error: 'Failed to save messages for thread' };
  }
}

export async function deleteMessagesForThread(threadId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    // TODO: Implement proper message deletion
    revalidatePath('/');
    return { data: true };
  } catch (error) {
    console.error('Error deleting messages for thread:', error);
    return { error: 'Failed to delete messages for thread' };
  }
}