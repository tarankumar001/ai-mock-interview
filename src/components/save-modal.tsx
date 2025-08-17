import Modal from "./modal";
import { Button } from "./ui/button";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const SaveModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
  }: SaveModalProps) => {
  return (
<Modal
      title="Are you sure?"
      description="This action cannot be undone you can't edit or re-answer this question again!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-y-3 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-800 w-full sm:w-auto"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  )
}
