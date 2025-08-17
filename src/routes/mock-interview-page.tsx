import { CustomBreadCrumb } from '@/components/ui/custom-bread-crumb';
import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc,  getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, X } from 'lucide-react';
import { QuestionSection } from '@/components/question-section';
import { Button } from '@/components/ui/button';

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

  const exitInterview = () => {
    navigate("/generate");
  };

  return (
    <div className='flex flex-col w-full gap-4 sm:gap-8 py-3 sm:py-5 px-2 sm:px-0'>
        <div className="flex items-center justify-between w-full">
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
          
          {/* Quick Exit Button */}
          <Button
            onClick={exitInterview}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
          >
            <X className="w-4 h-4" />
            Exit Interview
          </Button>
        </div>

      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-3 sm:p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <AlertTitle className="text-sky-800 font-semibold text-sm sm:text-base">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm text-sky-700 mt-1 leading-relaxed">
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

      {interview?.questions && interview?.questions.length > 0 && (
        <div className="mt-2 sm:mt-4 w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview?.questions}/>
        </div>
      )}
    </div>
  )
}
