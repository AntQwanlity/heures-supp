import classNames from "classnames";
import { Link, LinkProps } from "presentation/web/core/shared/links/link";
import React, { PropsWithChildren } from "react";

type Props = LinkProps & {};

export const PrimaryLink: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
  ...props
}) => (
  <Link
    className={classNames(
      "font-medium text-blue-600 hover:text-blue-700 hover:underline",
      className,
    )}
    {...props}
  >
    {children}
  </Link>
);
