import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Interview } from './types';
import { db } from './config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { FormMockInterview } from './containers/form-mock-interview';

export const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;
      try {
        const docRef = doc(db, 'interviews', interviewId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInterview(docSnap.data() as Interview);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInterview();
  }, [interviewId]);

  return <div className="my-4 flex-col w-full"><FormMockInterview
  initialData={interview}
  /></div>;
};
