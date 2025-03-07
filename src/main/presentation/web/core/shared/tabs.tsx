import classNames from "classnames";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import React from "react";

export type TabItem = {
  name: string;
  Component: React.ReactNode;
  count?: number;
};

type Props = {
  tabs: TabItem[];
  className?: string;
};

export const Tabs: React.FC<Props> = ({ tabs, className }) => {
  const router = useRouter();
  const tabIdxParam = +(router.findParam("tabIdx") || 0);
  const [selectedIdx, setSelectedIdx] = React.useState<number>(
    tabIdxParam && 0 <= tabIdxParam && tabIdxParam < tabs.length ? tabIdxParam : 0,
  );
  return (
    <div className="flex gap-5 flex-col">
      <div className={className}>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            defaultValue={tabs[selectedIdx].name}
            onChange={(e) => setSelectedIdx(e.target.selectedIndex)}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab, tabIdx) => (
                <button
                  key={tab.name}
                  className={classNames(
                    selectedIdx === tabIdx
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                    "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                  )}
                  aria-current={selectedIdx === tabIdx ? "page" : undefined}
                  onClick={() => {
                    setSelectedIdx(tabIdx);
                    router.setParam("tabIdx", tabIdx.toString());
                  }}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={classNames(
                        selectedIdx === tabIdx
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-900",
                        "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block",
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {tabs[selectedIdx].Component}
    </div>
  );
};
