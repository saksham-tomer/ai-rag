import { Pinecone, type PineconeConfiguration } from "@pinecone-database/pinecone";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";

let pineconeClient:Pinecone|null = null;

export async function getPineconeClient(){
    if(!pineconeClient){
        pineconeClient = new Pinecone({
            apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY ?? '',
            maxRetries: 5,
            // assistantRegion: process.env.NEXT_PUBLIC_PINECONE_REGION    
        })
    }
    return pineconeClient ;
}

export async function uploadToPinecone(key: string, vec: Vector[]) {
    try {
        if (!vec || vec.length === 0) {
            throw new Error('No vectors provided for upload');
        }
        console.log("the vector is ",vec)
        const client = await getPineconeClient();
        const pineconeIndex = client.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string); 
        
        const nameSpace = key;
        const asciiStr = nameSpace.replace(/[^\x00-\x7F]+/g, "");
        
        console.log(`Uploading ${vec.length} vectors to namespace: ${asciiStr}`);
        
        //chunking and storing
        const BATCH_SIZE = 10;
        for (let i = 0; i < vec.length; i += BATCH_SIZE) {
            const batch = vec.slice(i, i + BATCH_SIZE);
            const batchRecords = batch.map(v => ({
                ...v,
                metadata: v.metadata ?? {}
            })) as any;
            await pineconeIndex.namespace(asciiStr).upsert(batchRecords);
            console.log(`Uploaded batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(vec.length/BATCH_SIZE)}`);
        }
        
        console.log('Successfully uploaded all vectors to Pinecone');
        
    } catch (error) {
        console.error('Error uploading to Pinecone:', error);
        throw error; 
    }
}