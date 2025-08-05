import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'
import { usePuterStore } from '~/lib/puter'

const ResumeCard = ({resume:{id,companyName,jobTitle,feedback,imagePath }}: {resume:Resume}) => {
    const {auth,isLoading,fs} = usePuterStore()
    const [resumes, setResumes] = useState<string>('')
    useEffect(()=>{
        const loadResume = async ()=>{
        const blob = await fs.read(imagePath)
        if(!blob){
            console.error("Resume image not found")
            return
        }
        let url = URL.createObjectURL(blob)
        setResumes(url)
        }
        loadResume()
    },[imagePath])
    return (
        <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000'>
            <div className='resume-card-header'>
                <div className='flex flex-col gap-2'>
                    {companyName && (
                        <h2 className="!text-black font-old berak-words">
                            {companyName}
                        </h2>
                    )}
                    {
                        jobTitle&&(
                            <h3 className='text-lg break-words tex-gray-500'>
                                {jobTitle}
                            </h3>
                        )
                    }{
                        !companyName && !jobTitle && (
                            <h2 className='!text-black font-bold'>
                                Resume
                            </h2>
                        )
                    }
                 
                </div>
                <div className='flex-shink-0'>
                    <ScoreCircle score={feedback.overallScore}/>
                </div>
            </div>
            {
                resumes && (
                <div className='gradient-border aniamte-in fade-in durarion-1000'>
                    <div className='w-full h-full'>
                        <img src={resumes} alt="resume" className='w-full h-[350px] max-sm:h-[200px] object-cover object-top'/>
                    </div>
                </div>
                )
            }
           
        </Link>
    )
}

export default ResumeCard

