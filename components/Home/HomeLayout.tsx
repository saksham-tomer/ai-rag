"use client"

import { PanelRight, PlusIcon, Settings, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useSidebar } from "../Sidebar/SidebarContext";
import { ParamValue } from "next/dist/server/request/params";
import ChatSearch from "../Sidebar/ChatSearch";
import HeroHeader from "./HeroHeader";
import DragDrop from "./DragDrop";

const FILES = {
    MAX_SIZE: 10 * 1024 * 1024, 
    ACCEPTED_TYPES: ['.pdf']
} 

export default function HomeLayout() {

    useEffect(()=>{
        if(!document){
            return
        }
        else
        document.title="PortAi Home Page"
    },[])

    const sidebarOpen = useSidebar()

    return (
        <div className="relative flex flex-col bg-gradient-to-br from-white/20 via-white transition-all duration-200 ease-in-out to-[#e5e3] rounded-2xl min-w-fit min-h-full shadow-lg border-[1.5px] border-gray-300/60">
            <header className="flex flex-col items-center justify-between">
                <div className="flex flex-row justify-between p-4 items-center w-full">
                    <div className="flex flex-row gap-2 items-center w-full">
                        <p className="font-medium leading-2 text-xl mr-4 ml-2">Chats</p>
                        <div className="w-full max-w-[24rem]">
                            <ChatSearch />
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <button className="p-2 rounded-lg bg-gradient-to-b text-nowrap from-indigo-500 to-purple-600 text-white flex hover:scale-105 transition-all duration-100 cursor-pointer ease-in flex-row gap-1 items-center text-xs"><PlusIcon className="w-4 h-4 font-bold text-white" />New Chat</button>
                        <div className="min-w-[2px] min-h-8 bg-gray-200 rounded-2xl" />
                        <PanelRight onClick={() => sidebarOpen.setIsOpen(true)} className="w-5 h-5 text-gray-500 cursor-pointer hover:stroke-purple-600 transition-colors duration-200 ease-in" />
                    </div>
                </div>
                <div className="min-w-full min-h-[1.5px] bg-gray-200 rounded-2xl" />
            </header>
            <HeroHeader />
            <div className="w-full items-center justify-center">
            <DragDrop maxFileSize={FILES.MAX_SIZE} acceptedFileTypes={FILES.ACCEPTED_TYPES} />
          </div>
        </div>
    );
}