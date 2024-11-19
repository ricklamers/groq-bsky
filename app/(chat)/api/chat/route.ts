import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamText,
} from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();
  const userId = session?.user?.id;

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  if (userId) {
    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({ message: userMessage });
      await saveChat({ id, userId, title });
    }

    await saveMessages({
      messages: [
        { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
      ],
    });
  }

  const streamingData = new StreamData();

  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: systemPrompt,
    messages: coreMessages,
    temperature: 0.2,
    maxSteps: 5,
    tools: {
      searchBsky: {
        description: 'Search for posts on Bluesky social network, always pick top or latest for the user based on what best matches the user question.',
        parameters: z.object({
          query: z.string().describe('The search query string'),
          sort: z.enum(['top', 'latest']).optional().describe('Sort order for results'),
        }),
        execute: async ({ query, sort = 'latest' }) => {
          const searchParams = new URLSearchParams({
            q: query,
            limit: '25',
            sort: sort,
          });

          const response = await fetch(
            `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${searchParams}`
          );

          if (!response.ok) {
            throw new Error(`Bluesky API error: ${response.statusText}`);
          }

          const data = await response.json();
          
          return {
            posts: data.posts.map((post: any) => ({
              text: post.record.text,
              author: post.author.handle,
              createdAt: post.indexedAt,
              uri: post.uri,
            })),
          };
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (userId) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);

          const messagesToSave = responseMessagesWithoutIncompleteToolCalls.map(
            (message) => {
              const messageId = generateUUID();

              if (message.role === 'assistant') {
                streamingData.appendMessageAnnotation({
                  messageIdFromServer: messageId,
                });
              }

              return {
                id: messageId,
                chatId: id,
                role: message.role,
                content: message.content,
                createdAt: new Date(),
              };
            },
          );

          if (messagesToSave.length > 0) {
            await saveMessages({
              messages: messagesToSave,
            });
          }
        } catch (error) {
          console.error('Failed to save chat');
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
