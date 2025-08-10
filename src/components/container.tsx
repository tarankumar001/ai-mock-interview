import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("container px-4 md:px-8 py-4 w-full", className)} style={{ marginLeft: 0, marginRight: 0 }}>
      {children}
    </div>
  );
};
