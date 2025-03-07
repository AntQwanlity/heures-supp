import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React, { Fragment, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label?: string;
  options: Option[];
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Select: React.FC<Props> = ({
  name,
  label,
  options,
  required = false,
  defaultValue = options[0].value,
  onChange = () => {},
}) => {
  const { control } = useFormContext();
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    options.find((option) => option.value === defaultValue),
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Listbox
          value={field.value}
          onChange={(value) => {
            field.onChange(value);
            setSelectedOption(options.find((option) => option.value === value));
            onChange(value);
          }}
        >
          {({ open }) => (
            <>
              {label && (
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                  {label}
                </Listbox.Label>
              )}
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">{selectedOption?.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overscroll-contain overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          classNames(
                            active ? "bg-blue-600 text-white" : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                          )
                        }
                        value={option.value}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate",
                              )}
                            >
                              {option.label}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-blue-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      )}
    />
  );
};
