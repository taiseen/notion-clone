"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import ModeToggle from "@/components/modeToggle";
import useScrollTop from "@/hooks/useScrollTop";
import Spinner from "@/components/spinner";
import Link from "next/link";
import Logo from "./logo";

const NavBar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
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
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>

            <SignInButton mode="modal">
              <Button size="sm">Get Jotion free</Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Jotion</Link>
            </Button>
            
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
