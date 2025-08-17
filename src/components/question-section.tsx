import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import { TooltipButton } from "./ui/tool-tip";
import { Volume2, VolumeX, CheckCircle, Eye, Home } from "lucide-react";
import { RecordAnswer } from "./record-answer"
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";

interface QuestionSectionProps {
  questions: {question: string; answer: string}[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [isPlaying,setIsPlaying]=useState(false);
  const [isWebCam,setIsWebCam]=useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  const [currentSpeech,setCurrentSpeech]=useState<SpeechSynthesisUtterance | null>(null)
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const handlePlayQuestion = (qst: string) => {
    if(isPlaying && currentSpeech){
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    }else{
      if("speechSynthesis" in window){
        const speech=new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true)
        setCurrentSpeech(speech);

        speech.onend=()=>{
          setIsPlaying(false);
          setCurrentSpeech(null);
        }
      }
    }
  };

  const markQuestionCompleted = (questionText: string) => {
    setCompletedQuestions(prev => new Set([...prev, questionText]));
  };

  const goToDashboard = () => {
    navigate("/generate");
  };

  const viewFeedback = () => {
    navigate(`/generate/feedback/${interviewId}`);
  };

  const isInterviewComplete = completedQuestions.size === questions.length;
  
  return (
    <div className="w-full min-h-96 border rounded-md p-2 sm:p-4 overflow-hidden">
      {/* Progress Section */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Interview Progress</span>
          <Badge variant="secondary" className="text-xs">
            {completedQuestions.size} of {questions.length} completed
          </Badge>
        </div>
        <Progress 
          value={(completedQuestions.size / questions.length) * 100} 
          className="h-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {questions.length - completedQuestions.size} question{questions.length - completedQuestions.size !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Completion Summary */}
      {isInterviewComplete && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-800">Interview Complete! 🎉</h3>
          </div>
          <p className="text-emerald-700 mb-4">
            Congratulations! You've completed all {questions.length} questions. You can now view your detailed feedback or return to the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={viewFeedback}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 w-full sm:w-auto"
            >
              <Eye className="w-4 h-4" />
              View Feedback
            </Button>
            <Button
              onClick={goToDashboard}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}

      <Tabs 
        defaultValue={questions[0]?.question} 
        className="w-full"
        onValueChange={() => {}}
      >
        <div className="overflow-x-auto">
          <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-2 sm:gap-4 mb-4 min-w-max">
            {questions?.map((tab, i) => (
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap flex-shrink-0",
                  completedQuestions.has(tab.question) && "bg-green-100 border-green-300"
                )}
                key={tab.question}
                value={tab.question}
              >
                {`Q${i + 1}`}
                {completedQuestions.has(tab.question) && (
                  <CheckCircle className="w-3 h-3 ml-1 text-green-600" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {questions?.map((tab, i) => (
          <TabsContent key={i} value={tab.question} className="mt-0 w-full">
            <div className="space-y-4 w-full">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base text-left tracking-wide text-neutral-700 leading-relaxed break-words">
                  {tab.question}
                </p>
              </div>

              <div className="w-full flex items-center justify-end">
                <TooltipButton
                  content={isPlaying ? "Stop" : "Start"}
                  icon={
                    isPlaying ? (
                      <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                    )
                  }
                  onClick={() => handlePlayQuestion(tab.question)}
                />
              </div>

              <RecordAnswer 
                question={tab} 
                isWebCam={isWebCam}
                setIsWebCam={setIsWebCam}
                onAnswerSaved={() => markQuestionCompleted(tab.question)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
   );
 }