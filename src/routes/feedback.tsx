import type { Interview, UserAnswer } from '@/types';
import { useAuth } from '@clerk/clerk-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router';

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate()
  return (
    <div>Feedback</div>
  )
}
