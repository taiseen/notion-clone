"use client";
import ModeToggle from "@/components/modeToggle";
import useScrollTop from "@/hooks/useScrollTop";
import Logo from "./logo";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />

      <div className=" w-full flex items-center justify-between md:justify-end md:ml-auto gap-x-2">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
