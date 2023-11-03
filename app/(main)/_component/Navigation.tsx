"use client";
import { ElementRef, useRef, useState, useEffect } from "react";
import { createStatus } from "@/constants/data";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DocumentList from "./DocumentList";
import UserItem from "./UserItem";
import Item from "./Item";
import {
  ChevronsLeft,
  PlusCircle,
  Settings,
  MenuIcon,
  Search,
} from "lucide-react";

const Navigation = () => {
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 786px)");

  const createDocument = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile); // if mobile, sidebar auto collapse

  useEffect(() => {
    // just tracking for isMobile || not...
    isMobile ? handelCollapse() : handelResetWidth();
  }, [isMobile]);

  useEffect(() => {
    // just tracking when path name change...
    isMobile && handelCollapse();
  }, [isMobile, pathName]);

  // use it for sidebar resizing - between some limit values...
  const handelMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240; // go to this small...
    if (newWidth > 480) newWidth = 480; // go to this big...

    if (sideBarRef.current && navbarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  // stope resizing... by remove event listener...
  const handelMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handelMouseMove);
    document.removeEventListener("mouseup", handelMouseUp);
  };

  // by click down start resizing...
  const handelMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;

    document.addEventListener("mousemove", handelMouseMove); // use it for resizing...
    document.addEventListener("mouseup", handelMouseUp); // by mouse live stope resizing...
  };

  const handelResetWidth = () => {
    if (sideBarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sideBarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );

      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => setIsResetting(false), 300);
      // this ==> 300 | set for animation,
      // which come form duration-300 tw class...
    }
  };

  const handelCollapse = () => {
    if (sideBarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sideBarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("left", "0");
      navbarRef.current.style.setProperty("width", "100%");

      setTimeout(() => setIsResetting(false), 300);
      // this ==> 300 | set for animation,
      // which come form duration-300 tw class...
    }
  };

  const createDoc = () => {
    // creating new document...
    const promise = createDocument({ title: "Untitled" });

    // & by that document id redirect user to that url...
    // promise.then((documentId) => router.push(`/documents/${documentId}`));

    // based on this creating status... show toast message...
    toast.promise(promise, createStatus);
  };

  return (
    <>
      <aside
        ref={sideBarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          role="button"
          onClick={handelCollapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:text-gray-700  dark:hover:bg-neutral-300 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-0"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />

          <Item label="Search" icon={Search} onClick={() => {}} isSearch />
          <Item label="Settings" icon={Settings} onClick={() => {}} />
          <Item label="New page" icon={PlusCircle} onClick={createDoc} />
        </div>

        <div className="mt-4">
            <DocumentList />
        </div>

        <div
          onClick={handelResetWidth}
          onMouseDown={handelMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        >
          {/* Sliding capability for sidebar */}
        </div>
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 left-60 w-[calc(100% - 240px)] z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={handelResetWidth}
              className="h-6 w-6 text-muted-foreground hover:bg-neutral-300 hover:text-gray-700 dark:hover:bg-neutral-300 rounded-sm transition"
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
