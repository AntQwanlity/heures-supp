import classNames from "classnames";
import {
  SalariesTableLine,
  SalariesTableLineForm,
} from "presentation/web/core/components/salaries/salaries-table-line";
import React, { Fragment, useState } from "react";

export type SalariesTableLineTemplate = {
  Label: React.ReactNode;
  Data: React.ReactNode | React.ReactNode[];
  action?: { id: string; defaultValue: string; trailingIcon?: string };
};

type Props = {
  title: string;
  subTitle?: string;
  btnLabel?: string;
  Columns: React.ReactNode[];
  linesGroups: { category: string; lines: SalariesTableLineTemplate[] }[];
  onSubmit?: (data: SalariesTableLineForm, onSuccess?: () => void) => void;
  showLoader?: boolean;
};

export const SalariesTable: React.FC<Props> = ({
  title,
  subTitle,
  btnLabel,
  Columns,
  linesGroups,
  onSubmit,
  showLoader = false,
}) => {
  const showActionTd = linesGroups.some((c) => c.lines.some((l) => !!l.action));

  const [editedSalaryId, setEditedSalaryId] = useState<string | undefined>(undefined);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-700">{subTitle}</p>
          </div>
          {btnLabel && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {btnLabel}
              </button>
            </div>
          )}
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full table-fixed">
                {Columns.length > 0 && (
                  <thead>
                    <tr>
                      {Columns.map((Column, idx) => (
                        <Fragment key={`card-table-col-${idx}`}>
                          <th
                            scope="col"
                            className={classNames(
                              " text-left text-sm font-semibold text-gray-900",
                              {
                                "py-3.5 pl-4 pr-3 sm:pl-3": idx === 0,
                                "px-3 py-3.5": idx > 0,
                              },
                            )}
                          >
                            {Column}
                          </th>
                        </Fragment>
                      ))}
                      {showActionTd && (
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                )}
                <tbody className="bg-white">
                  {linesGroups.map((linesGroup) => (
                    <Fragment key={linesGroup.category}>
                      {linesGroup.category.length > 0 && (
                        <tr className="border-t border-gray-200">
                          <th
                            colSpan={10}
                            scope="colgroup"
                            className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >
                            {linesGroup.category}
                          </th>
                        </tr>
                      )}
                      {linesGroup.lines.map((line, idx) => (
                        <SalariesTableLine
                          key={`salaries-table-line-${idx}`}
                          line={line}
                          idx={idx}
                          showLoader={showLoader}
                          onSubmit={(data) => {
                            if (onSubmit) onSubmit(data, () => setEditedSalaryId(undefined));
                          }}
                          editedId={editedSalaryId}
                          onEdit={setEditedSalaryId}
                        />
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
