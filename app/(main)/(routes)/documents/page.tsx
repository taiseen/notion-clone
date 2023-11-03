"use client";
import { Button } from "@/components/ui/button";
import { createStatus } from "@/constants/data";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const DocumentsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    // creating new document...
    const promise = create({ title: "Untitled" });

    // & by that document id redirect user to that url...
    // promise.then((documentId) => router.push(`/documents/${documentId}`));

    // based on this creating status... show toast message...
    toast.promise(promise, createStatus);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        alt="Empty"
        width="300"
        height="300"
        src="/empty.png"
        className="dark:hidden"
      />

      <Image
        alt="Empty"
        width="300"
        height="300"
        src="/empty-dark.png"
        className="hidden dark:block"
      />

      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>

      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
