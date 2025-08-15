import { CustomBreadCrumb } from "@/components/ui/custom-breadcrums";
import type { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "@/components/ui/headings";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitted } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData?.position
    ? initialData.position
    : "Create Mock Interview";

  const breadcrumbPage = initialData?.position ? "Edit" : "Create";

  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      // Your save logic here
    } catch (error) {
      console.error("Error saving interview:", error);
      toast.error("Error..", {
        description:
          "Something went wrong. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      {title}
      <CustomBreadCrumb
        breadCrumbPage={breadcrumbPage}
        breadCrumpItems={[{ label: "Mock Interview", link: "/generate" }]}
      />
      <div className="mt-4 flex items-center juustify-between w-full">
        <Headings title={title} isSubHeading/>
        
      </div>
    </div>
  );
};
