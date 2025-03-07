import classNames from "classnames";
import { ButtonIconComponent } from "presentation/web/core/shared/buttons/button-icons";
import { Icon } from "presentation/web/core/shared/icons/icon";
import React, { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  className?: string;
  LeadingIcon?: ButtonIconComponent;
  TrailingIcon?: ButtonIconComponent;
  label: React.ReactNode;
  disabled?: boolean;
  formId?: string;
}>;

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  className,
  LeadingIcon,
  TrailingIcon,
  label,
  disabled = false,
  formId,
}) => (
  <button
    type={type}
    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    onClick={onClick}
    disabled={disabled}
    form={formId}
  >
    {LeadingIcon && (
      <Icon Component={LeadingIcon} className={classNames({ "-ml-1 mr-3": !!label })} />
    )}
    {label}
    {TrailingIcon && (
      <Icon Component={TrailingIcon} className={classNames({ "ml-3 -mr-1": !!label })} />
    )}
  </button>
);
