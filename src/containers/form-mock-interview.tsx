import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

// chatSession now imported dynamically where needed to support retry wrapper
import { db } from "@/config/firebase.config";
import { addDoc, collection, doc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";

import type { Interview } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Loader, Trash2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Headings } from "@/components/headings";
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100, "Max 100 characters"),
  description: z.string().min(10, "Description is required"),
  experience: z.number().min(0, "Experience cannot be negative"),
  techStack: z.string().min(1, "Tech stack is required")
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: initialData?.position || "",
      description: initialData?.description || "",
      experience: initialData?.experience || 0,
      techStack: initialData?.techStack || ""
    },
    mode: "onChange"
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData ? initialData.position : "Create a new mock interview";
  const breadCrumbPage = initialData ? initialData.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully." }
    : { title: "Created..!", description: "New Mock Interview created." };


    const cleanAiResponse = (response: string) => {
      let cleanText = response.trim();

      // Step 1: Remove markdown code blocks completely
      cleanText = cleanText.replace(/```json\s*|\s*```/g, "");

      // Step 2: Remove any remaining "json" text
      cleanText = cleanText.replace(/json/g, "");

      // Step 3: Extract a JSON array by capturing text between square brackets
      const jsonArrayMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        cleanText = jsonArrayMatch[0];
      } else {
        throw new Error("No JSON array found in response");
      }
      
      // Step 4: Clean up any extra whitespace and newlines
      cleanText = cleanText.trim();
      
      // Step 5: Try to parse the JSON, with fallback repair attempts
      try {
        return JSON.parse(cleanText);
      } catch (error) {
        console.error("Initial JSON Parse Error:", error);
        console.error("Attempted to parse:", cleanText);
        
        // Try to repair common JSON issues
        try {
          // Fix common issues: missing quotes around property names, trailing commas
          let repairedJson = cleanText
            .replace(/(\w+):/g, '"$1":') // Add quotes around property names
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
            .replace(/,\s*]/g, ']'); // Remove trailing commas before closing brackets
          
          return JSON.parse(repairedJson);
        } catch (repairError) {
          console.error("JSON Repair failed:", repairError);
  ;
          
          // Last resort: try to extract just the questions and answers manually
          try {
            const questionMatches = cleanText.match(/"question"\s*:\s*"([^"]+)"/g);
            const answerMatches = cleanText.match(/"answer"\s*:\s*"([^"]+)"/g);
            
            if (questionMatches && answerMatches && questionMatches.length === answerMatches.length) {
              const questions = questionMatches.map(q => q.replace(/"question"\s*:\s*"/, '').replace(/"/, ''));
              const answers = answerMatches.map(a => a.replace(/"answer"\s*:\s*"/, '').replace(/"/, ''));
              
              const result = questions.map((q, i) => ({
                question: q,
                answer: answers[i] || ''
              }));
              
              console.log("Manual extraction successful:", result);
              return result;
            }
          } catch (manualError) {
            console.error("Manual extraction failed:", manualError);
          }
          
          throw new Error("Invalid JSON format: " + (error as Error)?.message);
        }
      }
    };

    const generateAiResponse = async (data: FormData) => {
      const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information.

        Each object in the array should have the fields "question" and "answer", formatted as follows:
        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements.

        Please format the output strictly as a raw JSON array without any markdown formatting, code blocks, labels, or explanations.
        Return ONLY the JSON array with questions and answers. Do not wrap in code blocks or any other markdown syntax.
      `;
      
      // Log the prompt to console for debugging
      console.log("AI Prompt being sent:", prompt);
      console.log("Form data:", data);
      
      const aiResult = await (await import('@/scripts')).sendMessageWithRetry(prompt);
      if (!aiResult) {
        throw new Error('AI response was empty');
      }
      console.log("Raw AI Response:", aiResult.response.text());

      const cleanedResponse = cleanAiResponse(aiResult.response.text().trim());
      console.log("Cleaned AI Response (Parsed Questions):", cleanedResponse);
      
      // Log each question individually for better readability
      console.log("=== GENERATED INTERVIEW QUESTIONS ===");
      cleanedResponse.forEach((q: any, index: number) => {
        console.log(`Question ${index + 1}:`, q.question);
        console.log(`Answer ${index + 1}:`, q.answer);
        console.log("---");
      });
      
      return cleanedResponse;
    };


    const onSubmit = async (data: FormData) => {
      try {
        // Check if user is authenticated
        if (!userId) {
          toast.error("Authentication Error", {
            description: "Please sign in to create a mock interview",
          });
          return;
        }

        setLoading(true);
  
        if (initialData) {
          // update
          console.log("Updating interview with data:", { initialData, id: initialData.id, isValid });
          if (isValid && initialData.id && initialData.id.trim() !== '') {
            // Security check: ensure user can only update their own interviews
            if (initialData.userId !== userId) {
              toast.error("Access Denied", {
                description: "You can only edit interviews that you created.",
              });
              return;
            }
            
            const aiResult = await generateAiResponse(data);
  
            await updateDoc(doc(db, "interviews", initialData.id), {
              questions: aiResult,
              ...data,
              updatedAt: serverTimestamp(),
            }).catch((error) => console.error("Error generating AI response:", error));
            toast(toastMessage.title, { description: toastMessage.description });
          } else if (!initialData.id || initialData.id.trim() === '') {
            toast.error("Error", {
              description: "Invalid interview data. Please try creating a new interview instead.",
            });
            return;
          }
        } else {
          // create a new mock interview
          if (isValid) {
            const aiResult = await generateAiResponse(data);
  
            await addDoc(collection(db, "interviews"), {
              ...data,
              userId,
              questions: aiResult,
              createdAt: serverTimestamp(),
            });
  
            toast(toastMessage.title, { description: toastMessage.description });
          }
        }
  
        navigate("/generate", { replace: true });
      } catch (error) {
        console.error("Error submitting form: ", error);
        toast.error("Error", {
          description: "Something went wrong. Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      try {
        setLoading(true);
        const interviewRef = doc(db, 'interviews', initialData.id);
        await deleteDoc(interviewRef);
        toast.success('Interview deleted successfully!');
        navigate('/generate');
      } catch (error) {
        console.error('Error deleting interview:', error);
        toast.error('Failed to delete interview');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/generate');
  };

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumbPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Headings title={title} isSubHeading />
        </div>
        {initialData && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleDelete}
            disabled={loading}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      {!userId && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            Please sign in to create or edit mock interviews.
          </p>
        </div>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex flex-col gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <FormLabel>Job Role / Position</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Full Stack Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea disabled={loading} placeholder="Describe your job role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    placeholder="5"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                  <Textarea disabled={loading} placeholder="React, Node.js..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="reset" variant="outline" disabled={isSubmitting || loading}>
              Reset
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting || loading || !userId}>
              {loading ? <Loader className="animate-spin" /> : actions}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
