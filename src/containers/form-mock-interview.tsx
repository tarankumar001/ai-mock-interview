import type { Interview } from "@/types"

interface FormMockInterviewPorps{
    initialData:Interview | null
}


export const FormMockInterview = ({initialData}:FormMockInterviewPorps) => {
  return (
    <div>FormMockInterview</div>
  )
}