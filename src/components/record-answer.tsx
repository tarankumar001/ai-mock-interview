import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText, { type ResultType } from 'react-hook-speech-to-text';
import { useNavigate, useParams } from 'react-router';
import { CircleStop, Loader, Mic, RefreshCw, Save, Video, VideoOff, WebcamIcon, Home, Eye, ArrowRight } from 'lucide-react';
import { TooltipButton } from './ui/tool-tip';
// chatSession now imported dynamically where needed to support retry wrapper
import { toast } from 'sonner';
import { SaveModal } from './save-modal';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { Button } from './ui/button';

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  onAnswerSaved?: () => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({ question, isWebCam, setIsWebCam, onAnswerSaved }: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answerSaved, setAnswerSaved] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", { description: "Your answer should be more than 30 characters" });
        return;
      }

      const aiRes = await generateResult(question.question, question.answer, userAnswer);
      console.log(aiRes);
      setAiResult(aiRes);
    } else {
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim().replace(/(json|```|`)/g, "");
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (qst: string, qstAns: string, userAns: string): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResult = await (await import('@/scripts')).sendMessageWithRetry(prompt);
      if (!aiResult) {
        throw new Error('AI response was empty');
      }
      const parsedResult: AIResponse = cleanJsonResponse(aiResult.response.text());
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast.error("Error", { description: "An error occurred while generating feedback." });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
    setAnswerSaved(false);
  };

  const saveUserAnswer = async () => {
    console.log("Save button clicked, aiResult:", aiResult);
    setLoading(true);
    
    if (!aiResult) {
      console.error("No AI result available");
      toast.error("Error", { description: "No feedback available to save. Please record and analyze your answer first." });
      setLoading(false);
      return;
    }

    if (!userId) {
      console.error("No user ID available");
      toast.error("Error", { description: "User not authenticated. Please sign in again." });
      setLoading(false);
      return;
    }

    if (!interviewId) {
      console.error("No interview ID available");
      toast.error("Error", { description: "Interview session not found. Please refresh the page." });
      setLoading(false);
      return;
    }

    const currentQuestion = question.question;

    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        console.log("Query Snap Size", querySnap.size);
        toast.info("Already Answered", { description: "You have already answered this question" });
        return;
      } else {
        const docRef = await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        console.log("Answer saved successfully with ID:", docRef.id);
        toast("Saved", { description: "Your answer has been saved successfully!" });
        setAnswerSaved(true);
        
        // Notify parent component that answer was saved
        if (onAnswerSaved) {
          onAnswerSaved();
        }
      }

      setUserAnswer("");
      stopSpeechToText();

    } catch (error) {
      console.error("Error saving user answer:", error);
      toast.error("Error", { description: "An error occurred while saving your answer. Please try again." });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const goToDashboard = () => {
    navigate("/generate");
  };

  const viewFeedback = () => {
    navigate(`/generate/feedback/${interviewId}`);
  };

  useEffect(() => {
    const combinedTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join("");
    setUserAnswer(combinedTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-4 sm:gap-8 mt-4">
      <SaveModal isOpen={open} onClose={() => setOpen(false)} onConfirm={saveUserAnswer} loading={loading} />

      {/* Webcam Section */}
      <div className="w-full h-[300px] sm:h-[400px] md:w-96 flex flex-col items-center justify-center border p-2 sm:p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          // Live webcam feed
          <div className="w-full h-full flex items-center justify-center">
            <Webcam
              audio={false}
              mirrored
              className="w-full h-full object-cover rounded-md"
              videoConstraints={{ facingMode: 'user' }}
              onUserMediaError={(err) => {
                console.error('Webcam error', err);
                // show a simple error state
                // Note: we keep this local; more sophisticated UI can be added later
              }}
            />
          </div>
        ) : (
          <WebcamIcon className="min-w-20 min-h-20 sm:min-w-24 sm:min-h-24 text-muted-foreground" />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={isWebCam ? <VideoOff className="min-w-5 min-h-5" /> : <Video className="min-w-5 min-h-5" />}
          onClick={() => setIsWebCam(!isWebCam)}
        />
        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop className="min-w-5 min-h-5" /> : <Mic className="min-w-5 min-h-5" />}
          onClick={recordUserAnswer}
        />
        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />
        <TooltipButton
          content="Save Result"
          icon={isAiGenerating ? <Loader className="min-w-5 min-h-5 animate-spin" /> : <Save className="min-w-5 min-h-5" />}
          onClick={() => setOpen(true)}
          disabled={!aiResult || isAiGenerating}
        />
      </div>

      {/* Answer Section */}
      <div className="w-full mt-4 p-3 sm:p-4 border rounded-md bg-gray-50">
        <h2 className="text-base sm:text-lg font-semibold mb-2">Your Answer</h2>
        <div className="min-h-[60px]">
          <p className="text-sm mt-2 text-gray-700 whitespace-pre-wrap break-words">
            {userAnswer || "Start recording to see your answer here"}
          </p>
          {interimResult && (
            <p className="text-sm text-gray-500 mt-2">
              <strong>Current Speech:</strong> {interimResult}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Section - Show after answer is saved */}
      {answerSaved && (
        <div className="w-full mt-4 p-4 border rounded-md bg-emerald-50 border-emerald-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-800">Answer Saved Successfully!</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={goToDashboard}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="min-w-4 min-h-4" />
              Back to Dashboard
            </Button>
            <Button
              onClick={viewFeedback}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 w-full sm:w-auto"
            >
              <Eye className="min-w-4 min-h-4" />
              View Feedback
            </Button>
            <Button
              onClick={() => setAnswerSaved(false)}
              variant="ghost"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowRight className="min-w-4 min-h-4" />
              Continue Interview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
