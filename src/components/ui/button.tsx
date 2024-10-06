import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@/utils";

export const buttonVariants = cva(
    "inline-flex uppercase font-bold items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-background hover:bg-white/90",
                outline:
                    "border border-input hover:bg-accent hover:bg-accent-foreground",
                ghost: "bg-transparent hover:bg-accent hover:bg-accent-foreground",
            },
            size: {
                default: "h-14 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        className,
                    })
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
