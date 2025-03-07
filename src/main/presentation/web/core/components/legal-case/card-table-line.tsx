import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CardTableLineTemplate } from "presentation/web/core/card-table";
import { ButtonsGroup } from "presentation/web/core/shared/buttons/buttons-group";
import { EditButton } from "presentation/web/core/shared/buttons/edit.button";
import { Form } from "presentation/web/core/shared/forms/form";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { Icon } from "presentation/web/core/shared/icons/icon";
import React, { useState } from "react";

type Props = {
  line: CardTableLineTemplate;
  idx: number;
  showLoader: boolean;
  onSubmit?: (data: CardTableLineForm, onSuccess: () => void) => void;
};

export type CardTableLineForm = {
  id: string;
  value: string;
};

export const CardTableLine: React.FC<Props> = ({ line, idx, onSubmit, showLoader }) => {
  const [isEdited, setIsEdited] = useState(false);

  return (
    <tr className={idx % 2 === 0 ? undefined : "bg-gray-50"}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {line.Label}
      </td>
      {line.Data instanceof Array &&
        line.Data.map((d, idxData) => (
          <td
            key={`card-table-line-${idx}-data-${idxData}`}
            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
          >
            {d}
          </td>
        ))}
      {!(line.Data instanceof Array) && (
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {isEdited && line.action ? (
            <Form<CardTableLineForm>
              id={`form-${line.action.id}`}
              onSubmit={(data) => {
                onSubmit &&
                  onSubmit(data, () => {
                    setIsEdited(false);
                  });
              }}
            >
              <TextInput
                name="value"
                trailingIcon={line.action.trailingIcon}
                defaultValue={line.action.defaultValue}
                className="w-28"
                required
              />
              <TextInput type="hidden" name="id" defaultValue={line.action.id} />
            </Form>
          ) : (
            line.Data
          )}
        </td>
      )}
      {line.action && (
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          {isEdited ? (
            <ButtonsGroup
              buttons={[
                {
                  Component: (
                    <>
                      <span className="sr-only">Cancel</span>
                      <Icon Component={XMarkIcon} size="sm" />
                    </>
                  ),
                  className: "text-red-500 hover:bg-red-500  hover:text-white",
                  onClick: () => setIsEdited(false),
                },
                {
                  Component: (
                    <>
                      <span className="sr-only">Submit</span>
                      <Icon Component={CheckIcon} size="sm" />
                    </>
                  ),
                  className: "text-green-500 hover:bg-green-500 hover:text-white",
                  type: "submit",
                },
              ]}
              formId={`form-${line.action.id}`}
              showLoader={showLoader}
            />
          ) : (
            <EditButton onClick={() => setIsEdited(true)} />
          )}
        </td>
      )}
    </tr>
  );
};
