import { Pinecone, type PineconeConfiguration } from "@pinecone-database/pinecone";

let pineconeClient:Pinecone|null = null;

export async function getPineconeClient(){
    if(!pineconeClient){
        pineconeClient = new Pinecone({
            apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY ?? '',
            maxRetries: 5,
            assistantRegion: process.env.NEXT_PUBLIC_PINECONE_REGION    
        })
    }
    return pineconeClient;
}