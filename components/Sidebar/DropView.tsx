import React, { useState } from 'react'

type Props = {
  title: string,
  chats: Array<string>
  setSelectedPinned?: () => void
}

declare enum STRING_SIZE {
  SIZE = 24
}

const DropView = (props: Props) => {

  const [pinned, setPinned] = useState<number | null>(null);


  return (
    <div className='flex flex-col items-center relative min-h-full'>
      <div className='min-w-full min-h-full bg-gradient-to-b from-white/0 to-white/70 absolute inset-0' />
      <title className='uppercase text-gray-400 font-semibold text-sm mt-4 mb-4'>{props.title}</title>
      <div className="flex flex-col gap-4 items-center text-start font-medium text-sm text-gray-600">
        {
          props.chats.map((chat: any, idx: number) => (
            <p>{chat.substring(0, STRING_SIZE.SIZE)}...</p>
          ))
        }
      </div>
    </div>
  )
}

export default DropView