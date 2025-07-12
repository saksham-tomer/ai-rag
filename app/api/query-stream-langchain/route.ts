import { AIComponent } from "@/lib/AnthropicChain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { question, namespace } = await req.json();
        
        if (!question || !namespace) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        const aiComponent = new AIComponent();
        const stream = await aiComponent.streamRAGQuery(question, namespace);
        
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        if (chunk) {
                            controller.enqueue(
                                new TextEncoder().encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
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
        console.error("Error in LangChain streaming route:", error);
        return NextResponse.json({
            error: "LangChain streaming failed"
        }, { status: 500 });
    }
}