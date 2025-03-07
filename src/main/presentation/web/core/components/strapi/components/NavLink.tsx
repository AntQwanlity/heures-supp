import Link from "next/link";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  href: string;
  asLink?: boolean;
};
export const NavLink: React.FC<Props> = ({ href, children, asLink = true }) => {
  return asLink ? (
    <Link
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  ) : (
    <a
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </a>
  );
};
