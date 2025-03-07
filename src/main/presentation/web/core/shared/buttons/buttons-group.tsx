import classNames from "classnames";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  formId?: string;
  buttons: {
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    className?: string;
    Component: React.ReactNode;
    onClick?: () => void;
  }[];
  showLoader?: boolean;
};

export const ButtonsGroup: React.FC<Props> = ({ formId, buttons, showLoader = false }) => {
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      {showLoader ? (
        <Icon Component={SpinnerIcon} />
      ) : (
        <>
          {buttons.map((button, idx) => (
            <button
              key={`button-${idx}`}
              type={button.type || "button"}
              form={formId}
              className={classNames(
                {
                  "relative inline-flex items-center bg-white rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10":
                    idx === 0,
                  "relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10":
                    idx > 0 && idx < buttons.length - 1,
                  "relative -ml-px inline-flex items-center bg-white rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10":
                    idx === buttons.length - 1,
                },
                button.className,
              )}
              onClick={button.onClick}
            >
              {button.Component}
            </button>
          ))}
        </>
      )}
    </span>
  );
};
