"use client"

import { Command, MessageCircleMore } from "lucide-react";
import React, { useState } from "react";

type Props = {
    currentTab: string | number;
}

const TabTypes = {
    Chats: "Chats",
    Library: "Library",
    Apps: "Apps"
} as const;

const Tabs = (props: Props) => {
    const [selectedTab, setSelectedTab] = useState<string | number>(0);
    
    function handleSelection(idx: number): void {
        setSelectedTab(idx);
    }

    return (
        <React.Fragment>
            {Object.values(TabTypes).map((tab, idx) => (
                <div 
                    key={idx}
                    onClick={() => handleSelection(idx)} 
                    className={`flex mb-2 text-sm font-medium ${selectedTab === idx ? "bg-white text-gray-700 shadow-md" : "bg-[var(--gray)]"} rounded-md p-2 py-2.5 flex-row items-center group justify-between text-gray-500 relative`}
                >
                    <div className="flex flex-row gap-1 items-center">
                        <MessageCircleMore className={`${selectedTab === idx ? "text-gray-700" : "text-gray-500"}`} />
                        {tab}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 font-semibold rounded-lg bg-gray-100 group-hover:shadow-sm">
                        <Command className="w-3 h-3 text-gray-900 font-semibold" />
                        <span className="text-xs text-gray-900">{idx + 1}</span>
                    </div>
                </div>
            ))}
        </React.Fragment>
    );
}

export default Tabs;