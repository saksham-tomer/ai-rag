import Image from "next/image";
import React from "react";
import PortAILogo from '@/public/PortAi.png'
import { PanelRight, Plus, Settings } from "lucide-react";
import ChatSearch from "./ChatSearch";
import Tabs from "./Tabs";
import DropView from "./DropView";

const messages = [
    "The zebra danced through the thunderstorm like a rockstar.",
    "Quantum muffins are illegal in seventeen galaxies.",
    "He wore confidence like a second-hand coat in spring.",
    "A cactus once told me its dreams in Morse code.",
    "Yesterday’s spaghetti rewrote history in the microwave.",
    "Banana phones only work during full moons.",
    "The librarian screamed in binary before vanishing.",
    "Time travel is just poorly managed memory allocation.",
    "Clouds argued over who would rain first.",
    "My thoughts are encrypted in pineapple salsa."
];


export default function SidebarView({ children }: { children: React.ReactNode }) {
    document.title = "PortAI"
    return (
        <nav className="flex bg-[var(--gray)] flex-col font-[var(--font-inter)] min-h-screen  max-w-[20rem] items-center p-4 lg:p-6">
            <section className="flex flex-row items-center justify-between w-full">
                <div className="flex items-center gap-2 font-semibold text-2xl text-gray-700">
                    <Image src={PortAILogo} alt="PortAI Logo" className="w-12 h-12 object-cover" />
                    PortAI
                </div>
                <PanelRight className="max-w-6 max-h-6 cursor-pointer text-[#667084]" />
            </section>
            <section className="w-full mt-8">
                <div className="flex flex-row p-1 mb-2 justify-between items-center">
                    <div className="flex font-semibold text-gray-600 flex-row gap-2 items-center">
                        <Image src={PortAILogo} alt="Profile Picture" className="w-10 rounded-full h-10 object-cover" loading="lazy" quality={100} />
                        Alex Ferguson
                    </div>
                    <Settings className="w-5 h-5 text-gray-500" />
                </div>
                <ChatSearch />
            </section>
            <section className="w-full mt-12">
                <Tabs currentTab={0} />
            </section>

            <section className="w-full mt-12">
                <DropView title="pinned" chats={messages} />
            </section>
            <section className="w-full mt-12">
                <DropView title="chat history" chats={messages} />
            </section>

            <button className="p-2 text-white py-3 text-sm gap-2 bg-gradient-to-b from-[#4C29FD] to-[#6927FF] w-full mt-4 rounded-xl hover:bg-[#6927FF] transition-colors duration-200 ease-in-out cursor-pointer text-center flex flex-row items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
                Start new chat
            </button>
            <section className="w-full mt-4">
                {children}
            </section>
        </nav>
    )
}