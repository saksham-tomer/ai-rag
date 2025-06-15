"use client"

import { PanelRight, PlusIcon, Settings, Trash } from "lucide-react";
import React from "react";
import ChatComponent from "./ChatComponent";
import { useSidebar } from "../Sidebar/SidebarContext";

type HomeProps = {
    title: string | undefined,
    model: string | undefined
}

const chats = [
    "Hello! How can I help you today?",
    "I need help understanding how tokenization works in GPT models",
]

export default function ChatView({ props }: { props: HomeProps }) {

    const sidebarOpen = useSidebar()
    const title = "How the model determines token"

    return (
        <div className="relative flex flex-col bg-gradient-to-br from-white/20 via-white to-[#e5e3] rounded-lg min-w-fit min-h-full shadow-lg border-[1.5px] border-gray-300/60">
            <header className="flex flex-col items-center justify-between">
                <div className="flex flex-row justify-between p-4 items-center w-full">
                    <div className="flex flex-row gap-2 items-center w-full">
                        <p className="font-medium leading-2 text-sm">{props.title}</p>
                        <p className="font-medium leading-2 p-2 rounded-lg text-xs bg-gray-200">{props.model}</p>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <button className="p-2 rounded-lg bg-gradient-to-b text-nowrap from-indigo-500 to-purple-600 text-white flex hover:scale-105 transition-all duration-100 cursor-pointer ease-in flex-row gap-1 items-center text-xs"><PlusIcon className="w-4 h-4 font-bold text-white" />New Chat</button>
                        <div className="min-w-[2px] min-h-8 bg-gray-200 rounded-2xl" />
                        <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:rotate-45 transition-all duration-200 ease-in " />
                        <Trash className="w-5 h-5 text-gray-500 cursor-pointer hover:stroke-red-400 transition-colors duration-200 ease-in " />
                        <PanelRight onClick={() => sidebarOpen.setIsOpen(true)} className="w-5 h-5 text-gray-500 cursor-pointer hover:stroke-purple-600 transition-colors duration-200 ease-in" />
                    </div>
                </div>
                <div className="min-w-full min-h-[1.5px] bg-gray-200 rounded-2xl" />
            </header>
            <ChatComponent chatProps={{ chats }} />
        </div>
    );
}
