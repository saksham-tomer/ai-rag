import { ConversationalRAGComponent } from "@/lib/ConversationalRag";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { question, namespace, sessionId } = await req.json();
        
        if (!question || !namespace) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        const conversationalRAG = new ConversationalRAGComponent();
        const stream = await conversationalRAG.streamConversationalRAGQuery(question, namespace, sessionId);
        
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    const reader = stream.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (value) {
                            controller.enqueue(
                                new TextEncoder().encode(`data: ${JSON.stringify({ content: value })}\n\n`)
                            );
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error("Error in conversational RAG streaming route:", error);
        return NextResponse.json({
            error: "Conversational RAG streaming failed"
        }, { status: 500 });
    }
} 