import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ItemProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  id?: Id<"documents">;
  onExpand?: () => void;
  documentIcon?: string;
  isSearch?: boolean;
  expanded?: boolean;
  archive?: boolean;
  level?: number;
}

const Item = ({
  icon: Icon,
  onClick,
  label,
  documentIcon,
  level = 0,
  onExpand,
  isSearch,
  expanded,
  archive,
  id,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      role="button"
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[28px] text-sm py-2 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium"
        // active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          //   onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
};

export default Item;
