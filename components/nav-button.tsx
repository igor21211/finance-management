import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavButtonProps {
  label: string;
  href: string;
  isActive: boolean;
}

export const NavButton = ({ label, href, isActive }: NavButtonProps) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full justify-between border-none font-normal text-white transition-all duration-300 outline-none hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0 lg:w-auto",
        isActive ? "bg-white/20 text-white" : "bg-transparent",
      )}
    >
      <Link href={href}> {label} </Link>
    </Button>
  );
};
