import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Config {
    private static instance: S3Client;

    public static getS3Instance(): S3Client {
        if (!S3Config.instance) {
            if (!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY) {
                throw new Error('AWS credentials are not configured');
            }

            S3Config.instance = new S3Client({
                region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION || "ap-southeast-1",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
                }
            });
        }
        return S3Config.instance;
    }

    public static async uploadObject(key: string, body: Buffer, contentType?: string): Promise<string> {
        console.log("the key, body, contentType",key,body,contentType)
        const new_key = key
            .trim()
            .replace(/\n/g, "")
            .replace(/\s+/g,"-")
            .replace(/[_\,]/g, "")

        if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
            throw new Error('S3 bucket name is not configured');
        }

        const s3 = S3Config.getS3Instance();
        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: new_key,
            Body: body,
            ContentType: contentType,
        });
        
        try {
            await s3.send(command);
        } catch (error) {
            throw new Error(`Failed to upload object to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return new_key as string
    }

    public static async getObject(key: string): Promise<Buffer> {
        if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
            throw new Error('S3 bucket name is not configured');
        }

        const s3 = S3Config.getS3Instance();
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key,
        });

        try {
            const response = await s3.send(command);
            {/*node.js: response.Body is a stream.Readable
             browser: response.Body is a ReadableStream (not supported by aws-sdk in browser)
             we'll handle Node.js here
             */}
            const stream = response.Body as NodeJS.ReadableStream;
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            return Buffer.concat(chunks);
        } catch (error) {
            throw new Error(`Failed to get object from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static async deleteObject(key: string): Promise<void> {
        if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
            throw new Error('S3 bucket name is not configured');
        }

        const s3 = S3Config.getS3Instance();
        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key,
        });

        try {
            await s3.send(command);
        } catch (error) {
            throw new Error(`Failed to delete object from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // public static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    //     if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
    //         throw new Error('S3 bucket name is not configured');
    //     }

    //     const s3 = S3Config.getS3Instance();
    //     const command = new GetObjectCommand({
    //         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    //         Key: key,
    //     });

    //     try {
    //         return await getSignedUrl(s3, command, { expiresIn });
    //     } catch (error) {
    //         throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    //     }
    // }
}