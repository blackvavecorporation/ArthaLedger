"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ConfirmButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {pending ? "Deleting…" : label}
    </Button>
  );
}

export function DeleteButton({
  action,
  id,
  name,
  label = "Delete",
  title = "Delete this item?",
  description = "This action cannot be undone. The item will be permanently removed.",
  className,
  compact = false,
  extraFields,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  name: string;
  label?: string;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
  extraFields?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon" : "sm"}
        onClick={() => setOpen(true)}
        aria-label={`${label} ${name}`}
        className={cn("text-red-600 hover:bg-red-50 hover:text-red-700", className)}
      >
        <Trash2 className={compact ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {!compact && label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-navy-800">{name}</span> — {description}
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            <input type="hidden" name="id" value={id} />
            {extraFields &&
              Object.entries(extraFields).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <ConfirmButton label={label} />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
