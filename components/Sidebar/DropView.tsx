"use client"

import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
  title: string,
  chats: Array<string>
  setSelectedPinned?: () => void
}

enum STRING_SIZE {
  SIZE = 34
}

const DropView = (props: Props) => {
  const [pinned, setPinned] = useState<number | null>(null);

  return (
    <div className='flex flex-col group items-start relative min-h-full'>
      <div className='min-w-full min-h-full bg-gradient-to-b from-white/0 to-white/70 absolute inset-0' />
      <h3 className='uppercase text-gray-400 font-semibold text-sm mt-4 mb-4'>{props.title}</h3>
      <div className="flex flex-col gap-6 items-center text-start font-medium text-sm text-gray-600">
        {
          props.chats.map((chat: string, idx: number) => (
            <p className='cursor-pointer' key={idx}>{chat.substring(0, STRING_SIZE.SIZE)}...</p>
          ))
        }
      </div>
      <PlusIcon className="hidden group-hover:block w-10 h-10 rounded-full text-gray-500 absolute right-1/2 bottom-2 hover:bg-gray-100 p-2 border-dashed border-gray-300 shadow-lg border-2 transition-all duration-200 ease-in-out hover:scale-110" />
    </div>
  )
}

export default DropView