"use client";

import { ElementRef, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronsLeft } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

const Navigation = () => {
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 786px)");

  const isResizingRef = useRef(false);
  const isSideBarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile); // if in mobile sidebar auto collapse

  return (
    <>
      <aside className="group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]">
        <div
          role="button"
          className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-300 absolute top-3 right-0 opacity-0 group-hover/sidebar:opacity-100 transition"
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <p>Action</p>
        </div>
        <div className="mt-4">
          <p>Documents</p>
        </div>
        Sliding capablity of css for sidebar
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"></div>
      </aside>
    </>
  );
};

export default Navigation;
