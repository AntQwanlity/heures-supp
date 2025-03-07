import classNames from "classnames";
import React, { PropsWithChildren } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const ButtonLink: React.FC<Props> = ({ onClick, className, children }) => {
  return (
    <span
      onClick={onClick}
      className={classNames(
        "hover:cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:underline",
        className,
      )}
    >
      {children}
    </span>
  );
};
