import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import { chatSession } from "@/scripts";
import { db } from "@/config/firebase.config";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import  type { Interview } from "@/types";
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
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Headings } from "@/components/headings";
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100, "Max 100 characters"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  techStack: z.string().min(1, "Tech stack is required")
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      position: "",
      description: "",
      experience: 0,
      techStack: ""
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

      // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
      cleanText = cleanText.replace(/(json|```|`)/g, "");

      // Step 3: Extract a JSON array by capturing text between square brackets
      const jsonArrayMatch = cleanText.match(/\[.*\]/s);
      if (jsonArrayMatch) {
        cleanText = jsonArrayMatch[0];
      } else {
        throw new Error("No JSON array found in response");
      }
      
      // Step 4: Parse the clean JSON text into an array of objects
      try {
        return JSON.parse(cleanText);
      } catch (error) {
        throw new Error("Invalid JSON format: " + (error as Error)?.message);
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

        Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations.
        Return only the JSON array with questions and answers.
      `;
      
      // Log the prompt to console for debugging
      console.log("AI Prompt being sent:", prompt);
      console.log("Form data:", data);
      
      const aiResult = await chatSession.sendMessage(prompt);
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
        setLoading(true);
  
        if (initialData) {
          // update
          if (isValid) {
            const aiResult = await generateAiResponse(data);
  
            await updateDoc(doc(db, "interviews", initialData?.id), {
              questions: aiResult,
              ...data,
              updatedAt: serverTimestamp(),
            }).catch((error) => console.log(error));
            toast(toastMessage.title, { description: toastMessage.description });
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
        console.log(error);
        toast.error("Error..", {
          description: `Something went wrong. Please try again later`,
        });
      } finally {
        setLoading(false);
      }
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
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between">
        <Headings title={title} isSubHeading />
        {initialData && (
          <Button size="icon" variant="ghost">
            <Trash2 className="text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

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
            <Button type="submit" disabled={!isValid || isSubmitting || loading}>
              {loading ? <Loader className="animate-spin" /> : actions}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
