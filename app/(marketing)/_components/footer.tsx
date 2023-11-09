import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
      <Logo />

      <div className="w-full flex justify-between md:justify-end items-center gap-x-2 md:ml-auto text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>

        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
