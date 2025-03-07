import { DateTime } from "DateTime";
import classNames from "classnames";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ReactTailwindDatepicker from "react-tailwindcss-datepicker";

type Props = {
  name: string;
  validate?: (value: string, formValues: any) => string | undefined;
  defaultValue?: DateTime;
};

export const DatePicker: React.FC<Props> = ({ name, validate, defaultValue }) => {
  const { control } = useFormContext();

  const [dateTimeValue, setDateTimeValue] = useState<DateTime | undefined>(defaultValue);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue?.format("Date")}
      rules={{ required: true, validate }}
      render={({ field, fieldState }) => (
        <>
          <ReactTailwindDatepicker
            value={{
              startDate: dateTimeValue?.getNativeDate() || null,
              endDate: dateTimeValue?.getNativeDate() || null,
            }}
            onChange={(newValue) => {
              if (!newValue || newValue?.startDate === null) return;
              const newDateTimeValue =
                newValue.startDate instanceof Date
                  ? DateTime.fromDate(newValue.startDate)
                  : DateTime.fromFormattedString(newValue.startDate, "YYYY-MM-DD");

              setDateTimeValue(newDateTimeValue);
              field.onChange(newDateTimeValue.format("Date"));
            }}
            containerClassName="mt-2 relative rounded-md shadow-sm"
            inputClassName={classNames(
              "relative w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
              {
                "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500":
                  fieldState.invalid,
                "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600":
                  !fieldState.invalid,
              },
            )}
            inputId={name}
            toggleClassName={
              fieldState.invalid
                ? "absolute right-0 h-full px-3 text-red-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                : undefined
            }
            inputName={name}
            primaryColor={"blue"}
            i18n={"fr"}
            startWeekOn="mon"
            displayFormat={"DD/MM/YYYY"}
            useRange={false}
            asSingle
            startFrom={defaultValue?.getNativeDate()}
          />
          {fieldState.invalid && (
            <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
              {fieldState.error?.message}
            </p>
          )}
        </>
      )}
    />
  );
};
