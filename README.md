# RAG System Setup Guide

## Prerequisites

Before running the RAG system, you need to set up the following services and obtain API keys:

### 1. Google Gemini API Key
- Sign up at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create an API key
- Used for Gemini LLM responses

### 2. Hugging Face Token
- Sign up at [Hugging Face](https://huggingface.co/)
- Go to Settings > Access Tokens
- Create a new token
- Used for text embeddings

### 3. Pinecone Vector Database
- Sign up at [Pinecone](https://www.pinecone.io/)
- Create a new index
- Note your API key and index name
- Used for storing and retrieving document embeddings

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Gemini API Key for LLM
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here

# Hugging Face Token for Embeddings
NEXT_PUBLIC_HF_TOKEN=your_huggingface_token_here

# Pinecone Configuration
NEXT_PUBLIC_PINECONE_API_KEY=your_pinecone_api_key_here
NEXT_PUBLIC_PINECONE_INDEX=your_pinecone_index_name_here

# Optional: Use Mock LLM for testing (when credits are low)
USE_MOCK_LLM=true
```

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing the System

### 1. Upload Documents
- Navigate to the home page
- Upload PDF documents using the drag-and-drop interface
- Documents will be processed and stored in Pinecone

### 2. Test RAG Functionality
- Visit `/test` for comprehensive testing
- Visit `/chat/123` for conversational interface
- Use the test script: `node test-rag.js`

### 3. API Endpoints
- `/api/conversational-rag` - Conversational RAG with memory
- `/api/query-langchain` - Standard RAG
- `/api/conversational-rag-stream` - Streaming RAG

## Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check if all environment variables are set
   - Verify API keys are valid
   - Check server logs for specific error messages

2. **Google Gemini API Issues**
   - If you see API quota or billing errors, set `USE_MOCK_LLM=true` in your environment
   - The mock LLM provides pre-defined responses for testing
   - Check your Google AI Studio billing and quotas to use the real Gemini LLM

2. **No documents found**
   - Ensure documents are uploaded to the correct namespace
   - Verify Pinecone index is properly configured
   - Check if embeddings are generated correctly

3. **Memory not working**
   - Verify sessionId is being passed correctly
   - Check if MemoryManager is properly initialized
   - Ensure conversation history is being saved

### Debug Steps

1. Check browser console for client-side errors
2. Check terminal/server logs for API errors
3. Verify environment variables are loaded:
   ```javascript
   console.log('Google Key:', process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'Set' : 'Missing');
   console.log('HF Token:', process.env.NEXT_PUBLIC_HF_TOKEN ? 'Set' : 'Missing');
   console.log('Pinecone Key:', process.env.NEXT_PUBLIC_PINECONE_API_KEY ? 'Set' : 'Missing');
   ```

4. Test individual components:
   - Test embeddings generation
   - Test vector store connection
   - Test LLM responses

## Architecture Overview

```
User Interface (Next.js)
    ↓
API Routes (/api/*)
    ↓
RAG Components (lib/*)
    ↓
External Services (Google Gemini, HuggingFace, Pinecone)
```

### Key Components
- **ConversationalRAGComponent**: Main RAG with memory
- **MemoryManager**: Session and memory management
- **AIComponent**: Base LLM and vector store operations
- **Pinecone**: Vector database for document storage
- **HuggingFace**: Text embeddings
- **Google Gemini**: LLM for response generation

## Next Steps

1. Set up your environment variables
2. Upload some test documents
3. Test the conversational RAG functionality
4. Explore the different API endpoints
5. Customize the system for your specific use case 
