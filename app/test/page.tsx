"use client"

import { useState } from "react";

const handleLangChainQuery = async (question: string, namespace: string) => {
    try {
        const response = await fetch('/api/query-langchain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                question, 
                namespace,
                useCustomRetriever: false 
            }),
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('LangChain query failed:', error);
        throw error;
    }
};

const  Page = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [namespace, setNamespace] = useState('');

    const handleSubmit = async () => {
        try {
            const result = await handleLangChainQuery(query, namespace);
            setResponse(result);
        } catch (error) {
            console.error('Query failed:', error);
            setResponse('Failed to get response');
        }
    };

    return (
        <div>
            <input 
                value={namespace} 
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="Document namespace/key"
            />
            <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question..."
            />
            <button onClick={handleSubmit}>Ask</button>
            <div>{response}</div>
        </div>
    );
};

export default Page