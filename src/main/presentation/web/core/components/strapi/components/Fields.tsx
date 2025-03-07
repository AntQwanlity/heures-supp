import clsx from "clsx";
import React, { PropsWithChildren } from "react";

const formClasses =
  "block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm";

type LabelProps = PropsWithChildren & {
  id: string;
};
const Label: React.FC<LabelProps> = ({ id, children }) => {
  return (
    <label htmlFor={id} className="mb-3 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

type TextFieldProps = {
  id: string;
  label: string;
  type?: string;
  className?: string;
};
export const TextField: React.FC<TextFieldProps & Record<string, any>> = ({
  id,
  label,
  type = "text",
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  );
};

type SelectFieldProps = PropsWithChildren & {
  id: string;
  label: string;
  className?: string;
};
export const SelectField: React.FC<SelectFieldProps & Record<string, any>> = ({
  id,
  label,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, "pr-8")} />
    </div>
  );
};
