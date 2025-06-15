import { Bold, BookA, Italic, LayoutGrid, List, Mic, Paperclip, PlusIcon, Send, Type } from "lucide-react";
import React from "react";

type ChatProps = {
    chats: string[] | undefined,
    voice?: string | ArrayBuffer
}

export default function ChatComponent({ chatProps }: { chatProps: ChatProps }) {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[40rem] min-w-[10rem] flex p-4 rounded-2xl shadow-xl flex-col items-center gap-6 bg-white border-2 border-gray-200/40">
            <div className="flex border-2 w-full border-gray-200/50 rounded-xl p-4 min-h-[10rem] flex-col items-center">
                <section className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Bold className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Italic className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <List className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Type className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Paperclip className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <Mic className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </div>
                </section>
                <div className="min-w-full min-h-[1.5px] bg-gradient-to-l from-gray-100/70 via-gray-200 to-gray-100/70 mt-4" />
                <textarea name="chat" id="chat" placeholder="How can I help you?" className="text-sm mt-2 w-full text-gray-400 font-light leading-loose border-none outline-none"></textarea>
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
                <button className="p-2 rounded-lg bg-gradient-to-b text-nowrap from-indigo-500 to-purple-600 text-white flex hover:scale-105 transition-all duration-100 cursor-pointer ease-in flex-row gap-1 items-center text-xs">
                    <Send className="w-4 h-4 font-bold text-white" />
                    Send Message
                </button>
            </section>
        </div>
    )
}