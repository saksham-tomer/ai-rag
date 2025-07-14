import { ConversationSummaryBufferMemory } from "langchain/memory";
import { BaseMessage } from "@langchain/core/messages";
import { AIComponent } from "./AIChain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryManager } from "./MemoryManager";

export class ConversationalRAGComponent extends AIComponent {
    private memoryManager: MemoryManager;

    constructor() {
        super();
        this.memoryManager = MemoryManager.getInstance();
    }

    private createConversationalRAGPrompt() {
        return ChatPromptTemplate.fromTemplate(`You are an AI assistant that answers questions based on provided context and conversation history.

        Chat History: {chat_history}
        
        Context: {context}
        
        Human: {question}
        
        Based on the context and our conversation history, provide a helpful response. If referring to previous parts of our conversation, make that clear. 
        Note: provide responses in beautiful markdown and use different styles like bold, italics, ordered or unordered lists, and other styles to make it vizually appealing`);
    }



    async conversationalRAGQuery(question: string, namespace: string, sessionId: string = 'default'): Promise<string> {
        try {
            console.log(`ConversationalRAG: Getting vector store for namespace: "${namespace}"`);
            const vectorStore = await this.getVectorStore(namespace);
            console.log(`ConversationalRAG: Vector store retrieved successfully`);
            const retriever = vectorStore.asRetriever({ k: 5 });

            const memory = this.memoryManager.getOrCreateMemory(sessionId, this.LLMInstance!);
            const chatHistory = await memory.chatHistory.getMessages();
            const historyString = chatHistory
                .map((msg: BaseMessage) => `${msg.getType()}: ${msg.content}`)
                .join('\n');

            const prompt = this.createConversationalRAGPrompt();
            
            const ragChain = RunnableSequence.from([
                {
                    context: retriever.pipe(formatDocumentsAsString),
                    question: new RunnablePassthrough(),
                    chat_history: () => historyString,
                },
                prompt,
                this.LLMInstance!,
                new StringOutputParser(),
            ]);

            console.log(`ConversationalRAG: Invoking RAG chain with question: "${question}"`);
            const response = await ragChain.invoke(question);
            console.log(`ConversationalRAG: Response received, length: ${response.length}`);

            await this.memoryManager.saveConversation(sessionId, question, response);

            return response;
        } catch (error) {
            console.error('Error in conversational RAG:', error);
            throw new Error('Failed to process conversational RAG query');
        }
    }

    async streamConversationalRAGQuery(question: string, namespace: string, sessionId: string = 'default') {
        try {
            const vectorStore = await this.getVectorStore(namespace);
            const retriever = vectorStore.asRetriever({ k: 5 });

            const memory = this.memoryManager.getOrCreateMemory(sessionId, this.LLMInstance!);
            const chatHistory = await memory.chatHistory.getMessages();
            const historyString = chatHistory
                .map((msg: BaseMessage) => `${msg.getType()}: ${msg.content}`)
                .join('\n');

            const prompt = this.createConversationalRAGPrompt();
            
            const ragChain = RunnableSequence.from([
                {
                    context: retriever.pipe(formatDocumentsAsString),
                    question: new RunnablePassthrough(),
                    chat_history: () => historyString,
                },
                prompt,
                this.LLMInstance!,
                new StringOutputParser(),
            ]);

            const stream = await ragChain.stream(question);
            
            let fullResponse = '';
            const memoryManagerRef = this.memoryManager; 
            const transformedStream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of stream) {
                            if (chunk) {
                                fullResponse += chunk;
                                controller.enqueue(chunk);
                            }
                        }
                        await memoryManagerRef.saveConversation(sessionId, question, fullResponse);
                        controller.close();
                    } catch (error) {
                        console.error('Stream error:', error);
                        controller.error(error);
                    }
                }
            });

            return transformedStream;
        } catch (error) {
            console.error('Error in streaming conversational RAG:', error);
            throw new Error('Failed to process streaming conversational RAG query');
        }
    }
}
