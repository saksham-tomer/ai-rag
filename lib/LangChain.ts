import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { Document } from '@langchain/core/documents';
import md5 from 'md5'
import getEmbeddings from './HuggingFaceEmbeddings';

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export class LangChainConfig {
    cache: Map<number, string> = new Map();
    splitter: RecursiveCharacterTextSplitter;
    readonly chunkSize: number = 400;
    readonly chunkOverlap: number = 50;
    readonly separators: Array<string> = ['\n\n', '\n', ' ', ''];

    constructor() {
        this.splitter = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
            separators: this.separators
        });
    }

    private validatePDFBuffer(buffer: Uint8Array): boolean {
        // PDF files start with "%PDF-" (0x25, 0x50, 0x44, 0x46, 0x2D) so validating that
        const pdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D]);
        
        if (buffer.length < 5) return false;
        
        for (let i = 0; i < 5; i++) {
            if (buffer[i] !== pdfHeader[i]) {
                return false;
            }
        }
        return true;
    }

    private async tryAlternativeLoading(blob: Blob): Promise<Document[]> {
        try {
            const loader = new WebPDFLoader(blob, {
                splitPages: false, 
                parsedItemSeparator: ' '
            });
            
            const docs = await loader.load();
            
            if (docs && docs.length > 0) {
                console.log(`Alternative loading successful: ${docs.length} documents`);
                return docs;
            }
            
            throw new Error('Alternative loading also failed');
        } catch (error) {
            console.error('Alternative loading failed:', error);
            throw error;
        }
    }

    private createFallbackDocument(buffer: Uint8Array): Document[] {
        const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
        
        if (text.length === 0) {
            throw new Error('PDF buffer contains no readable text');
        }

        return [new Document({
            pageContent: `[PDF Content - ${buffer.length} bytes] - Raw extraction failed. Manual processing required.`,
            metadata: {
                source: 'pdf-fallback',
                size: buffer.length,
                type: 'pdf'
            }
        })];
    }

    async SplitText(buffer: Uint8Array): Promise<Vector[]> {
        try {
            if (!buffer || buffer.length === 0) {
                throw new Error('PDF buffer is empty or null');
            }

            if (!this.validatePDFBuffer(buffer)) {
                throw new Error('Invalid PDF format - file does not start with PDF header');
            }

            console.log(`Processing PDF buffer of size: ${buffer.length} bytes`);

            const blob = new Blob([buffer.buffer || buffer], { 
                type: "application/pdf" 
            });

            let docs: Document[] = [];

            try {
                const loader = new WebPDFLoader(blob, {
                    splitPages: true,
                    parsedItemSeparator: '\n'
                });
                
                docs = await loader.load()
                
                if (docs && docs.length > 0) {
                    console.log(`Primary loading successful: ${docs.length} documents`);
                }
            } catch (primaryError) {
                console.warn('Primary loading failed, trying alternative method:', primaryError);
                
                try {
                    docs = await this.tryAlternativeLoading(blob);
                } catch (alternativeError) {
                    console.error('Alternative loading also failed:', alternativeError);
                    
                    throw new Error(`PDF processing failed: Primary error - ${primaryError instanceof Error ? primaryError.message : 'Unknown'}. Alternative error - ${alternativeError instanceof Error ? alternativeError.message : 'Unknown'}`);
                }
            }

            if (!docs || docs.length === 0) {
                throw new Error('No documents could be extracted from PDF - file may be corrupted, password-protected, or contain only images');
            }

            const validDocs = docs.filter(doc => doc.pageContent && doc.pageContent.trim().length > 0);
            
            if (validDocs.length === 0) {
                throw new Error('PDF contains no extractable text content - it may be image-based or corrupted');
            }

            console.log(`Successfully loaded ${validDocs.length} valid documents from PDF`);
            console.log("The valid docs",validDocs)
            const splitDocs = (await Promise.all(validDocs.map(doc => this.ParseDocument(doc)))).flat();
            
            console.log(`Split into ${splitDocs.length} chunks`);

            const vec = await Promise.all(splitDocs.map((doc)=>this.embedDocs(doc)));

            return vec;

        } catch (error) {
            console.error('Detailed error processing PDF:', error);
            
            if (error instanceof Error) {
                if (error.message.includes('Invalid PDF format')) {
                    throw new Error('The uploaded file is not a valid PDF');
                } else if (error.message.includes('encrypted') || error.message.includes('password')) {
                    throw new Error('Cannot process password-protected PDF files');
                } else if (error.message.includes('no extractable text')) {
                    throw new Error('PDF appears to contain only images or is corrupted');
                } else if (error.message.includes('corrupted')) {
                    throw new Error('PDF file appears to be corrupted');
                } else {
                    throw new Error(`PDF processing error: ${error.message}`);
                }
            }
            
            throw new Error('Unknown error occurred while processing PDF');
        }
    }

    async embedDocs(doc: Document){
        try {
           const embeddings = await getEmbeddings(doc.pageContent) 
           //hashing pageContent
           const hash = md5(doc.pageContent)

           return{
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
           } as Vector
        } catch (error: any) {
           console.error("Error in generation of embeddings")
           throw new Error("Error generating embeddings",error) 
        }
    }

    async truncateString(str: string, bytes: number){
        const encoder = new TextEncoder;
        return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0,bytes));
    }

    async ParseDocument(page: Document){
        let { pageContent, metadata } = page;
        pageContent = pageContent.replace(/\n/g,"");

        const docs = await this.splitter.splitDocuments([
            new Document({
                pageContent,
                metadata: {
                    pageNumber: metadata.loc.pageNumber,
                    text: await this.truncateString(pageContent, 36000)
                }
            })
        ])
        return docs;
    }
}