import React, { use, type FormEvent } from 'react'
import Navbar from '~/components/navbar'
import {useState} from 'react'
import FileUploader from '~/components/fileUploader'
const upload = () => {
    const [isProcessing,setIsProcessing] = useState(false)
    const [statusText,setStatusText] = useState("")
    const [file,setFile] = useState<File | null>(null)

    const handlelFileSelect =(file:File | null)=>{
        setFile(file)
    }
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form = e.currentTarget.closest('form')
        if(!form || !file) return
        const formData = new FormData(form)

        const companyName = formData.get('companyName')?.toString() || ''
        const jobTitle = formData.get('jobTitle')?.toString() || ''
        const jobDescription = formData.get('jobDescription')?.toString() || ''

        console.log('Company Name:', companyName)
        console.log('Job title:', jobTitle)
        console.log('Job Description:', jobDescription)
        console.log('File', file)
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>
        
            <section className="main-section">
                <div className='page-heading py-16'>
                    <h1>Smart Feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className='w-full'/>
                        </>
                    ):(
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                            <div className='form-div'>
                                <label htmlFor='company-name'>Company Name</label>
                                <input type="text" id='company-name' name='companyName' placeholder='Company Name' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor='job-title'>Job Title</label>
                                <input type="text" id='job-title' name='jobTitle' placeholder='Job Title' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor='job-description'>Job Description</label>
                                <textarea rows={5} id='job-description' name='jobDescription' placeholder='Job Description' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handlelFileSelect}/>
                            </div>
                            <button className='primary-button w-fit' type='submit'>Analyze</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default upload