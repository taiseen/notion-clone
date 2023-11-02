"use client";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Item from "./Item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  data?: Doc<"documents">[];
  level?: number;
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const params = useParams();
  const router = useRouter();

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) =>
    router.push(`/documents/${documentId}`);

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />

        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

      {documents.map((document) => (
        <div key={document._id}>
          <Item
            onClick={() => onRedirect(document._id)}
            onExpand={() => onExpand(document._id)}
            active={params.documentId === document._id}
            expanded={expanded[document._id]}
            documentIcon={document.icon}
            label={document.title}
            id={document._id}
            icon={FileIcon}
            level={level}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
