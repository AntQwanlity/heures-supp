import classNames from "classnames";
import { Button, ButtonProps } from "presentation/web/core/shared/buttons/button";
import React, { PropsWithChildren } from "react";

type Props = ButtonProps & {
  color?: "red" | "blue";
  width?: "fit" | "full";
};

export const PrimaryButton: React.FC<PropsWithChildren<Props>> = ({
  color = "blue",
  width = "full",
  ...props
}) => (
  <Button
    {...props}
    className={classNames(
      "flex justify-center text-white",
      {
        "w-full": width === "full",
        "w-fit": width === "fit",
        "bg-red-600 hover:bg-red-700 disabled:bg-red-100 focus:ring-red-600": color === "red",
        "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-100 focus:ring-blue-600": color === "blue",
      },
      props.className,
    )}
  >
    {props.children}
  </Button>
);
