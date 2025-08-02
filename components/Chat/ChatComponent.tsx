import { Bold, BookA, Globe2Icon, Italic, LayoutGrid, List, Mic, Paperclip, PlusIcon, Send, Type } from "lucide-react";
import React, { useState, KeyboardEvent, useRef, useEffect } from "react";

type ChatProps = {
    chats: string[] | undefined,
    voice?: string | ArrayBuffer
}

interface ChatComponentProps {
    chatProps?: ChatProps;
    inputMessage: string;
    setInputMessage: (message: string) => void;
    onSendMessage: () => void;
    isLoading: boolean;
}

export default function ChatComponent({ 
    chatProps, 
    inputMessage, 
    setInputMessage, 
    onSendMessage, 
    isLoading 
}: ChatComponentProps) {
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const toggleRef = useRef<HTMLInputElement>(null);

    const [toggled,setToggled] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputMessage]);

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && inputMessage.trim()) {
                onSendMessage();
            }
        }
    };

    const handleSendClick = () => {
        if (!isLoading && inputMessage.trim()) {
            onSendMessage();
        }
    };

    return (
        <div className="w-full flex p-4 rounded-2xl max-w-[70rem] mx-auto mb-8 shadow-xl flex-col items-center gap-6 bg-transparent border-2 border-gray-200/40">
            <div className="flex border-2 w-full border-gray-200/50 bg-transparent rounded-xl p-4 min-h-[10rem] flex-col items-center">
                <section className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Bold className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Italic className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <List className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Type className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </div>
                    <div className="flex flex-row gap-2 items-center transition-all">
                         {toggled ? <p className="text-xs text-gray-400">Turn On Search</p> : <p className="text-xs text-gray-400">Turn Off Search</p>}
                        <div onClick={()=>setToggled((prev)=>!prev)} className="flex p-1 transition-all cursor-pointer hover:ring-[1.2px] hover:ring-gray-400  shadow-md min-w-[2.5rem] hover:bg-gray-50 duration-200 ease-in transform-gpu rounded-3xl ring-1 ring-gray-300 bg-white flex-row items-center justify-between">
                            <div className={`${toggled ? "bg-purple-300 ring-1 ring-purple-400 translate-x-0": "bg-green-300 ring-1 ring-green-400 translate-x-5"} rounded-full min-w-[10px] min-h-[10px] transition-all duration-200 ease-in transform-gpu`}/> 
                        </div>
                        <Globe2Icon className={`${toggled ? "text-gray-400":"text-green-400"} w-4 h-4 mr-2`}/>
                        <Paperclip className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Mic className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </div>
                </section>
                <div className="min-w-full min-h-[1.5px] bg-gradient-to-l from-gray-100/70 via-gray-200 to-gray-100/70 mt-4" />
                <textarea 
                    ref={textareaRef}
                    name="chat" 
                    id="chat" 
                    placeholder="How can I help you?" 
                    className="text-sm mt-2 w-full text-gray-800 font-light leading-loose border-none outline-none resize-none min-h-[6rem] max-h-[12rem] overflow-y-auto"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    rows={1}
                />
            </div>
            <section className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    <button className="p-2 bg-gray-100 py-2.5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in flex flex-row gap-2 items-center text-gray-800 text-xs font-medium">
                        <BookA className="w-4 h-4" />
                        Library
                    </button>
                    <button className="p-2 flex py-2.5 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in rounded-lg flex-row gap-2 items-center text-gray-800 text-xs font-medium">
                        <LayoutGrid className="w-4 h-4" />
                        Apps
                    </button>
                </div>
                <button 
                    className={`p-2 rounded-lg bg-gradient-to-b text-nowrap from-indigo-500 to-purple-600 text-white flex hover:scale-105 transition-all duration-100 cursor-pointer ease-in flex-row gap-1 items-center text-xs ${
                        isLoading || !inputMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSendClick}
                    disabled={isLoading || !inputMessage.trim()}
                >
                    <Send className="w-4 h-4 font-bold text-white" />
                    {isLoading ? 'Sending...' : 'Send Message'}
                </button>
            </section>
        </div>
    )
}