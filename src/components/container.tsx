import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  ...props
}: { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container mx-auto px-4 py-2", className)} {...props}>
      {children}
    </div>
  );
}
