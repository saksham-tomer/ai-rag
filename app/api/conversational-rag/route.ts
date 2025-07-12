import { ConversationalRAGComponent } from "@/lib/ConversationalRag";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { question, namespace, sessionId } = await req.json();
        
        console.log(`API: Received request - question: "${question}", namespace: "${namespace}", sessionId: "${sessionId}"`);
        
        if (!question || !namespace) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "Both 'question' and 'namespace' are required"
            }, { status: 400 });
        }

        const conversationalRAG = new ConversationalRAGComponent();
        
        console.log(`API: Calling conversationalRAGQuery with namespace: "${namespace}"`);
        const response = await conversationalRAG.conversationalRAGQuery(question, namespace, sessionId);
        
        return NextResponse.json({
            response: response,
            method: 'conversational-rag',
            timestamp: new Date().toISOString(),
            sessionId: sessionId || 'default'
        });

    } catch (error) {
        console.error("Error in conversational RAG route:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({
            error: "Conversational RAG query failed",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 