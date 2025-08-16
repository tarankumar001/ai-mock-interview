import { InterviewPin } from '@/components/pin';
import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CustomBreadCrumb } from '@/components/ui/custom-bread-crumb';
import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { Lightbulb, Sparkles, WebcamIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Webcam from "react-webcam"; // ✅ actual webcam component

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

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
    <div className="flex flex-col w-full gap-9 py-5">
      <div className="flex items-center justify-between w-full gap-2"> 
        <CustomBreadCrumb
          breadCrumbPage={interview?.position || ""}
          breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}  
        />

        <Link to={`/generate/interview/${interviewId}/start`}>
          <Button size={"sm"}>
            Start <Sparkles />
          </Button>
        </Link>
      </div>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Alert className="bg-yellow-100/50 border-yellow-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <div>
          <AlertTitle className="text-yellow-800 font-semibold">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-sm text-yellow-700 mt-1">
            Please enable your webcam and microphone to start the AI-generated
            mock interview. The interview consists of five questions. You’ll
            receive a personalized report based on your responses at the end.{" "}
            <br />
            <br />
            <span className="font-medium">
              Note: Your video is <strong>never recorded</strong>. You can disable your webcam at any time.
            </span>
          </AlertDescription>
        </div>
      </Alert>

      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
          {isWebCamEnabled ? (
            <Webcam
              onUserMedia={() => setIsWebCamEnabled(true)}
              onUserMediaError={() => setIsWebCamEnabled(false)}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}>
          {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </Button>
      </div>
    </div>
  );
};
