import { Groq } from 'groq-sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "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",
});

/**
 * Handles LLM requests with dynamic web search capability
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { query } = req.body;

      // Step 1: Determine if web search is needed using chain of thought
      const searchDecision = await determineWebSearchNeed(query);

      // Initialize response context
      let responseContext = {
        originalQuery: query,
        finalResponse: ''
      };

      if (searchDecision.needsWebSearch && searchDecision.searchQuery) {
        // Step 2: Perform web search if needed
        const searchResults = await performWebSearch(searchDecision.searchQuery);
        
        // Step 3: Generate response incorporating search results
        responseContext = await generateEnhancedResponse(query, searchResults, searchDecision);
      } else {
        // Generate response without web search
        responseContext = await generateDirectResponse(query);
      }

      res.status(200).json(responseContext);
    } catch (error) {
      console.error('Error in Enhanced LLM Handler:', error);
      res.status(500).json({ 
        error: 'An error occurred while processing the request.',
        details: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}

/**
 * Determines if a web search is necessary for the query
 * @param {string} query - The user's input query
 * @returns {Promise<Object>} Decision about web search
 */
async function determineWebSearchNeed(query) {
  const prompt = `
You are an intelligent assistant tasked with determining whether a web search is necessary to provide a comprehensive answer.

Query: "${query}"

Analyze the query and decide:
1. Do you need additional real-time or current information?
2. Are there specific domains where web search would provide better context?
3. Is the query about recent events, evolving topics, or requires up-to-date information?

Output a JSON with these fields:
- needsWebSearch: boolean (whether web search is required)
- searchQuery: string (refined search query if needed, otherwise null)
- reasoning: string (explain your decision-making process)
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Performs a web search for the given query
 * @param {string} searchQuery - The query to search
 * @returns {Promise<Array>} Search results
 */
async function performWebSearch(searchQuery) {
  // Mock search results (replace with actual search API in production)
  const mockSearchResults = [
    {
      title: "Web Search Result for: " + searchQuery,
      snippet: "Detailed context and information related to the search query.",
      url: "https://example.com/search-result"
    }
  ];

  return mockSearchResults;
}

/**
 * Generates a response using web search results
 * @param {string} originalQuery - The original user query
 * @param {Array} searchResults - Web search results
 * @param {Object} searchDecision - The search decision details
 * @returns {Promise<Object>} Enhanced response with context
 */
async function generateEnhancedResponse(originalQuery, searchResults, searchDecision) {
  const prompt = `
Context:
- Original Query: "${originalQuery}"
- Web Search Reasoning: ${searchDecision.reasoning}
- Search Results:
${searchResults.map(result => 
  `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.url}`
).join('\n\n')}

Instructions:
1. Synthesize the search results with the original query
2. Provide a comprehensive, well-structured response
3. Cite sources from the search results
4. Maintain clarity and provide actionable information
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.5,
    max_tokens: 2048
  });

  return {
    originalQuery,
    searchResults,
    finalResponse: response.choices[0].message.content
  };
}

/**
 * Generates a direct response without web search
 * @param {string} query - The user's query
 * @returns {Promise<Object>} Response context
 */
async function generateDirectResponse(query) {
  const response = await groq.chat.completions.create({
    messages: [{ role: 'user', content: query }],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048
  });

  return {
    originalQuery: query,
    finalResponse: response.choices[0].message.content
  };
}