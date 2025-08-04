import React, { useState } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}
const fileUploader = ({onFileSelect}:FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const onDrop=useCallback((acceptedFiles:File[])=>{
        const file = acceptedFiles[0] || null
        setSelectedFile(file)
        onFileSelect?.(file)
    },[onFileSelect])   

    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    const {getRootProps,getInputProps,isDragActive}=useDropzone({
            onDrop,
            multiple:false,
            accept:{'application/pdf':['.pdf']},
            maxSize:maxFileSize,
        })



  return (
    <div className='w-full gradient-border'>
        <div {...getRootProps()} >
            <input {...getInputProps()}/>
            <div className='space-y-4 cursor-pointer'>
              
                {selectedFile?(
                   <div className='uploader-selected-file' onClick={(e)=>e.stopPropagation()}>
                        <img src="/images/pdf.png" className='size-10'/>
                        <div className=' item-center space-x-3'>
                            <div>
                                <p className='text-lg text-gray-700 font-medium truncate max-w-xs'>{selectedFile.name}</p>
                                <p className='text-sm text-gray-500'>{formatSize(selectedFile.size)}</p>
                            </div>
                        </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                onFileSelect?.(null)
                            }}>
                            <img src="/icons/cross.svg" className='size-5'/>
                        </button>
                    </div>
                ):(
                <div>  
                    <div className='mx-auto w-16 h-16 flex items-center justify-center mb-5'>
                        <img src="/icons/info.svg" className='suze-20'/>
                    </div>
                    <p className='text-lg text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                    <p className='text-lg text-gray-500'>PDF  (max 20MB)</p>
                </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default fileUploader