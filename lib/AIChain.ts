import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "./Pinecone";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { Document } from "@langchain/core/documents";

export class AIComponent {
    LLMInstance: ChatGoogleGenerativeAI | null = null;
    embeddings: any = null; 
    
    constructor() {
        if (!this.LLMInstance) {
            if(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
            {
                this.LLMInstance = new ChatGoogleGenerativeAI({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                    model: "gemini-1.5-flash",
                    temperature: 0.3,
                    maxOutputTokens: 1000,
                });
            }
            else console.log('💀 NO LLM KEY PROVIDED');
        }

        this.embeddings = null;
    }

    private createRAGPrompt() {
        return ChatPromptTemplate.fromTemplate(`You are an AI assistant designed to answer questions based on provided context. Your core principles:

        RESPONSE GUIDELINES:
        - Provide accurate, helpful responses based solely on the provided context
        - Be concise yet comprehensive in your explanations
        - If the context doesn't contain sufficient information, clearly state this limitation
        - Cite relevant parts of the context when appropriate
        - Maintain a professional, friendly tone
        - Give output in markdown that looks beautiful

        CONTEXT HANDLING:
        - Only use information directly available in the context provided
        - Do not make assumptions beyond what's explicitly stated
        - If multiple pieces of context conflict, acknowledge the discrepancy
        - Prioritize more recent or authoritative sources when available

        ACCURACY REQUIREMENTS:
        - Never fabricate information not present in the context
        - If uncertain about details, express appropriate uncertainty
        - Distinguish between what the context states vs. general knowledge
        - Provide partial answers when context is incomplete rather than guessing

        Context: {context}

        Question: {question}

        Based on the provided context above, please answer the user's question. If the context doesn't contain enough information to fully answer the question, explain what information is missing and provide what you can based on the available context.
        And give output in markdown`);
    }

    protected async getVectorStore(namespace: string): Promise<PineconeStore> {
        console.log(`AIComponent: Getting vector store for namespace: "${namespace}"`);
        const pineconeClient = await getPineconeClient();
        const pineconeIndex = pineconeClient.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string);
        console.log(`AIComponent: Pinecone index: ${process.env.NEXT_PUBLIC_PINECONE_INDEX}`);

        const customEmbeddings = {
            embedQuery: async (text: string): Promise<number[]> => {
                const { default: getEmbeddings } = await import('./HuggingFaceEmbeddings');
                const result = await getEmbeddings(text);
                return Array.isArray(result) ? result as number[] : [result as number];
            },
            embedDocuments: async (texts: string[]): Promise<number[][]> => {
                const { default: getEmbeddings } = await import('./HuggingFaceEmbeddings');
                const result = await getEmbeddings(texts);
                if (Array.isArray(result) && Array.isArray(result[0])) {
                    return result as number[][];
                } else if (Array.isArray(result)) {
                    return [result as number[]];
                } else {
                    return [[result as number]];
                }
            }
        };

        return await PineconeStore.fromExistingIndex(customEmbeddings, {
            pineconeIndex,
            namespace: namespace,
            textKey: "text", 
        });
    }

    async createRAGChain(namespace: string) {
        try {
            const vectorStore = await this.getVectorStore(namespace);
            const retriever = vectorStore.asRetriever({
                k: 5, 
                searchType: "similarity"
            });

            const prompt = this.createRAGPrompt();

            const ragChain = RunnableSequence.from([
                {
                    context: retriever.pipe(formatDocumentsAsString),
                    question: new RunnablePassthrough(),
                },
                prompt,
                this.LLMInstance!,
                new StringOutputParser(),
            ]);

            return ragChain;
        } catch (error) {
            console.error('Error creating RAG chain:', error);
            throw new Error('Failed to create RAG chain');
        }
    }

    async queryWithRAG(question: string, namespace: string): Promise<string> {
        try {
            const ragChain = await this.createRAGChain(namespace);
            const response = await ragChain.invoke(question);
            return response;
        } catch (error) {
            console.error('Error in RAG query:', error);
            throw new Error('Failed to process query with RAG');
        }
    }

    async streamRAGQuery(question: string, namespace: string) {
        try {
            const ragChain = await this.createRAGChain(namespace);
            const stream = await ragChain.stream(question);
            return stream;
        } catch (error) {
            console.error('Error in streaming RAG query:', error);
            throw new Error('Failed to stream RAG response');
        }
    }

    async customRAGQuery(question: string, namespace: string): Promise<string> {
        try {
            const vectorStore = await this.getVectorStore(namespace);
            
            const relevantDocs = await vectorStore.similaritySearchWithScore(question, 5);
            
            const filteredDocs = relevantDocs
                .filter(([doc, score]) => score > 0.7)
                .map(([doc, score]) => {
                    const pageNumber = doc.metadata.pageNumber || 'Unknown';
                    return new Document({
                        pageContent: `[Page ${pageNumber}]: ${doc.pageContent}`,
                        metadata: { ...doc.metadata, score }
                    });
                });

            if (filteredDocs.length === 0) {
                return "I couldn't find relevant information in the document to answer your question. Please try rephrasing your query or ask about different topics covered in the document.";
            }

            const context = formatDocumentsAsString(filteredDocs);
            
            const prompt = this.createRAGPrompt();
            const formattedPrompt = await prompt.format({
                context: context,
                question: question
            });
            
            const response = await this.LLMInstance!.invoke(formattedPrompt);
            return response.content as string;

        } catch (error) {
            console.error('Error in custom RAG query:', error);
            throw new Error('Failed to process custom RAG query');
        }
    }
}