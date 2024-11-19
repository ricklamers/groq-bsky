// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'llama-3.1-70b-versatile',
    label: 'Llama 3.1 70B',
    apiIdentifier: 'llama-3.1-70b-versatile',
    description: 'Meta 128k context versatile model',
  },
  
  // {
  //   id: 'gemma-7b-it',
  //   label: 'Gemma 7B',
  //   apiIdentifier: 'gemma-7b-it', 
  //   description: 'Google 8k context model optimized for instruction following',
  // },
  // {
  //   id: 'llama3-groq-70b-8192-tool-use-preview',
  //   label: 'Llama 3 Groq 70B',
  //   apiIdentifier: 'llama3-groq-70b-8192-tool-use-preview',
  //   description: 'Groq 8k context model with tool use capabilities',
  // },
  {
    id: 'llama3-70b-8192',
    label: 'Llama 3 70B',
    apiIdentifier: 'llama3-70b-8192',
    description: 'Meta 8k context model',
  },
  // {
  //   id: 'llama3-groq-8b-8192-tool-use-preview',
  //   label: 'Llama 3 Groq 8B',
  //   apiIdentifier: 'llama3-groq-8b-8192-tool-use-preview',
  //   description: 'Groq 8k context model with tool use capabilities',
  // },
  {
    id: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    apiIdentifier: 'llama-3.1-8b-instant',
    description: 'Meta 128k context instant response model',
  },
  // {
  //   id: 'llama-3.2-1b-preview',
  //   label: 'Llama 3.2 1B',
  //   apiIdentifier: 'llama-3.2-1b-preview',
  //   description: 'Meta 128k context preview model',
  // },
  // {
  //   id: 'llama-3.2-3b-preview',
  //   label: 'Llama 3.2 3B',
  //   apiIdentifier: 'llama-3.2-3b-preview',
  //   description: 'Meta 128k context preview model',
  // },
  {
    id: 'llama3-8b-8192',
    label: 'Llama 3 8B',
    apiIdentifier: 'llama3-8b-8192',
    description: 'Meta 8k context model',
  },
  {
    id: 'mixtral-8x7b-32768',
    label: 'Mixtral 8x7B',
    apiIdentifier: 'mixtral-8x7b-32768',
    description: 'Mistral 32k context model',
  },
  {
    id: 'gemma2-9b-it',
    label: 'Gemma 2 9B',
    apiIdentifier: 'gemma2-9b-it',
    description: 'Google 8k context model optimized for instruction following',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'llama-3.1-70b-versatile';
