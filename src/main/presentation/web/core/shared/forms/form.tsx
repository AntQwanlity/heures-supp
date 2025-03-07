import React from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

type Props<FormDataType> = {
  id?: string;
  onSubmit?: (data: FormDataType, dirtyValues: { [K: string]: any }, reset: () => void) => void;
  containsFileUpload?: boolean;
  className?: string;
  children: React.ReactNode;
};

type UnknownObject = Record<string, unknown>;
type UnknownArrayOrObject = unknown[] | UnknownObject;

const getDirtyFieldsValues = (
  dirtyFields: UnknownArrayOrObject | boolean | unknown,
  allValues: UnknownArrayOrObject | unknown,
): UnknownArrayOrObject | unknown => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues;
  }

  const dirtyFieldsObject = dirtyFields as UnknownObject;
  const allValuesObject = allValues as UnknownObject;

  return Object.fromEntries(
    Object.keys(dirtyFieldsObject).map((key) => [
      key,
      getDirtyFieldsValues(dirtyFieldsObject[key], allValuesObject[key]),
    ]),
  );
};

export const Form = <FormDataType extends FieldValues>({
  id,
  onSubmit = () => {},
  containsFileUpload = false,
  className,
  children,
}: Props<FormDataType>) => {
  const formMethods = useForm<FormDataType>();

  const { dirtyFields } = formMethods.formState;

  return (
    <FormProvider {...formMethods}>
      <form
        id={id}
        onSubmit={formMethods.handleSubmit((data) =>
          onSubmit(data as FormDataType, getDirtyFieldsValues(dirtyFields, data) as any, () =>
            formMethods.reset(undefined, { keepValues: true }),
          ),
        )}
        className={className}
        encType={containsFileUpload ? "multipart/form-data" : undefined}
      >
        {children}
      </form>
    </FormProvider>
  );
};
