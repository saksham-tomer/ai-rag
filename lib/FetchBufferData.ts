import axios from "axios"
import { S3Config } from "./S3Config"

export default async function FetchBufferData(chatId: string): Promise<any> {
    if (chatId && typeof chatId === "string") {
        const buffer = await S3Config.getObject(chatId)
        if (buffer) {
            console.log("received buffer from s3", buffer)
            try {
                const doc = await axios.post('/api/split-text', {
                    buffer,
                    key: chatId
                })
                if (doc) {
                    // console.log("the splitted doc received", doc)
                    return doc;
                }
            } catch (error) {
                console.error("%c Encountered Error while splitting doc", "padding:2px;border:2px solid orange;border-radius: 12px;background: black;text:white", error)
            }

        }
    }
}
