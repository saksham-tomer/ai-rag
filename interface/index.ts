export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    sessionId?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    namespace: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RAGQueryRequest {
    question: string;
    namespace: string;
    sessionId?: string;
    useStreaming?: boolean;
    useCustomRetriever?: boolean;
}

export interface RAGQueryResponse {
    response: string;
    method: 'standard' | 'custom' | 'conversational-rag';
    timestamp: string;
    sessionId?: string;
    error?: string;
    details?: string;
}

export interface StreamingChunk {
    content: string;
    done?: boolean;
}

export interface ConversationMemory {
    sessionId: string;
    messages: ChatMessage[];
    summary?: string;
}

export interface VectorSearchResult {
    content: string;
    metadata: Record<string, any>;
    score: number;
}
