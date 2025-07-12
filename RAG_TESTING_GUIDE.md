# RAG System Testing Guide

This guide explains how to test the complete RAG (Retrieval-Augmented Generation) system with memory capabilities.

## Features Implemented

### 1. Conversational RAG with Memory
- **Location**: `/api/conversational-rag`
- **Memory**: Uses `ConversationSummaryBufferMemory` to maintain conversation context
- **Session Management**: Each conversation session maintains its own memory
- **Context Awareness**: Responses consider previous conversation history

### 2. Standard RAG
- **Location**: `/api/query-langchain`
- **Features**: Basic RAG without memory, supports custom retriever
- **Options**: Standard and custom retrieval methods

### 3. Streaming RAG
- **Location**: `/api/conversational-rag-stream`
- **Features**: Real-time streaming responses with memory
- **Use Case**: For better user experience with long responses

## Testing the System

### 1. Test Page
Navigate to `/test` to access the comprehensive testing interface.

### 2. Chat Interface
Navigate to any chat page (e.g., `/chat/123`) to test the conversational interface.

### 3. API Endpoints

#### Conversational RAG (with Memory)
```bash
POST /api/conversational-rag
{
  "question": "What is the main topic?",
  "namespace": "your-namespace",
  "sessionId": "unique-session-id"
}
```

#### Standard RAG
```bash
POST /api/query-langchain
{
  "question": "What is the main topic?",
  "namespace": "your-namespace",
  "useCustomRetriever": false
}
```

#### Streaming RAG
```bash
POST /api/conversational-rag-stream
{
  "question": "What is the main topic?",
  "namespace": "your-namespace",
  "sessionId": "unique-session-id"
}
```

## Testing Scenarios

### 1. Memory Persistence Test
1. Start a conversation with session ID "test-session-1"
2. Ask: "What is the main topic of the document?"
3. Ask: "Can you elaborate on what we discussed earlier?"
4. Verify the second response references the first question

### 2. Multi-Session Test
1. Start two different sessions with different session IDs
2. Ask the same question in both sessions
3. Verify each session maintains independent memory

### 3. Context Awareness Test
1. Ask: "What are the key points?"
2. Ask: "How do these relate to what we just discussed?"
3. Verify the response acknowledges the previous conversation

### 4. Streaming Test
1. Use the streaming endpoint for a long question
2. Verify responses come in real-time chunks
3. Verify memory is saved after the complete response

## Environment Variables Required

Make sure these environment variables are set:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_HF_TOKEN=your_huggingface_token
NEXT_PUBLIC_PINECONE_INDEX=your_pinecone_index
NEXT_PUBLIC_PINECONE_API_KEY=your_pinecone_key
```

## Architecture Overview

### Components
- **ConversationalRAGComponent**: Main RAG class with memory
- **MemoryManager**: Singleton for managing conversation sessions
- **AIComponent**: Base class for LLM and vector store operations

### Data Flow
1. User sends question with session ID
2. System retrieves relevant documents from vector store
3. System loads conversation history for the session
4. LLM generates response considering both context and history
5. Response and conversation are saved to memory
6. Response is returned to user

### Memory Management
- Each session has its own `ConversationSummaryBufferMemory` instance
- Memory is automatically summarized when it exceeds token limits
- Sessions persist for the lifetime of the server process

## Troubleshooting

### Common Issues
1. **Memory not persisting**: Check if sessionId is being passed correctly
2. **No relevant documents**: Verify namespace and vector store setup
3. **API errors**: Check environment variables and API keys
4. **Streaming issues**: Verify ReadableStream implementation

### Debug Tips
1. Check browser console for client-side errors
2. Check server logs for API errors
3. Use the test page to isolate issues
4. Verify vector store has documents in the specified namespace 