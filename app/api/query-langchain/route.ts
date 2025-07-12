import { AIComponent } from "@/lib/AnthropicChain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { question, namespace, useCustomRetriever = false } = await req.json();
        
        if (!question || !namespace) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "Both 'question' and 'namespace' are required"
            }, { status: 400 });
        }

        const aiComponent = new AIComponent();
        
        const response = useCustomRetriever 
            ? await aiComponent.customRAGQuery(question, namespace)
            : await aiComponent.queryWithRAG(question, namespace);
        
        return NextResponse.json({
            response: response,
            method: useCustomRetriever ? 'custom' : 'standard',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error in LangChain query route:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({
            error: "LangChain RAG query failed",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
