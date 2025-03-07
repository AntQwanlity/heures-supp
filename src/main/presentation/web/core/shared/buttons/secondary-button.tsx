import { Button, ButtonProps } from "presentation/web/core/shared/buttons/button";
import React from "react";

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <Button
    {...props}
    className={`text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-blue-600 ${props.className}`}
  >
    {props.children}
  </Button>
);
