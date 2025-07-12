import { MockDataGenerator } from "@/lib/MockDataGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { namespace = 'test-namespace' } = await req.json();
        
        console.log(`Generating mock data for namespace: ${namespace}`);
        
        const embeddingsTest = await MockDataGenerator.testEmbeddings();
        const pineconeTest = await MockDataGenerator.testPineconeConnection();
        
        if (!embeddingsTest.success) {
            return NextResponse.json({
                error: "Embeddings test failed",
                details: embeddingsTest.error,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }
        
        if (!pineconeTest.success) {
            return NextResponse.json({
                error: "Pinecone connection test failed",
                details: pineconeTest.error,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }
        
        const result = await MockDataGenerator.generateMockData(namespace);
        
        if (!result.success) {
            return NextResponse.json({
                error: "Failed to generate mock data",
                details: result.error,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Mock data generated successfully",
            data: result,
            tests: {
                embeddings: embeddingsTest,
                pinecone: pineconeTest
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error in generate mock data route:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({
            error: "Mock data generation failed",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const mockDocuments = MockDataGenerator.getMockDocuments();
        
        return NextResponse.json({
            success: true,
            message: "Mock documents available",
            documents: mockDocuments.map((doc, index) => ({
                id: index + 1,
                content: doc.content.substring(0, 100) + "...",
                metadata: doc.metadata
            })),
            totalCount: mockDocuments.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error in get mock documents route:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({
            error: "Failed to get mock documents",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 