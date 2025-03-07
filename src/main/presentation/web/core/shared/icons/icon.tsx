import React from "react";

type Size = "sm" | "md" | "lg";
type Props = {
  Component: React.ComponentType<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoSize?: boolean;
};

const SizesClasses: Record<Size, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

export const Icon: React.FC<Props> = ({ Component, className, size = "md", autoSize = true }) => {
  return (
    <Component
      className={`${autoSize ? SizesClasses[size] : ""} inline ${className}`}
      aria-hidden="true"
    />
  );
};
