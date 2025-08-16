import { InterviewPin } from '@/components/pin';
import { Button } from '@/components/ui/button';
import { CustomBreadCrumb } from '@/components/ui/custom-bread-crumb';
import { db } from '@/config/firebase.config';
import type { Interview } from '@/types'
import { LoaderPage } from '@/views/loader-page';
import { doc, getDoc } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';
import React, { useEffect, useState }from 'react'
import { Link, Navigate, useParams } from 'react-router'

export const  MockLoadPage = () => {

    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);


    if (!interviewId) {
        navigate("/generate", { replace: true });
      }

      useEffect(() => {
        const fetchInterview = async () => {
          if (!interviewId) return;
          try {
            const docRef = doc(db, 'interviews', interviewId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const interviewData = docSnap.data() as Interview;
              // Manually add the document ID to the interview data
              setInterview({ ...interviewData, id: docSnap.id });
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchInterview();
      }, [interviewId]);


      if(isLoading){
        return <LoaderPage className='w-full h-[70vh]'/>
      }
    



  return (
    <div className='flex flex-col w-full gap-9 py-5'>
        <div className="flex items-center justify-between w-fll gap-2"> 
            <CustomBreadCrumb
            breadCrumbPage={interview?.position ||""}
            breadCrumpItems={[{label:"Mock Interviews",links:"/generate"}]}  
            />

          <Link to={`/generate/interview/${interviewId}/start`}>
          <Button size={"sm"}>
            Start <Sparkles />
          </Button>
        </Link>

        </div>
        {interview && <InterviewPin interview={interview} onMockPage />}


    </div>
  )
}
