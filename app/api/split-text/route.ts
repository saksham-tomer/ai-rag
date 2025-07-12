import { LangChainConfig } from "@/lib/LangChain";
import { uploadToPinecone } from "@/lib/Pinecone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const bufferData = body.buffer;
        const key = body.key;
        
        if (!bufferData) {
            return NextResponse.json({ 
                error: "No buffer provided",
                suggestion: "Please ensure a valid file is selected"
            }, { status: 400 });
        }

        let uint8Buffer: Uint8Array;
        
        if (bufferData.type === 'Buffer' && Array.isArray(bufferData.data)) {
            uint8Buffer = new Uint8Array(bufferData.data);
        } else if (bufferData instanceof ArrayBuffer) {
            uint8Buffer = new Uint8Array(bufferData);
        } else if (Array.isArray(bufferData)) {
            uint8Buffer = new Uint8Array(bufferData);
        } else if (bufferData instanceof Uint8Array) {
            uint8Buffer = bufferData;
        } else {
            console.error('Invalid buffer format:', {
                type: typeof bufferData,
                constructor: bufferData?.constructor?.name,
                isArray: Array.isArray(bufferData),
                hasData: bufferData?.data !== undefined
            });
            
            return NextResponse.json({ 
                error: "Invalid buffer format",
                details: "Expected Buffer, ArrayBuffer, Uint8Array, or number array",
                receivedType: typeof bufferData
            }, { status: 400 });
        }

        if (uint8Buffer.length === 0) {
            return NextResponse.json({ 
                error: "Empty buffer provided",
                suggestion: "Please ensure the PDF file is not empty"
            }, { status: 400 });
        }

        //validation
        const maxFileSize = 50 * 1024 * 1024; 
        if (uint8Buffer.length > maxFileSize) {
            return NextResponse.json({ 
                error: "File too large",
                details: `File size ${Math.round(uint8Buffer.length / 1024 / 1024)}MB exceeds limit of ${Math.round(maxFileSize / 1024 / 1024)}MB`,
                suggestion: "Please use a smaller PDF file"
            }, { status: 413 });
        }

        console.log(`Processing buffer of size: ${uint8Buffer.length} bytes (${Math.round(uint8Buffer.length / 1024)}KB)`);

        const splitter = new LangChainConfig();
        const vec = await splitter.SplitText(uint8Buffer);

        await uploadToPinecone(key,vec)
        
        // if (!splitDocs || splitDocs.length === 0) {
        //     return NextResponse.json({ 
        //         error: "No content extracted",
        //         details: "PDF processed successfully but no text content was found",
        //         suggestion: "The PDF may contain only images or be corrupted"
        //     }, { status: 422 });
        // }

        // console.log(`Successfully processed PDF: ${splitDocs.length} chunks created`);
        
        return NextResponse.json({ 
            response: { message: "Successfully uploaded to Pinecone" }
        }, { status: 200 });

    } catch (error) {
        console.error("Error in /split-text route:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error("Full error details:", {
            message: errorMessage,
            stack: errorStack,
            name: error instanceof Error ? error.name : 'UnknownError'
        });

        if (errorMessage.includes('Invalid PDF format') || errorMessage.includes('not a valid PDF')) {
            return NextResponse.json({ 
                error: "Invalid PDF file", 
                details: "The uploaded file is not a valid PDF format",
                suggestion: "Please ensure you're uploading a valid PDF file",
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
            return NextResponse.json({ 
                error: "PDF is password protected", 
                details: "Cannot process password-protected or encrypted PDF files",
                suggestion: "Please upload an unprotected PDF file",
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        if (errorMessage.includes('corrupted') || errorMessage.includes('no extractable text')) {
            return NextResponse.json({ 
                error: "PDF processing failed", 
                details: "PDF may be corrupted or contain only images",
                suggestion: "Please try a different PDF file or ensure it contains text content",
                timestamp: new Date().toISOString()
            }, { status: 422 });
        }

        return NextResponse.json({ 
            error: "Failed to process PDF", 
            details: errorMessage,
            suggestion: "Please try again or contact support if the issue persists",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}