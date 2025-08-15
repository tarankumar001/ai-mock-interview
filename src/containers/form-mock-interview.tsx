import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Interview } from "@/types";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1, { message: "Position is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  experience: z.coerce.number().min(0, { message: "Experience is required" }),
  techStack: z.string().min(1, { message: "Tech Stack is required" }),
});

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const loading = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      position: "",
      description: "",
      experience: 0,
      techStack: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Your submit logic here (API call, etc.)
    if(initialData){

      // update

    }else{
      //create a new mock interview

    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        {/* Position Field */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Role /Job Position</FormLabel>
              <FormControl>
                <Input 
                disabled={loading}
                className="h-12"
                placeholder="Enter job role or position" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Enter a detailed description"
                  {...field}
                  className="border rounded p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Field */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience (in years)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? +e.target.value : "")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tech Stack Field */}
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack</FormLabel>
              <FormControl>
                <Input placeholder="e.g. React, Node.js" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {initialData ? "Save Changes" : "Create"}
        </Button>
        <Button
    type="button"
    variant="outline"
    onClick={() => form.reset()}
  >
    Reset
  </Button>
      </form>
    </Form>
  );
};
