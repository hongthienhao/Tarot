import dotenv from 'dotenv';
dotenv.config();

import { streamTarotReading } from './src/services/aiService.js';

const run = async () => {
  try {
    const cards = [
      { name: 'The Fool', orientation: 'Upright', message: 'New beginnings' }
    ];
    console.log('Testing AI connection...');
    const stream = await streamTarotReading(cards, 'Single Card', 'Will I be happy?');
    console.log('Stream acquired.');
    for await (const chunk of stream) {
      process.stdout.write(chunk.text());
    }
    console.log('\n\nDone.');
  } catch (err) {
    console.error('\n--- ERROR OCCURRED ---');
    console.error(err);
  }
};

run();
