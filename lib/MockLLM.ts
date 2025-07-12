export class MockLLM {
    private responses: Map<string, string> = new Map();

    constructor() {
        this.initializeResponses();
    }

    private initializeResponses() {
        this.responses.set("what is ai", "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans. It encompasses various technologies including machine learning, natural language processing, and robotics.");
        
        this.responses.set("what is machine learning", "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions.");
        
        this.responses.set("what is nlp", "Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language. It enables machines to understand, interpret, and generate human language.");
        
        this.responses.set("what is deep learning", "Deep Learning is a subset of machine learning that uses artificial neural networks with multiple layers to model and understand complex patterns. It has revolutionized fields like computer vision, speech recognition, and natural language processing.");
        
        this.responses.set("what is rag", "Retrieval-Augmented Generation (RAG) is an AI framework that combines information retrieval with text generation. It enhances language models by providing them with relevant context from external knowledge sources.");
        
        this.responses.set("what is vector database", "Vector databases are specialized databases designed to store and retrieve high-dimensional vector embeddings efficiently. They are essential for AI applications that require similarity search.");
        
        this.responses.set("what is conversational ai", "Conversational AI systems are designed to engage in natural language conversations with users. They use techniques like intent recognition, entity extraction, and context management to maintain coherent conversations.");
        
        this.responses.set("what are embeddings", "Embeddings are numerical representations of text, images, or other data that capture semantic meaning. They enable machines to understand relationships between different pieces of information.");
    }

    private findBestResponse(input: string): string {
        const lowerInput = input.toLowerCase();
        
        for (const [key, response] of this.responses) {
            if (lowerInput.includes(key)) {
                return response;
            }
        }
        
        for (const [key, response] of this.responses) {
            const keywords = key.split(' ');
            const inputWords = lowerInput.split(' ');
            
            const matchCount = keywords.filter(keyword => 
                inputWords.some(word => word.includes(keyword))
            ).length;
            
            if (matchCount >= keywords.length * 0.5) { // 50% match threshold
                return response;
            }
        }
        
        return "I understand you're asking about AI and related technologies. Based on the context provided, I can help you with information about artificial intelligence, machine learning, natural language processing, deep learning, and related topics. Could you please be more specific about what you'd like to know?";
    }

    async invoke(input: any): Promise<any> {
        let textInput = "";
        
        if (typeof input === "string") {
            textInput = input;
        } else if (input && typeof input === "object") {
            if (Array.isArray(input)) {
                textInput = input.map(msg => msg.content || msg.text || "").join(" ");
            } else {
                textInput = input.content || input.text || "";
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = this.findBestResponse(textInput);
        
        return {
            content: response,
            text: response
        };
    }

    async stream(input: any): Promise<ReadableStream<string>> {
        const response = await this.invoke(input);
        const text = response.content || response.text || "";
        
        return new ReadableStream({
            async start(controller) {
                const words = text.split(' ');
                for (const word of words) {
                    controller.enqueue(word + ' ');
                    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming
                }
                controller.close();
            }
        });
    }
} 