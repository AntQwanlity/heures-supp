import { StrapiLink } from "infrastructure/cms/strapi-link";
import { Container } from "presentation/web/core/components/strapi/components/Container";
import { NavLink } from "presentation/web/core/components/strapi/components/NavLink";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import React from "react";

type Props = {
  links: StrapiLink[];
  copyright: string;
};

export const Footer: React.FC<Props> = ({ links, copyright }) => {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <Link href="/">
            <Image
              src="/hs.png"
              width={205}
              height={50}
              alt="Logo"
              className="h-10 mx-auto w-auto"
            />
          </Link>
          <nav className="mt-10 text-sm">
            <div className="-my-1 flex justify-center gap-x-6">
              {links.map((link) => (
                <NavLink key={`footer-desktop-link-${link.href}`} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6"></div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
};
