require('dotenv').config();
const OpenAI = require('openai');

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // or your preferred model
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 100
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const prompt = "What is the capital of France?";
    const response = await generateResponse(prompt);
    console.log('Response:', response);
  } catch (error) {
    console.error('Main error:', error);
  }
}

main(); 