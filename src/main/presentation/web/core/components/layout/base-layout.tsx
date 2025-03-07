import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

export const BaseLayout: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};
