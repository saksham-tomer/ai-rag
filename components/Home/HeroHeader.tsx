import React from 'react'
import SearchDocs from './SearchDocs'

interface HeroHeaderProps {
  userName?: string;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ userName = 'User' }) => {
  return (
    <section className='relative mt-12 flex flex-col items-center mx-auto p-14 xl:p-16 w-full max-w-[60rem] rounded-3xl shadow-xl  ring-2 ring-gray-300/40 hover:ring-indigo-300 transition-all duration-300 ease-in-out overflow-hidden'>
        <div className='absolute inset-0 bg-white/30 backdrop-blur-xl'></div>
        <div className='absolute transform translate-y-1/2 -bottom-28 w-[25rem] h-[25rem] bg-indigo-600/90 rounded-full opacity-50 blur-2xl'></div>
        <div className='absolute transform translate-y-1/2 -bottom-20 w-[35rem] h-[35rem] bg-indigo-600/30 rounded-full opacity-50 blur-2xl'></div>
        
        <main className='relative z-10 flex flex-col items-center gap-2 justify-center'>
            <h1 className='text-2xl font-semibold'>Welcome Back, {userName}</h1>
            <p className='text-gray-500/80  mb-4'>Your Personal Summary Assistant At Your Command</p>
            <SearchDocs />
        </main>
    </section>
  )
}

export default HeroHeader