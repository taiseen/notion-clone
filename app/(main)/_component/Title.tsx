"use client";
import { Doc } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps {
  initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
  const docUpdate = useMutation(api.db.update.docUpdate);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;

    setTitle(userInput);
    docUpdate({ id: initialData._id, title: userInput || "Untitled" });
  };

  const disableInput = () => setIsEditing(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") disableInput();
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={onChange}
          onClick={enableInput}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={enableInput}
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-5 w-28 rounded-sm" />;
};
