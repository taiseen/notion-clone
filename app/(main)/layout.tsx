"use client";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Navigation from "./_component/Navigation";
import Spinner from "@/components/Spinner";

const DocumentLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  // if user is not authenticated - redirect him to root page
  if (!isAuthenticated) return redirect("/");

  return (
    <div className="h-full flex dark:dark:bg-[#1F1F1F]">
      <Navigation />

      <main className="flex-1 h-full overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  );
};

export default DocumentLayout;
