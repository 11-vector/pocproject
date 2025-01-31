import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async createChatCompletion(params: any) {
    try {
      return await this.openai.chat.completions.create(params);
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      throw error;
    }
  }

  async enhanceSearch(query: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a product search assistant. Return a JSON array of 5 relevant products with realistic details."
          },
          {
            role: "user",
            content: `Generate product search results for: ${query}. Include name, price, description, and specifications.`
          }
        ]
      });

      const content = completion.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      return null;
    }
  }
} 