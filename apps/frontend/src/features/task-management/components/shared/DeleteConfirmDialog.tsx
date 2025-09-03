"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../shared/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
  itemName?: string;
  itemCount?: number;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
  itemCount,
}: DeleteConfirmDialogProps) {
  const isPlural = itemCount !== undefined && itemCount > 1;
  const title = `Weet je het zeker?`;
  let description = `Deze actie kan niet ongedaan worden gemaakt. `;

  if (itemName) {
    description += `Dit zal de ${itemType} '${itemName}' permanent verwijderen.`;
  } else if (itemCount !== undefined) {
    description += `Dit zal ${itemCount} ${itemType}${
      isPlural ? "s" : ""
    } permanent verwijderen.`;
  } else {
    description += `Dit zal de geselecteerde ${itemType} permanent verwijderen.`;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Verwijderen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
