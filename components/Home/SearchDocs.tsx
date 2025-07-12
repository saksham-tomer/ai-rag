import { Send } from 'lucide-react'
import React, { useState, ChangeEvent } from 'react'

interface SearchDocsProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchDocs: React.FC<SearchDocsProps> = ({ 
  onSearch,
  placeholder = 'How can I help you?'
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='relative min-w-full'>
      <input 
        name='search'
        id='search'
        type='text'
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className='w-full shadow-md rounded-2xl p-4 pr-12 outline-none placeholder:text-gray-500 focus:ring-2 ring-2 bg-white ring-gray-200/80 focus:ring-indigo-300 focus-within:ring-2 focus-within:ring-indigo-300 transition-all duration-300 ease-in text-sm text-gray-500'
      />
      <button 
        onClick={handleSubmit}
        className='absolute right-2 top-1/2 -translate-y-1/2 shadow-md  p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200'
      >
        <Send className='w-4 h-4 text-white fill-white'/>
      </button>
    </div>
  )
}

export default SearchDocs