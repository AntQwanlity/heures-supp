import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  id: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  onChange?: (value: string) => void;
  defaultValue?: string;
};

export const Textarea: React.FC<Props> = ({
  id,
  label,
  required,
  placeholder,
  rows = 4,
  onChange = () => {},
  defaultValue,
  ...inputProps
}) => {
  const { control } = useFormContext();
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <Controller
          name={id}
          control={control}
          rules={{ required: required }}
          defaultValue={defaultValue}
          render={({ field }) => (
            <textarea
              id={id}
              rows={rows}
              className="appearance-none shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md placeholder:text-gray-400"
              placeholder={placeholder}
              required={required}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange(e.target.value);
              }}
              {...inputProps}
            />
          )}
        />
      </div>
    </div>
  );
};
