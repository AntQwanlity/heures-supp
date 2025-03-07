import classNames from "classnames";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  label?: string;
  name: string;
  defaultValue?: boolean;
  onChange?: (value: string | number) => void;
  required?: boolean;
  className?: string;
};

export const Checkbox: React.FC<Props & Record<string, any>> = ({
  label,
  name,
  defaultValue = false,
  onChange = () => {},
  required = false,
  className,
  ...inputProps
}) => {
  const { control } = useFormContext();
  return (
    <div className={classNames("flex items-center", className)}>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <input
            id={name}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            required={required}
            {...field}
            onChange={(e) => {
              field.onChange(e.target.value);
              onChange(e.target.value);
            }}
            {...inputProps}
          />
        )}
      />
      {label && (
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
};
