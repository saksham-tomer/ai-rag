export default async function getEmbeddings(texts: string | string[]): Promise<number[][] | number[]> {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5",
		{
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				inputs: texts
			}),
		}
	);
	
	if (!response.ok) {
		const errorText = await response.text();
		console.error('HF API Error:', errorText);
		throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
	}
	
	const result = await response.json();
	return result;
}