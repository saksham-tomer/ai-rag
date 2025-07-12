import { getPineconeClient } from "@/lib/Pinecone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const namespace = searchParams.get('namespace');
        
        console.log(`Debug: Checking namespace: "${namespace}"`);
        
        const pineconeClient = await getPineconeClient();
        const pineconeIndex = pineconeClient.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string);
        
        if (namespace) {
            try {
                const stats = await pineconeIndex.namespace(namespace).describeIndexStats();
                console.log(`Debug: Namespace "${namespace}" stats:`, stats);
                
                return NextResponse.json({
                    success: true,
                    namespace: namespace,
                    stats: stats,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error(`Debug: Error checking namespace "${namespace}":`, error);
                return NextResponse.json({
                    success: false,
                    error: `Namespace "${namespace}" not found or error occurred`,
                    details: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                }, { status: 404 });
            }
        } else {
            try {
                const stats = await pineconeIndex.describeIndexStats();
                console.log(`Debug: All namespaces stats:`, stats);
                
                return NextResponse.json({
                    success: true,
                    allNamespaces: stats,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error(`Debug: Error getting all namespaces:`, error);
                return NextResponse.json({
                    success: false,
                    error: "Failed to get namespace information",
                    details: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                }, { status: 500 });
            }
        }
        
    } catch (error) {
        console.error("Error in debug namespace route:", error);
        return NextResponse.json({
            error: "Debug namespace check failed",
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 