import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: 'Hola, responde "Funciona" si puedes leerme.',
    });
    console.log('Success:', text);
  } catch (error) {
    console.error('Error during OpenAI API call:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message || error);
    }
  }
}
test();
