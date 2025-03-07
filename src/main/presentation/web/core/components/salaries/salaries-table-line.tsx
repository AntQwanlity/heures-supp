import classNames from "classnames";
import { SalariesTableLineTemplate } from "presentation/web/core/components/salaries/salaries-table";
import { EditButton } from "presentation/web/core/shared/buttons/edit.button";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { Form } from "presentation/web/core/shared/forms/form";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import React from "react";

type Props = {
  line: SalariesTableLineTemplate;
  idx: number;
  editedId: string | undefined;
  onEdit: (id: string) => void;
  showLoader: boolean;
  onSubmit?: (data: SalariesTableLineForm, onSuccess?: () => void) => void;
};

export type SalariesTableLineForm = {
  id: string;
  value: string;
};

export const SalariesTableLine: React.FC<Props> = ({
  line,
  idx,
  editedId,
  onEdit,
  onSubmit,
  showLoader,
}) => {
  const isEdited = editedId === line.action?.id;
  return (
    <tr
      key={`table-line-${idx}`}
      className={classNames(idx === 0 ? "border-gray-300" : "border-gray-200", "border-t")}
    >
      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
        {line.Label}
      </td>
      {line.Data instanceof Array &&
        line.Data.map((d, idxData) => (
          <td
            key={`card-table-line-${idx}-data-${idxData}`}
            className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"
          >
            {d}
          </td>
        ))}
      {!(line.Data instanceof Array) && (
        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
          <div className="flex place-content-end ">
            {isEdited && line.action ? (
              <Form<SalariesTableLineForm>
                id={`form-${line.action.id}`}
                onSubmit={(data) => {
                  if (onSubmit) onSubmit(data);
                }}
              >
                <TextInput
                  name="value"
                  trailingIcon={line.action.trailingIcon}
                  defaultValue={line.action.defaultValue}
                  className="w-28"
                  required
                  autoFocus
                />
                <TextInput type="hidden" name="id" defaultValue={line.action.id} />
              </Form>
            ) : (
              <span className="py-1.5">{line.Data}</span>
            )}
          </div>
        </td>
      )}
      {line.action && (
        <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-sm font-medium sm:pr-3 text-center w-28">
          {isEdited ? (
            <SubmitPrimaryButton
              label="Valider"
              showSpinner={showLoader}
              className="text-xs"
              width="fit"
              formId={`form-${line.action.id}`}
            />
          ) : (
            <div className="text-center">
              <EditButton onClick={() => line.action?.id && onEdit(line.action.id)} />
            </div>
          )}
        </td>
      )}
    </tr>
  );
};
