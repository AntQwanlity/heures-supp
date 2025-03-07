import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { StrapiLink } from "infrastructure/cms/strapi-link";
import Link from "next/link";
import { Button } from "presentation/web/core/components/strapi/components/Button";
import { Container } from "presentation/web/core/components/strapi/components/Container";
import { NavLink } from "presentation/web/core/components/strapi/components/NavLink";
import { Image } from "presentation/web/core/shared/image";
import React, { Fragment, PropsWithChildren } from "react";

type MobileNavLinkProps = PropsWithChildren & {
  href: string;
  asLink?: boolean;
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, children, asLink = true }) => {
  return (
    <Popover.Button as={asLink ? Link : "a"} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
};

type MobileNavIconProps = {
  open: boolean;
};

const MobileNavIcon: React.FC<MobileNavIconProps> = ({ open }) => {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx("origin-center transition", open && "scale-90 opacity-0")}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx("origin-center transition", !open && "scale-90 opacity-0")}
      />
    </svg>
  );
};

const MobileNavigation: React.FC<HeaderProps> = ({ loginLinkLabel, links }) => {
  return (
    <Popover>
      <Popover.Button className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none">
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            {links.map((link) => (
              <MobileNavLink key={`header-mobile-link-${link.href}`} href={link.href}>
                {link.label}
              </MobileNavLink>
            ))}
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/app/login" asLink={false}>
              {loginLinkLabel}
            </MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};

type HeaderProps = {
  loginLinkLabel: string;
  signUpLinkLabel: string;
  links: StrapiLink[];
};

export const Header: React.FC<HeaderProps> = ({ loginLinkLabel, signUpLinkLabel, links }) => {
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/">
              <Image src="/hs.png" width={205} height={50} alt="Logo" lcp={false} topQuality />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {links.map((link) => (
                <NavLink key={`header-desktop-link-${link.href}`} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <NavLink href="/app/login" asLink={false}>
                {loginLinkLabel}
              </NavLink>
            </div>
            <Button href="/app/signup" color="blue" asLink={false}>
              {signUpLinkLabel}
            </Button>
            <div className="-mr-1 md:hidden">
              <MobileNavigation
                loginLinkLabel={loginLinkLabel}
                signUpLinkLabel={signUpLinkLabel}
                links={links}
              />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};
