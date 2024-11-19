import { createOpenAI } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

const openaiClient = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL
});

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openaiClient(apiIdentifier),
    middleware: customMiddleware,
  });
};
