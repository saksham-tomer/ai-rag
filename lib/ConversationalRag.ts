import { ConversationSummaryBufferMemory } from "langchain/memory";
import { BaseMessage } from "@langchain/core/messages";
import { AIComponent } from "./AnthropicChain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class ConversationalRAGComponent extends AIComponent {
    memory: ConversationSummaryBufferMemory;

    constructor() {
        super();
        this.memory = new ConversationSummaryBufferMemory({
            llm: this.LLMInstance!,
            maxTokenLimit: 500,
            returnMessages: true,
        });
    }

    private createConversationalRAGPrompt() {
        return ChatPromptTemplate.fromTemplate(`You are an AI assistant that answers questions based on provided context and conversation history.

        Chat History: {chat_history}
        
        Context: {context}
        
        Human: {question}
        
        Based on the context and our conversation history, provide a helpful response. If referring to previous parts of our conversation, make that clear.`);
    }

    async conversationalRAGQuery(question: string, namespace: string): Promise<string> {
        try {
            const vectorStore = await this.getVectorStore(namespace);
            const retriever = vectorStore.asRetriever({ k: 5 });

            const chatHistory = await this.memory.chatHistory.getMessages();
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

            const response = await ragChain.invoke(question);

            await this.memory.saveContext(
                { input: question },
                { output: response }
            );

            return response;
        } catch (error) {
            console.error('Error in conversational RAG:', error);
            throw new Error('Failed to process conversational RAG query');
        }
    }
}
