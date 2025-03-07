import NextLink from "next/link";
import React, { PropsWithChildren } from "react";

export type LinkProps = PropsWithChildren<{
  className?: string;
  download?: boolean;
  href: string;
}>;

export const Link: React.FC<LinkProps> = ({ href, download = false, className, children }) => {
  return (
    <NextLink href={href} className={className} download={download}>
      {children}
    </NextLink>
  );
};
