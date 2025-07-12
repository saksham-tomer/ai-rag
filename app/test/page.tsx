"use client"

import { useState } from 'react';
import { RAGQueryRequest, RAGQueryResponse } from '@/interface';

export default function TestPage() {
    const [question, setQuestion] = useState('');
    const [namespace, setNamespace] = useState('default');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [queryType, setQueryType] = useState<'standard' | 'custom' | 'conversational'>('conversational');
    const [sessionId] = useState(`test-session-${Date.now()}`);
    const [isGeneratingData, setIsGeneratingData] = useState(false);

    const testQueries = [
        "What is the main topic of the document?",
        "Can you summarize the key points?",
        "What are the main conclusions?",
        "How does this relate to previous discussions?",
        "Can you provide more details about this topic?"
    ];

    const sendQuery = async () => {
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setResponse('');

        try {
            let endpoint = '';
            let requestBody: RAGQueryRequest = {
                question,
                namespace,
                sessionId: queryType === 'conversational' ? sessionId : undefined
            };

            switch (queryType) {
                case 'standard':
                    endpoint = '/api/query-langchain';
                    requestBody.useCustomRetriever = false;
                    break;
                case 'custom':
                    endpoint = '/api/query-langchain';
                    requestBody.useCustomRetriever = true;
                    break;
                case 'conversational':
                    endpoint = '/api/conversational-rag';
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RAGQueryResponse = await response.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
            setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testConversation = async () => {
        setIsLoading(true);
        setResponse('');

        try {
            const conversation = [
                "Hello, can you tell me about the main topics in the document?",
                "What are the key findings mentioned?",
                "How do these findings relate to what we discussed earlier?"
            ];

            let fullResponse = '';
            
            for (const query of conversation) {
                const request: RAGQueryRequest = {
                    question: query,
                    namespace,
                    sessionId
                };

                const response = await fetch('/api/conversational-rag', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: RAGQueryResponse = await response.json();
                fullResponse += `\n\nQ: ${query}\nA: ${data.response}`;
            }

            setResponse(fullResponse);
        } catch (error) {
            console.error('Error:', error);
            setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockData = async () => {
        setIsGeneratingData(true);
        try {
            const response = await fetch('/api/generate-mock-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ namespace }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResponse(`Mock data generated successfully!\n\n${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            console.error('Error generating mock data:', error);
            setResponse(`Error generating mock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGeneratingData(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">RAG System Test Page</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Query Type
                            </label>
                            <select
                                value={queryType}
                                onChange={(e) => setQueryType(e.target.value as any)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="conversational">Conversational RAG (with Memory)</option>
                                <option value="standard">Standard RAG</option>
                                <option value="custom">Custom RAG</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Namespace
                            </label>
                            <input
                                type="text"
                                value={namespace}
                                onChange={(e) => setNamespace(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter namespace"
                            />
                        </div>
                    </div>

                    {queryType === 'conversational' && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Session ID:</strong> {sessionId}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                This session will maintain conversation memory across queries.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Single Query Test</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Enter your question here..."
                        />
                    </div>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={sendQuery}
                            disabled={isLoading || !question.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Send Query'}
                        </button>
                        
                        {queryType === 'conversational' && (
                            <button
                                onClick={testConversation}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Test Conversation
                            </button>
                        )}

                        <button
                            onClick={generateMockData}
                            disabled={isGeneratingData}
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingData ? 'Generating...' : 'Generate Mock Data'}
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Sample Questions</h3>
                        <div className="flex flex-wrap gap-2">
                            {testQueries.map((query, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuestion(query)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    {query}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {response && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Response</h2>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}