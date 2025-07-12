import { ConversationSummaryBufferMemory } from "langchain/memory";
import { ChatMessage, ConversationMemory } from "@/interface";

export class MemoryManager {
    private static instance: MemoryManager;
    private memorySessions: Map<string, ConversationSummaryBufferMemory> = new Map();

    private constructor() {}

    public static getInstance(): MemoryManager {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    public getOrCreateMemory(sessionId: string, llm: any): ConversationSummaryBufferMemory {
        if (!this.memorySessions.has(sessionId)) {
            const memory = new ConversationSummaryBufferMemory({
                llm: llm,
                maxTokenLimit: 1000,
                returnMessages: true,
            });
            this.memorySessions.set(sessionId, memory);
        }
        return this.memorySessions.get(sessionId)!;
    }

    public async getConversationHistory(sessionId: string): Promise<ChatMessage[]> {
        const memory = this.memorySessions.get(sessionId);
        if (!memory) {
            return [];
        }

        try {
            const messages = await memory.chatHistory.getMessages();
            return messages.map((msg, index) => ({
                id: `msg-${sessionId}-${index}`,
                content: msg.content as string,
                role: msg.getType() === 'human' ? 'user' : 'assistant',
                timestamp: new Date(),
                sessionId
            }));
        } catch (error) {
            console.error('Error getting conversation history:', error);
            return [];
        }
    }

    public async saveConversation(sessionId: string, input: string, output: string): Promise<void> {
        const memory = this.memorySessions.get(sessionId);
        if (!memory) {
            throw new Error(`No memory session found for ${sessionId}`);
        }

        try {
            await memory.saveContext(
                { input },
                { output }
            );
        } catch (error) {
            console.error('Error saving conversation:', error);
            throw error;
        }
    }

    public clearSession(sessionId: string): void {
        this.memorySessions.delete(sessionId);
    }

    public getAllSessionIds(): string[] {
        return Array.from(this.memorySessions.keys());
    }

    public getSessionCount(): number {
        return this.memorySessions.size;
    }
} 