import React, { useState } from 'react'
import type { Interview } from "../types";
import { useNavigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { Badge } from './ui/badge';
import { Card, CardTitle, CardDescription, CardFooter } from './ui/card';
import { cn } from '@/lib/utils';

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({ interview, onMockPage = false }: InterviewPinProps) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all">
      {/* Removed space-y-4, replaced with controlled flex spacing */}
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
            {`${new Date(interview.createdAt.toDate()).toLocaleDateString("en-US", {
              dateStyle: "long",
            })} - ${new Date(interview.createdAt.toDate()).toLocaleTimeString("en-US", {
              timeStyle: "short",
            })}`}
          </p>

          {!onMockPage&&(
            <div className='flex items-center justify-center'>
              
            </div>
          )}

        </CardFooter>
      </div>
    </Card>
  );
};
