import React, { use, type FormEvent } from 'react'
import Navbar from '~/components/navbar'
import {useState} from 'react'
import FileUploader from '~/components/fileUploader'
import { usePuterStore } from '~/lib/puter'
import {convertPdfToImage} from "~/lib/pdf2img";
import { useNavigate } from 'react-router'
import { generateUUID } from '~/lib/utils'
import { prepareInstructions } from '../../constants'

const upload = () => {
    const [isError,setIsError] = useState(false)
    const {auth,isLoading,fs,ai,kv}=usePuterStore()
    const navigate = useNavigate()
    const [isProcessing,setIsProcessing] = useState(false)
    const [statusText,setStatusText] = useState("")
    const [file,setFile] = useState<File | null>(null)

    const handlelFileSelect =(file:File | null)=>{
        setFile(file)
    }

    const refreshPage = () => {
        setIsError(false)
        setIsProcessing(false) 
        setStatusText("")
        setFile(null) 
    }

    const handleAnalyze= async (
        {companyName,jobTitle,jobDescription,file}:
        {companyName:string,jobTitle:string,jobDescription:string,file:File}
    )=>{
        setIsProcessing(true)
        setStatusText("Uploading your file...")
        const uploadedFile = await fs.upload([file])
        if(!uploadedFile){
            setIsError(true)
            setIsProcessing(false)
            return setStatusText("Failed to upload file. Please try again.")
        }

        setStatusText("Converting your file to image ...")
        console.log(file);
        const imageFile= await convertPdfToImage(file)
        console.log(imageFile);
        if(!imageFile.file){
            setIsError(true)
            setIsProcessing(false)
            return setStatusText("Failed to convert pdf file to image. Please try again.")
        }
        setStatusText("Uploading your image...")
        const uploadedImage = await fs.upload([imageFile.file])
        if(!uploadedImage) {
            setIsError(true)
            setIsProcessing(false)
            return  setStatusText("Failed to upload image. Please try again.");
        }
        setStatusText("Analyzing your resume...")
        const uuid = generateUUID()
        const data ={
            id:uuid,
            resumePath:uploadedFile.path,
            imagePath:uploadedImage.path,
            companyName,jobTitle,jobDescription,
            feedback:'',
        }
        await kv.set(uuid,JSON.stringify(data))
        setStatusText("Saving your resume data...")
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription})
        )
        if(!feedback){
            setIsError(true)
            setIsProcessing(false)
            return setStatusText("Failed to analyze your resume. Please try again.")
        }
        const feedbackTest=typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text
        data.feedback=JSON.parse(feedbackTest)
        await kv.set(uuid,JSON.stringify(data))
        setStatusText("Done! Redirecting to your resume...")
        console.log(data)
    
    }
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form = e.currentTarget.closest('form')
        if(!form || !file) return
        const formData = new FormData(form)

        const companyName = formData.get('companyName')as string
        const jobTitle = formData.get('jobTitle')as string
        const jobDescription = formData.get('jobDescription')as string

       if(!file) return;
        handleAnalyze({companyName,jobTitle,jobDescription,file})
       
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
                    ):isError && !isProcessing ?(
                        <>
                        <h2 className='!text-red-600'>{statusText}</h2>
                        <button className='primary-button w-fit' onClick={refreshPage}>Back</button>
                        </>
                    ):(
                        <h2 >Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && !isError &&(
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