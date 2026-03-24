import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFirestoreCRUD } from "@/hooks/useFirestoreCRUD";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  collectionName: string;
  itemId: string;
  itemName: string;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onOpenChange,
  onSuccess,
  collectionName,
  itemId,
  itemName,
}: DeleteConfirmDialogProps) => {
  const { toast } = useToast();
  const { remove, loading, error } = useFirestoreCRUD(collectionName);

  const handleDelete = async () => {
    try {
      const success = await remove(itemId);
      if (success) {
        console.log(`[Delete] Successfully deleted ${collectionName}/${itemId}`);
        toast({
          title: "Success",
          description: `${itemName} deleted successfully`,
        });
        // Wait a moment for Firestore listener to propagate
        await new Promise(resolve => setTimeout(resolve, 300));
        onSuccess();
        onOpenChange(false);
      } else {
        console.error(`[Delete] Failed to delete ${collectionName}/${itemId}:`, error);
        toast({
          title: "Error",
          description: error || "Failed to delete",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete";
      console.error(`[Delete Error] ${collectionName}/${itemId}:`, errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            record from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
