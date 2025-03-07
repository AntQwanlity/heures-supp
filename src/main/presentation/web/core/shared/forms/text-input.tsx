import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  label?: string;
  subLabel?: string;
  name: string;
  type?: "text" | "password" | "email" | "hidden"; // number is not provided because https://stackoverflow.blog/2022/12/26/why-the-number-input-is-the-worst-input/
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string | number) => void;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  minLength?: number;
  validate?: "number" | "int" | ((value: string, formValues: any) => string | undefined);
  className?: string;
  disabled?: boolean;
};

export const TextInput: React.FC<Props & Record<string, any>> = ({
  label,
  subLabel,
  name,
  type = "text",
  placeholder,
  defaultValue = "",
  onChange = () => {},
  leadingIcon,
  trailingIcon,
  required = false,
  minLength,
  className,
  validate,
  disabled = false,
  ...inputProps
}) => {
  const { control } = useFormContext();
  const rules = {
    required,
    minLength: { value: minLength || 0, message: "" },
    validate: (value: string, formValues: any) => {
      if (validate === "number") {
        const numValue = Number(value.replace(",", "."));

        return isNaN(numValue) || numValue <= 0 ? "Valeur invalide." : undefined;
      }

      if (validate === "int") {
        const numValue = Number(value);
        return isNaN(numValue) || numValue <= 0 || !Number.isInteger(numValue)
          ? "Valeur invalide."
          : undefined;
      }

      if (validate) return validate(value, formValues);

      return undefined;
    },
  };
  return (
    <div className={className}>
      {label && !subLabel && (
        <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      {label && subLabel && (
        <div className="flex gap-2">
          <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </label>
          <span className="text-sm leading-6 text-gray-500" id="email-optional">
            {subLabel}
          </span>
        </div>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <>
            <div className={classNames({ "mt-2": label }, "relative rounded-md shadow-sm")}>
              {leadingIcon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{leadingIcon}</span>
                </div>
              )}
              <input
                type={type}
                className={classNames(
                  "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset",
                  "focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  {
                    "pl-8": leadingIcon,
                    "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500":
                      fieldState.invalid,
                    "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600":
                      !fieldState.invalid,
                    "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200":
                      disabled,
                  },
                )}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                aria-invalid={!!fieldState.error}
                aria-describedby={!!fieldState.error ? `${name}-error` : undefined}
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange(e.target.value);
                }}
                {...inputProps}
              />
              {(!!fieldState.error || trailingIcon) && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {fieldState.invalid ? (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
                  ) : (
                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                      {trailingIcon}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!!fieldState.error && (
              <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
                {fieldState.error?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
