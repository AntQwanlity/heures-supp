import classNames from "classnames";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  options: { name: string; label: string }[];
  onChange?: (value: string) => void;
  required?: boolean;
  defaultValue?: string;
  label?: string;
};

export const RadioGroup: React.FC<Props> = ({
  name,
  options,
  onChange = () => {},
  required = false,
  defaultValue,
  label,
}) => {
  const { control } = useFormContext();

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div
        className={classNames(
          { "mt-2": label },
          "space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0",
        )}
      >
        {options.map((option) => (
          <Controller
            key={`controller-${option.name}`}
            rules={{ required }}
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
              <div key={`option-${option.name}`} className="flex items-center">
                <input
                  id={`option-${option.name}`}
                  type="radio"
                  className={classNames("h-4 w-4", {
                    "border-gray-300 text-blue-600 focus:ring-blue-600": !fieldState.invalid,
                    "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500":
                      fieldState.invalid,
                  })}
                  defaultChecked={defaultValue === option.name}
                  {...field}
                  value={option.name}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    onChange(e.target.value);
                  }}
                  required={required}
                />
                <label
                  htmlFor={`option-${option.name}`}
                  className={classNames("ml-3 block text-sm leading-6", {
                    "font-medium": !label,
                    "text-gray-900": !fieldState.invalid,
                    "text-red-600": fieldState.invalid,
                  })}
                >
                  {option.label}
                </label>
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
};
