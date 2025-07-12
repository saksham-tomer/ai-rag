import FetchBufferData from '@/lib/FetchBufferData'
import { S3Config } from '@/lib/S3Config'
import { FileIcon, Paperclip, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface DragDropProps {
  onFileSelect?: (file: File) => void
  acceptedFileTypes?: string[] 
  maxFileSize?: number
  className?: string 
}

const DragDrop: React.FC<DragDropProps> = ({ 
  onFileSelect, 
  acceptedFileTypes = ['.pdf'], 
  maxFileSize = 10 * 1024 * 1024, 
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    console.log("the files are ",e)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileValidation(files[0])
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileValidation(files[0])
    }
    e.target.value = ''
  }

  const handleFileValidation = async (file: File) => {

    const isValidType = acceptedFileTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    )
    
    if (!isValidType) {
      alert(`Please upload a valid file type: ${acceptedFileTypes.join(', ')}`)
      return
    }

    if (file.size > maxFileSize) {
      alert(`File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`)
      return
    }

    setIsUploading(true)
    
    try {
      if (onFileSelect) {
        await onFileSelect(file)
      }
      const fileBuffer = await file.arrayBuffer()
      let key = await S3Config.uploadObject(file.name, Buffer.from(fileBuffer), file.type)
      if(key){
       let doc =  await FetchBufferData(key)
       console.log("got the document splitted back",doc)
      }
      setTimeout(() => {
        router.push(key)
      }, 100)
      
    } catch (error) {
      console.error('File upload error:', error)
      alert('An error occurred while uploading the file. Please try again.')
      setIsUploading(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === fileInputRef.current) return
    fileInputRef.current?.click()
  }

  return (
    <div 
      className={`relative mt-12 mx-auto max-w-[60rem] shadow-xl flex flex-col items-center justify-center p-8 border-2 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 hover:from-blue-50 hover:to-blue-100/50 border-dashed w-full border-gray-300/40 hover:border-blue-400/60 transition-all duration-300 ease-in-out group cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-50' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        ref={fileInputRef}
        type="file"
        name="file"
        id="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <FileIcon className={`w-16 h-16 transition-all duration-300 ease-in-out ${
            isDragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-105'
          }`} />
          <Upload className={`absolute -bottom-1 -right-1 w-6 h-6 p-1 bg-blue-500 text-white rounded-full transition-all duration-300 ${
            isDragOver ? 'scale-110' : 'group-hover:scale-105'
          }`} />
        </div>
        
        <div className="text-center space-y-2">
          <p className={`text-lg font-semibold transition-all duration-300 ${
            isDragOver ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
          }`}>
            {isUploading ? 'Processing...' : isDragOver ? 'Drop your file here' : 'Upload your PDF'}
          </p>
          <p className="text-sm text-gray-500">
            {isUploading ? 'Please wait while we process your file' : 'Drag and drop or click to browse'}
          </p>
          <p className="text-xs text-gray-400">
            Max file size: {Math.round(maxFileSize / (1024 * 1024))}MB
          </p>
        </div>
        
        {isUploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DragDrop