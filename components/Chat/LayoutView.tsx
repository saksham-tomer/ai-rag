"use client"

import { useSidebar } from "../Sidebar/SidebarContext";
import SidebarView from "../Sidebar/SidebarView";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function LayoutView({ children }: LayoutProps) {
    const { isOpen } = useSidebar();

    return (
        <div className="flex min-h-screen">
            <SidebarView />
            <main className={`flex-1 ${isOpen ? "ml-80" : "ml-0"} p-4`}>
                {children}
            </main>
        </div>
    );
}