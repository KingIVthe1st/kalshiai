"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--border-default)] bg-[var(--surface-3)] text-[var(--text-secondary)]",
        secondary:
          "border border-[var(--border-default)] bg-[var(--surface-2)] text-[var(--text-tertiary)]",
        success:
          "bg-[var(--up-muted)] text-[var(--up)] border border-[var(--up)]/20",
        destructive:
          "bg-[var(--down-muted)] text-[var(--down)] border border-[var(--down)]/20",
        up: "bg-[var(--up-muted)] text-[var(--up)] border border-[var(--up)]/20",
        down:
          "bg-[var(--down-muted)] text-[var(--down)] border border-[var(--down)]/20",
        hot: "bg-[var(--hot-muted)] text-[var(--hot)] border border-[var(--hot)]/20",
        warning:
          "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/20",
        info: "bg-[var(--info)]/15 text-[var(--info)] border border-[var(--info)]/20",
        outline:
          "border border-[var(--border-default)] text-[var(--text-secondary)]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean;
}

function Badge({ className, variant, size, pulse, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {pulse && (
        <span className="relative mr-1.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };
