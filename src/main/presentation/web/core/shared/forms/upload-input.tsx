import { ClockIcon } from "@heroicons/react/24/solid";
import { Icon } from "presentation/web/core/shared/icons/icon";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  required?: boolean;
  extensionsAllowed: string[];
  maxFileSizeMb: number;
  uploadLabel?: string;
  onChange: (file?: File) => void;
};
export const UploadInput: React.FC<Props> = ({
  name,
  required = false,
  uploadLabel,
  extensionsAllowed,
  maxFileSizeMb,
  onChange,
}) => {
  const { control } = useFormContext();
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    onChange(file);
  }, [onChange, file]);

  return (
    <>
      <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-gray-600">
        <div className="text-center">
          {file ? (
            <>
              {file.name}
              <br />
            </>
          ) : (
            <Icon
              Component={ClockIcon}
              className="mx-auto h-12 w-12 text-gray-300"
              autoSize={false}
            />
          )}
          <div className="mt-4 flex text-sm leading-6">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>Choisir un fichier</span>
              <Controller
                name={name}
                control={control}
                rules={{ required }}
                render={({ field }) => (
                  <input
                    type="file"
                    id="file-upload"
                    className="sr-only"
                    {...field}
                    onChange={(value) => {
                      handleFileChange(value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs leading-5">
            {extensionsAllowed.join(",")} jusqu'à {maxFileSizeMb}Mo
          </p>
        </div>
      </div>
    </>
  );
};
