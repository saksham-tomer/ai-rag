"use client"

import { PanelRight, PlusIcon, Settings, Trash, Send, Loader2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useSidebar } from "../Sidebar/SidebarContext";
import { ParamValue } from "next/dist/server/request/params";
import { ChatMessage, RAGQueryRequest, RAGQueryResponse } from "@/interface";
import ChatComponent from "./ChatComponent";

type HomeProps = {
    title: string | undefined,
    model: string | undefined,
}

export default function ChatView({ props, chatId }: { props: HomeProps, chatId: ParamValue }) {
    const sidebarOpen = useSidebar();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(`session-${chatId}-${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [namespace, setNamespace] = useState(""); // Will be set based on chatId

    // Extract namespace from chatId (which is the processed S3 key)
    useEffect(() => {
        if (chatId && typeof chatId === 'string') {
            // The chatId is already the processed S3 key, so we can use it directly
            // Just ensure it's clean for namespace use
            const cleanNamespace = chatId.replace(/[^\x00-\x7F]+/g, "");
            setNamespace(cleanNamespace);
            console.log(`Setting namespace to: ${cleanNamespace} from chatId: ${chatId}`);
        }
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            content: inputMessage,
            role: 'user',
            timestamp: new Date(),
            sessionId
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            if (!namespace) {
                throw new Error('No namespace available. Please ensure the document was uploaded correctly.');
            }

            console.log(`Sending request with namespace: ${namespace}, chatId: ${chatId}`);

            const request: RAGQueryRequest = {
                question: inputMessage,
                namespace: namespace,
                sessionId: sessionId,
                useStreaming: false
            };

            const response = await fetch('/api/conversational-rag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data: RAGQueryResponse = await response.json();

            const assistantMessage: ChatMessage = {
                id: `msg-${Date.now()}-${Math.random()}`,
                content: data.response,
                role: 'assistant',
                timestamp: new Date(),
                sessionId
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            let errorContent = "Sorry, I encountered an error while processing your request. Please try again.";
            
            if (error instanceof Error) {
                if (error.message.includes('No namespace available')) {
                    errorContent = "No document found for this chat. Please upload a document first and try again.";
                } else if (error.message.includes('API key') || error.message.includes('authentication')) {
                    errorContent = "API configuration issue. Please check your environment variables and try again.";
                }
            }
            
            const errorMessage: ChatMessage = {
                id: `msg-${Date.now()}-${Math.random()}`,
                content: errorContent,
                role: 'assistant',
                timestamp: new Date(),
                sessionId
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="relative flex flex-col bg-gradient-to-br from-white/20 via-white transition-all duration-200 ease-in-out to-[#e5e3] rounded-lg min-w-fit min-h-full shadow-lg border-[1.5px] border-gray-300/60">
            <header className="flex flex-col items-center justify-between">
                <div className="flex flex-row justify-between p-4 items-center w-full">
                    <div className="flex flex-row gap-2 items-center w-full">
                        <p className="font-medium leading-2 text-sm">{props.title}</p>
                        <p className="font-medium leading-2 p-2 rounded-lg text-xs bg-gray-200">{props.model}</p>
                        <p className="font-medium leading-2 p-2 rounded-lg text-xs bg-blue-200">Namespace: {namespace}</p>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="p-2 rounded-lg bg-gradient-to-b text-nowrap from-indigo-500 to-purple-600 text-white flex hover:scale-105 transition-all duration-100 cursor-pointer ease-in flex-row gap-1 items-center text-xs"
                        >
                            <PlusIcon className="w-4 h-4 font-bold text-white" />
                            New Chat
                        </button>
                        <div className="min-w-[2px] min-h-8 bg-gray-200 rounded-2xl" />
                        <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:rotate-45 transition-all duration-200 ease-in " />
                        <Trash 
                            onClick={clearChat}
                            className="w-5 h-5 text-gray-500 cursor-pointer hover:stroke-red-400 transition-colors duration-200 ease-in " 
                        />
                        <PanelRight 
                            onClick={() => sidebarOpen.setIsOpen(true)} 
                            className="w-5 h-5 text-gray-500 cursor-pointer hover:stroke-purple-600 transition-colors duration-200 ease-in" 
                        />
                    </div>
                </div>
                <div className="min-w-full min-h-[1.5px] bg-gray-200 rounded-2xl" />
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p>Start a conversation! Ask me anything about your documents.</p>
                        <p className="text-sm mt-2">I'll remember our conversation and provide contextual responses.</p>
                    </div>
                )}
                
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                                message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 max-w-[70%] p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Custom Chat Input Component */}
            <ChatComponent
                chatProps={{ chats: [] }}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={sendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}
