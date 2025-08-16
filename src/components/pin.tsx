import { useState } from 'react'
import type { Interview } from "../types";
import { useNavigate } from 'react-router';
import { Badge } from './ui/badge';
import { Card, CardTitle, CardDescription, CardFooter } from './ui/card';
import { cn } from '@/lib/utils';
import { TooltipButton } from './ui/tool-tip';
import { Eye, Newspaper, Pencil, Sparkles, Trash2 } from "lucide-react";
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { toast } from 'sonner';

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({ interview, onMockPage = false }: InterviewPinProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all">
      <div className="flex flex-col gap-3.5"> 
        <CardTitle className="text-lg mb-0">{interview?.position}</CardTitle>
        <CardDescription className="mt-0">{interview?.description}</CardDescription>
        
        <div className="w-full flex items-center gap-2 flex-wrap mt-1"> 
          {interview.techStack.split(',').map((word, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {word.trim()}
            </Badge>
          ))}
        </div>

        <CardFooter
          className={cn(
            "w-full flex items-center p-0 mt-1",
            onMockPage ? "justify-end" : "justify-between"
          )}
        >
          <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
            {`${interview.createdAt && 'toDate' in interview.createdAt ? new Date(interview.createdAt.toDate()).toLocaleDateString("en-US", {
              dateStyle: "long",
            }) : 'Unknown date'} - ${interview.createdAt && 'toDate' in interview.createdAt ? new Date(interview.createdAt.toDate()).toLocaleTimeString("en-US", {
              timeStyle: "short",
            }) : 'Unknown time'}`}
          </p>

          {!onMockPage && (
            <div className='flex items-center justify-center'>
              <TooltipButton
                content="Edit"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/${interview.id}`, { replace: true }); // ✅ fixed
                }}
                disabled={false}
                buttonClassName="hover:text-sky-500"
                icon={<Pencil />} // ✅ icon works now
                loading={false}
              />
              <TooltipButton
                content="view"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/${interview.id}`, { replace: true }); // ✅ fixed
                }}
                disabled={false}
                buttonClassName="hover:text-red-500"
                icon={<Eye />} // ✅ icon works now
                loading={false}
              />
              <TooltipButton
                content="Feedback"
                buttonVariant="ghost"
              onClick={() => {
                navigate(`/generate/feedback/${interview?.id}`, {
                  replace: true,
                });
              }}
                disabled={false}
                buttonClassName="hover:text-yellow-500"
                icon={<Newspaper />} // ✅ icon works now
                loading={false}
              />
              <TooltipButton
                content="Start"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/interview/${interview.id}`, { replace: true }); // ✅ fixed
                }}
                disabled={false}
                buttonClassName="hover:text-sky-500"
                icon={<Sparkles />} // ✅ icon works now
                loading={false}
              />
              <TooltipButton
                content="Delete"
                buttonVariant="ghost"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this interview?')) {
                    setLoading(true);
                    const interviewRef = doc(db, 'interviews', interview.id);
                    deleteDoc(interviewRef)
                      .then(() => {
                        toast.success('Interview deleted successfully!');
                        // Don't redirect - stay on current page
                      })
                      .catch((error) => {
                        toast.error('Error deleting interview:', error);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }
                }}
                disabled={loading}
                buttonClassName="hover:text-red-500"
                icon={<Trash2 />} // ✅ icon works now
                loading={loading}
              />
            </div>
          )}

        </CardFooter>
      </div>
    </Card>
  );
};
