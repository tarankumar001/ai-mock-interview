import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
  }
  
  const Modal = ({
    title,
    description,
    isOpen,
    onClose,
    children,
  }: ModalProps) => {
    const onChange = (open: boolean) => {
      if (!open) {
        onClose();
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
  
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    );
  };
  
export default Modal;