import axios from 'axios';
import * as dotenv from 'dotenv';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
import { OpenAIService } from '../openai/openai.service';
import { DummyAPIService } from '../dummy-api/dummy-api.service';
dotenv.config();

async function testGoogleSearchAPI() {
    console.log('\n=== Testing Google Search API ===');
    const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    console.log('Configuration Check:');
    console.log('- Google API Key:', googleApiKey ? '✓ Present' : '✗ Missing');
    console.log('- Search Engine ID:', searchEngineId ? '✓ Present' : '✗ Missing');

    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: googleApiKey,
                cx: searchEngineId,
                q: 'iPhone 15 Pro',
                searchType: 'image',
                num: 1
            }
        });

        console.log('\nAPI Response Check:');
        console.log('- Status:', response.status === 200 ? '✓ OK' : '✗ Failed');
        console.log('- Has Items:', response.data.items ? '✓ Yes' : '✗ No');
        console.log('- Sample Result:', response.data.items?.[0]?.title || 'No results');
    } catch (error) {
        console.error('\nAPI Test Failed:');
        console.error('- Error:', error.response?.data?.error?.message || error.message);
    }
}

async function testOpenAIAPI() {
    console.log('\n=== Testing OpenAI API ===');
    const openaiKey = process.env.OPENAI_API_KEY;

    console.log('Configuration Check:');
    console.log('- OpenAI API Key:', openaiKey ? '✓ Present' : '✗ Missing');

    try {
        const OpenAI = require('openai');
        const openai = new OpenAI({
            apiKey: openaiKey
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "Test message: What is the latest iPhone?" }
            ]
        });

        console.log('\nAPI Response Check:');
        console.log('- Response Received:', completion ? '✓ Yes' : '✗ No');
        console.log('- Sample Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('\nAPI Test Failed:');
        console.error('- Error:', error.message);
    }
}

async function testProductEndpoint() {
    console.log('\n=== Testing Product Search Endpoint ===');
    try {
        const response = await axios.get('http://localhost:3002/api/search', {
            params: {
                q: 'iPhone 15'
            }
        });

        console.log('\nEndpoint Response Check:');
        console.log('- Status:', response.status === 200 ? '✓ OK' : '✗ Failed');
        console.log('- Has Results:', response.data.length > 0 ? '✓ Yes' : '✗ No');
        console.log('- Sample Product:', response.data[0]?.name || 'No products');
    } catch (error) {
        console.error('\nEndpoint Test Failed:');
        console.error('- Error:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting API Tests...');
    
    await testGoogleSearchAPI();
    await testOpenAIAPI();
    await testProductEndpoint();

    console.log('\n✨ Tests Completed!\n');
}

runAllTests().catch(console.error);

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [ProductsService, OpenAIService, DummyAPIService],
    }).compile();

    productsService = moduleRef.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });
}); 