import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BanknotesIcon,
  Bars3Icon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyEuroIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { User } from "core/components/auth/domain/user";
import { LogoutRemoteCommandTemplate } from "presentation/web/core/components/auth/logout.remote-command";
import { useCreateLegalCaseRemoteCommand } from "presentation/web/core/components/legal-case/create-legal-case.remote-command";
import { useLegalCasesRemoteQuery } from "presentation/web/core/components/legal-case/legal-cases.remote-query";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { Avatar } from "presentation/web/core/shared/avatar/Avatar";
import { Button } from "presentation/web/core/shared/buttons/button";
import { ButtonLink } from "presentation/web/core/shared/buttons/button-link";
import { Form } from "presentation/web/core/shared/forms/form";
import { Select } from "presentation/web/core/shared/forms/select";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import { TabItem } from "presentation/web/core/shared/tabs";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";
import React, { Fragment, PropsWithChildren, useState } from "react";

type Props = PropsWithChildren<{
  user?: User;
}>;

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>;
  tabsItems: TabItem[];
};
export const AppLayout: React.FC<Props> = ({ user, children }) => {
  const { setNotification } = useNotificationContext();
  const logoutCommand = useRemoteCommand({
    template: LogoutRemoteCommandTemplate,
    pathArgs: undefined,
  });

  const onLogout = async () => {
    logoutCommand.send(
      undefined,
      () => {
        router.redirect("/");
      },
      () => {
        router.redirect("/");
      },
    );
  };

  const router = useRouter();

  const isPdf = router.pathContains("pdf");

  const legalCaseId = router.getParam("legalCaseId");

  const navigation: NavigationItem[] = user
    ? [
        {
          name: "Contrat de travail",
          href: `/app/legal-case/${legalCaseId}/contract`,
          icon: BriefcaseIcon,
          tabsItems: [],
        },
        {
          name: "Salaires perçus",
          href: `/app/legal-case/${legalCaseId}/salaries`,
          icon: CurrencyEuroIcon,
          tabsItems: [],
        },
        {
          name: "Heures travaillées",
          href: `/app/legal-case/${legalCaseId}/worked-hours`,
          icon: ClockIcon,
          tabsItems: [],
        },
        {
          name: "Indemnités",
          href: `/app/legal-case/${legalCaseId}/compensation`,
          icon: BanknotesIcon,
          tabsItems: [],
        },
      ]
    : [
        {
          name: "Heures travaillées",
          href: `/app/legal-case/${legalCaseId}/worked-hours`,
          icon: ClockIcon,
          tabsItems: [],
        },
      ];

  const userNavigation: { name: string; href?: string; onClick?: () => void }[] = user
    ? [
        { name: user["email"], href: "les" },
        { name: "Déconnexion", onClick: onLogout },
      ]
    : [];

  const legalCasesQuery = useLegalCasesRemoteQuery();
  const legalCases = legalCasesQuery.data || [];

  const legalCasesOptions = [{ label: "Créer un dossier...", value: "new" }].concat(
    legalCases.map((legalCase, idx) => ({
      label:
        legalCase["client"] &&
        (legalCase["client"]["firstName"].length > 0 || legalCase["client"]["lastName"].length > 0)
          ? `${legalCase["client"]["firstName"]} ${legalCase["client"]["lastName"]}`
          : `Dossier ${idx + 1}`,
      value: legalCase["id"],
    })),
  );

  const [isCreatingLegalCase, setIsCreatingLegalCase] = useState(false);

  const onLegalCaseChange = (value: string) => {
    if (value === "new") {
      if (legalCases.length >= 50) {
        setNotification({
          type: "error",
          text: "Vous avez atteint la limite du nombre de dossiers.",
        });
        return;
      }

      setIsCreatingLegalCase(true);
      createLegalCaseCommand.send(
        undefined,
        async (legalCaseId) => {
          setNotification({ type: "success", text: "Un nouveau dossier a été créé." });
          await router.redirect(`/app/legal-case/${legalCaseId}/contract`);
          router.reload();
        },
        () => {
          setIsCreatingLegalCase(false);
        },
      );
      return;
    }

    if (router.pathContains(value)) return;
    router.redirect(`/app/legal-case/${value}/salaries`);
  };

  const createLegalCaseCommand = useCreateLegalCaseRemoteCommand();

  if (isPdf) return <>{children}</>;

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-blue-600">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-40 w-40"
                        src="/logo-no-background.svg"
                        alt="Your Company"
                        width={0}
                        height={0}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {isCreatingLegalCase ? (
                          <Icon Component={SpinnerIcon} />
                        ) : (
                          <Form>
                            <Select
                              options={legalCasesOptions}
                              name="legalCaseId"
                              onChange={onLegalCaseChange}
                              defaultValue={legalCaseId}
                            />
                          </Form>
                        )}
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              router.pathStartsWith(item.href)
                                ? "bg-blue-700 text-white"
                                : "text-white hover:bg-blue-500 hover:bg-opacity-75",
                              "rounded-md px-3 py-2 text-sm font-medium",
                            )}
                            aria-current={router.pathStartsWith(item.href) ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-blue-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                            <span className="sr-only">Open user menu</span>
                            <Avatar size={8} />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <>
                                    {item.onClick ? (
                                      <ButtonLink onClick={item.onClick} className="px-4 py-2">
                                        {item.name}
                                      </ButtonLink>
                                    ) : (
                                      <span
                                        className={classNames(
                                          "block px-4 py-2 text-sm text-gray-700 break-words",
                                        )}
                                      >
                                        {item.name}
                                      </span>
                                    )}
                                  </>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-blue-600 p-2 text-blue-200 hover:bg-blue-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {isCreatingLegalCase ? (
                    <Icon Component={SpinnerIcon} />
                  ) : (
                    <Form>
                      <Select
                        options={legalCasesOptions}
                        name="legalCaseId"
                        onChange={onLegalCaseChange}
                        defaultValue={legalCaseId}
                      />
                    </Form>
                  )}
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        router.pathStartsWith(item.href)
                          ? "bg-blue-700 text-white"
                          : "text-white hover:bg-blue-500 hover:bg-opacity-75",
                        "block rounded-md px-3 py-2 text-base font-medium",
                      )}
                      aria-current={router.pathStartsWith(item.href) ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-blue-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Avatar size={10} />
                    </div>
                    <div className="ml-3">
                      {user ? (
                        <>
                          <div className="text-base font-medium text-white">Connecté</div>
                        </>
                      ) : (
                        <div className="text-base font-medium text-white">Invité</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <div key={`user-name-${item.name}`}>
                        {item.onClick ? (
                          <Button label={item.name} onClick={item.onClick} className="text-white" />
                        ) : (
                          <span
                            className={classNames(
                              "block px-4 py-2 text-sm text-blue-300 font-medium",
                            )}
                          >
                            {item.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="md:flex gap-24 justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {navigation.find((item) => router.pathStartsWith(item.href))?.name}
            </h1>
            <p className="text-sm self-center">
              Une question ?{" "}
              <PrimaryLink href="mailto:contact@heures-supp.fr">contact@heures-supp.fr</PrimaryLink>
            </p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};
