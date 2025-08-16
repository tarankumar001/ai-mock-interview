import { CustomBreadCrumb } from '@/components/ui/custom-bread-crumb';
import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc,  getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import { QuestionSection } from '@/components/question-section';

export const MockInterviewPage = () => {

    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
    return null;
  }

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;
      try {
        const docRef = doc(db, 'interviews', interviewId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const interviewData = docSnap.data() as Interview;
          setInterview({ ...interviewData, id: docSnap.id });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInterview();
  }, [interviewId]);

  return (
    <div className='flex flex-col w-full ggap-8 py-5'>
        <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />



      <div className="w-full">
      <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>

      </div>
      {interview?.questions && interview?.questions.length>0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
            <QuestionSection questions={interview?.questions}/>
        </div>
      )}

    </div>
  )
}
