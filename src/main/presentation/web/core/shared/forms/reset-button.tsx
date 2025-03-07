import { ButtonLink } from "presentation/web/core/shared/buttons/button-link";
import React, { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

type Props = PropsWithChildren & {
  onClick?: () => void;
  className?: string;
};
export const FormResetButton: React.FC<Props> = ({ onClick, className, children }) => {
  const { reset } = useFormContext();
  return (
    <ButtonLink
      onClick={() => {
        reset();
        onClick?.();
      }}
      className={className}
    >
      {children}
    </ButtonLink>
  );
};
