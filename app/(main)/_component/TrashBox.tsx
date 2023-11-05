"use client";
import { deleteStatus, restoreStatus } from "@/constants/data";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/modals/ConfirmModal";
import Spinner from "@/components/Spinner";

type RestoreClickType = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  documentId: Id<"documents">
) => void;

const TrashBox = () => {
  const restore = useMutation(api.db.update.restore);
  const remove = useMutation(api.db.delete.remove);
  const documents = useQuery(api.db.read.getTrash);
  const router = useRouter();
  const params = useParams();

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore: RestoreClickType = (event, documentId) => {
    event.stopPropagation();

    const promise = restore({ id: documentId });
    toast.promise(promise, restoreStatus);
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });
    toast.promise(promise, deleteStatus);

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />

        <Input
          value={search}
          placeholder="Filter by page title..."
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>

        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>

            <div className="flex items-center">
              <div
                role="button"
                onClick={(e) => onRestore(e, document._id)}
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>

              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
