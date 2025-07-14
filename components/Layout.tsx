"use client"

import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "./Sidebar/SidebarContext"
import LayoutView from "./Chat/LayoutView"
import { Geist } from "next/font/google";

type FontType = ReturnType<typeof Geist> & { variable: string };

type Props = {
    geistSans: FontType,
    geistMono: FontType,
    inter: FontType
}

const Layout = ({children,props}:{children: React.ReactNode,props: Props}) => {
  return (
      <SessionProvider>
        <body
          className={`${props.geistSans.variable} ${props.geistMono.variable} ${props.inter.variable} antialiased bg-[var(--gray)]`}
        >
          <SidebarProvider>
            <LayoutView children={children} />
          </SidebarProvider>
        </body>
      </SessionProvider>
  )
}

export default Layout