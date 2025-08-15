import React from 'react'
import type { Interview } from "../types";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({ interview, onMockPage = false }: InterviewPinProps) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{interview.position}</h3>
      <p className="text-sm text-gray-600 mb-2">{interview.description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{interview.experience} years exp</span>
        <span>•</span>
        <span>{interview.techStack}</span>
      </div>
      {onMockPage && (
        <div className="mt-3 text-xs text-gray-500">
          {interview.questions.length} questions
        </div>
      )}
    </div>
  )
}
