import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "./Pinecone";

export class MockDataGenerator {
    private static mockDocuments = [
        {
            content: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans. AI encompasses various technologies including machine learning, natural language processing, and robotics. The field has seen significant advancements in recent years, particularly in deep learning and neural networks.",
            metadata: { source: "AI Overview", pageNumber: 1 }
        },
        {
            content: "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions. Common applications include recommendation systems, image recognition, and natural language processing.",
            metadata: { source: "Machine Learning Guide", pageNumber: 2 }
        },
        {
            content: "Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language. It enables machines to understand, interpret, and generate human language. Applications include chatbots, language translation, sentiment analysis, and text summarization.",
            metadata: { source: "NLP Fundamentals", pageNumber: 3 }
        },
        {
            content: "Deep Learning is a subset of machine learning that uses artificial neural networks with multiple layers to model and understand complex patterns. It has revolutionized fields like computer vision, speech recognition, and natural language processing. Popular frameworks include TensorFlow, PyTorch, and Keras.",
            metadata: { source: "Deep Learning Basics", pageNumber: 4 }
        },
        {
            content: "Vector databases are specialized databases designed to store and retrieve high-dimensional vector embeddings efficiently. They are essential for AI applications that require similarity search, such as recommendation systems, image search, and semantic search. Popular vector databases include Pinecone, Weaviate, and Milvus.",
            metadata: { source: "Vector Databases", pageNumber: 5 }
        },
        {
            content: "Retrieval-Augmented Generation (RAG) is an AI framework that combines information retrieval with text generation. It enhances language models by providing them with relevant context from external knowledge sources. This approach improves accuracy and reduces hallucinations in AI-generated responses.",
            metadata: { source: "RAG Framework", pageNumber: 6 }
        },
        {
            content: "Conversational AI systems are designed to engage in natural language conversations with users. They use techniques like intent recognition, entity extraction, and context management to maintain coherent conversations. Modern systems often incorporate memory mechanisms to remember previous interactions.",
            metadata: { source: "Conversational AI", pageNumber: 7 }
        },
        {
            content: "Embeddings are numerical representations of text, images, or other data that capture semantic meaning. They enable machines to understand relationships between different pieces of information. Word embeddings like Word2Vec and sentence embeddings like BERT have transformed how we process and analyze text data.",
            metadata: { source: "Embeddings Guide", pageNumber: 8 }
        }
    ];

    static async generateMockData(namespace: string = 'test-namespace') {
        try {
            console.log(`Generating mock data for namespace: ${namespace}`);
            
            const documents = this.mockDocuments.map(doc => 
                new Document({
                    pageContent: doc.content,
                    metadata: doc.metadata
                })
            );

            const pineconeClient = await getPineconeClient();
            const pineconeIndex = pineconeClient.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string);

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

            await PineconeStore.fromDocuments(documents, customEmbeddings, {
                pineconeIndex,
                namespace: namespace,
                textKey: "text",
            });

            console.log(`✅ Successfully generated mock data for namespace: ${namespace}`);
            console.log(`📊 Stored ${documents.length} documents`);
            
            return {
                success: true,
                documentsCount: documents.length,
                namespace: namespace
            };

        } catch (error) {
            console.error('Error generating mock data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    static getMockDocuments() {
        return this.mockDocuments;
    }

    static async testEmbeddings() {
        try {
            const { default: getEmbeddings } = await import('./HuggingFaceEmbeddings');
            
            const testText = "This is a test sentence for embeddings.";
            const result = await getEmbeddings(testText);
            
            const embeddingArray = Array.isArray(result) ? result as number[] : [result as number];
            
            console.log('✅ Embeddings test successful');
            console.log(`📏 Embedding dimension: ${embeddingArray.length}`);
            
            return {
                success: true,
                dimension: embeddingArray.length
            };
        } catch (error) {
            console.error('❌ Embeddings test failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    static async testPineconeConnection() {
        try {
            const pineconeClient = await getPineconeClient();
            const pineconeIndex = pineconeClient.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string);
            
            const stats = await pineconeIndex.describeIndexStats();
            
            console.log('✅ Pinecone connection test successful');
            console.log(`📊 Index stats:`, stats);
            
            return {
                success: true,
                stats: stats
            };
        } catch (error) {
            console.error('❌ Pinecone connection test failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
} 