import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { usePuterStore } from '~/lib/puter'
import Summary from '~/components/summary'
import ATS from '~/components/ats'
import Details from '~/components/detail'
export const meta =()=>([ 
    {title: 'Resumind | Review'},
    {name:'description', content: 'Detailed analysis of your resume with AI feedback.'},
])

const resume = () => {
    const {id} = useParams()
    const{auth,isLoading,fs,kv}=usePuterStore()
    const [imageUrl, setImageUrl] = React.useState<string | null>(null)
    const [resumeUrl, setResumeUrl] = React.useState<string | null>(null)   
    const [feedback, setFeedback] = React.useState<Feedback | null>(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if(!isLoading && !auth.isAuthenticated){
            navigate(`/auth?next=resume/${id}`)
        }
    },[isLoading])

    useEffect(()=>{
        const loadResume = async()=>{
            const resume = await kv.get(`resume:${id}`)
            if(!resume){
                console.error("Resume not found")
                return  
            }
            const data = JSON.parse(resume)
            const resumeBlob = await fs.read(data.resumePath)
            if(!resumeBlob){
                console.error("Resume file not found")
                return
            }
            const pdfBlob=new Blob([resumeBlob],{type:'application/pdf'})
            const resumeUrl= URL.createObjectURL(pdfBlob)
            setResumeUrl(resumeUrl)

            const imageBlob = await fs.read(data.imagePath)
            if(!imageBlob){
                console.error("Resume image not found")
                return
            }
            const imageUrl = URL.createObjectURL(imageBlob)
            setImageUrl(imageUrl)
            setFeedback(data.feedback)
        }
        loadResume()
    },[id])
  return (
    <main className='!pt-0'>
        <nav className='resume-nav'>
            <Link to="/" className='back-button'>
                <img src="/icons/back.svg" className='w-2.5 h-2.5'/>
                <span className='text-gray-800 text-sm font-semibold'>Back to Home</span>
            </Link>
        </nav>
        <div className='flex flex-row w-full max-lg:flex-col-reverse'>
            <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                 {imageUrl && resumeUrl &&(
                    <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit'>
                        <a href={resumeUrl} target='_blank' >
                            <img src={imageUrl} className='w-full h-full object-contain rounded-2xl ' title="resume"/>
                        </a>
                    </div>
                )}
            </section>
            <section className='feedback-section'>
                <h2 className='text-4xl !text-back font-bold'>Resume Review</h2>
                {feedback?(
                    <div>
                        <div className='flex flex-col gap-8 aniamte-in fade-in duration-1000'>
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            <Details feedback={feedback}/>
                        </div>
                    </div>
                ):(
                    <div>
                        <img src="/images/resume-scan-2.gif" className='w-full'/>
                    </div>
                )}
            </section>
        </div>
    </main>
  )
}

export default resume