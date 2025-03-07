import classNames from "classnames";
import {
  CardTableLine,
  CardTableLineForm,
} from "presentation/web/core/components/legal-case/card-table-line";
import React from "react";

export type CardTableLineTemplate = {
  Label: React.ReactNode;
  Data: React.ReactNode | React.ReactNode[];
  action?: { id: string; defaultValue: string; trailingIcon?: string };
};

type Props = {
  Columns: React.ReactNode[];
  lines: CardTableLineTemplate[];
  onSubmit?: (data: CardTableLineForm, onSuccess: () => void) => void;
  showLoader?: boolean;
};

export const CardTable: React.FC<Props> = ({ Columns, lines, onSubmit, showLoader = false }) => {
  const showActionTd = lines.some((l) => !!l.action);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr className="uppercase">
            {Columns.map((Column, idx) => (
              <th
                key={`card-table-col-${idx}`}
                scope="col"
                className={classNames(
                  { "py-3.5 pl-4 pr-3 sm:pl-6": idx === 0, "px-3 py-3.5": idx > 0 },
                  "text-left text-sm font-semibold text-gray-900",
                )}
                colSpan={Columns.length < 2 ? 2 : 1}
              >
                {Column}
              </th>
            ))}
            {showActionTd && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {lines.map((line, idx) => (
            <CardTableLine
              key={`card-table-line-${idx}`}
              idx={idx}
              line={line}
              showLoader={showLoader}
              onSubmit={onSubmit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
