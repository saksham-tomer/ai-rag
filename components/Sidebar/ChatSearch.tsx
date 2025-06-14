"use client"

import { Command, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface ChatSearchProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

export default function ChatSearch({
    onSearch,
    placeholder = "Search for chats..."
}: ChatSearchProps) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex relative items-center w-full group"
        >
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className={`w-full p-2 py-3 ring-1 ring-gray-200 ${isHovered ? "pl-2" : "pl-8"} rounded-md shadow-md relative outline-none text-gray-500 font-[var(--font-geist-sans)] text-sm transition-all duration-200 ease-in`}
                placeholder={placeholder}
                required
                name="search"
                aria-label="Search Chats"
            />
            {!isHovered && (
                <Search className="w-4 h-4 font-semibold text-gray-600 absolute left-2 top-1/2 -translate-y-1/2 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
            )}
            <div className="absolute right-2 group-hover:scale-x-105 font-bold group-hover:translate-y-0.5] scale-3d top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 group-hover:shadow-sm">
                <Command className="w-3 h-3  text-gray-900" />
                <span className="text-xs  text-gray-900 ">K</span>
            </div>
        </div>
    );
}