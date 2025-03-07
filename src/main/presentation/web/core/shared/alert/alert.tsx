import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import React from "react";

type Props = {
  content: string;
  linkHref: string;
  linkLabel: string;
};

export const Alert: React.FC<Props> = ({ content, linkHref, linkLabel }) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">{content}</p>
          <p className="mt-3 text-sm md:ml-6 md:mt-0">
            <PrimaryLink href={linkHref} className="whitespace-nowrap">
              {linkLabel}
              <span aria-hidden="true"> &rarr;</span>
            </PrimaryLink>
          </p>
        </div>
      </div>
    </div>
  );
};
