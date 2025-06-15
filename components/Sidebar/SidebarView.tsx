"use client"

import Image from "next/image";
import React, { useEffect } from "react";
import PortAILogo from '@/public/PortAi.png'
import { PanelLeft, Plus, Settings } from "lucide-react";
import ChatSearch from "./ChatSearch";
import Tabs from "./Tabs";
import DropView from "./DropView";
import { useSidebar } from "./SidebarContext";

const messages = [
    "The zebra danced through the thunderstorm like a rockstar.",
    "Quantum muffins are illegal in seventeen galaxies.",
    "He wore confidence like a second-hand coat in spring.",
    "A cactus once told me its dreams in Morse code.",
    "Yesterday's spaghetti rewrote history in the microwave.",
    "Banana phones only work during full moons.",
    "The librarian screamed in binary before vanishing.",
    "Time travel is just poorly managed memory allocation.",
    "Clouds argued over who would rain first.",
    "My thoughts are encrypted in pineapple salsa."
];

export default function SidebarView() {
    useEffect(() => {
        document.title = "PortAI"
    }, [])

    const { isOpen, setIsOpen } = useSidebar()

    if (!isOpen) return null;

    return (
        <nav className="fixed transition-all duration-200 ease-in-out delay-75 hide-scrollbar left-0 top-0 h-screen w-80 bg-[var(--gray)] flex flex-col font-[var(--font-inter)] items-center p-4 lg:p-6 overflow-y-auto">
            <section className="flex flex-row items-center justify-between w-full mb-8">
                <div className="flex items-center gap-2 font-semibold text-2xl text-gray-700">
                    <Image src={PortAILogo} alt="PortAI Logo" className="w-12 h-12 object-cover" />
                    PortAI
                </div>
                <PanelLeft onClick={() => setIsOpen(false)} className="w-6 h-6 cursor-pointer text-[#667084] flex-shrink-0" />
            </section>

            <section className="w-full mb-8">
                <div className="flex flex-row p-1 mb-2 justify-between items-center">
                    <div className="flex font-semibold text-gray-600 flex-row gap-2 items-center">
                        <Image src={PortAILogo} alt="Profile Picture" className="w-10 rounded-full h-10 object-cover" loading="lazy" quality={100} />
                        <span className="truncate">Alex Ferguson</span>
                    </div>
                    <Settings className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </div>
                <ChatSearch />
            </section>

            <section className="w-full mb-4">
                <Tabs currentTab={0} />
            </section>

            <section className="w-full mb-4">
                <DropView title="pinned" chats={messages} />
            </section>

            <section className="w-full mb-4">
                <DropView title="chat history" chats={messages} />
            </section>

            <button className="p-2 text-white py-3 text-sm gap-2 bg-gradient-to-b from-[#4C29FD] to-[#6927FF] w-full rounded-xl hover:bg-[#6927FF] transition-colors duration-200 ease-in-out cursor-pointer text-center flex flex-row items-center justify-center mt-auto">
                <Plus className="w-4 h-4 text-white" />
                Start new chat
            </button>
        </nav>
    );
}