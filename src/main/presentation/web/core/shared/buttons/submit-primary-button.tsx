import { ButtonIconComponent } from "presentation/web/core/shared/buttons/button-icons";
import { PrimaryButton } from "presentation/web/core/shared/buttons/primary-button";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  showSpinner: boolean;
  className?: string;
  onClick?: () => void;
  color?: "red" | "blue";
  LeadingIcon?: ButtonIconComponent;
  enabled?: boolean;
  enableDirtyOnly?: boolean;
  width?: "fit" | "full";
  formId?: string;
};

export const SubmitPrimaryButton: React.FC<Props> = ({
  label,
  showSpinner,
  className,
  onClick,
  color = "blue",
  LeadingIcon,
  enabled = true,
  enableDirtyOnly = false,
  width = "full",
  formId,
}) => {
  const formContext = useFormContext();
  return (
    <PrimaryButton
      label={showSpinner ? "" : label}
      LeadingIcon={showSpinner ? SpinnerIcon : LeadingIcon}
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={showSpinner || !enabled || (enableDirtyOnly && !formContext?.formState.isDirty)}
      className={className}
      color={color}
      width={width}
      formId={formId}
    />
  );
};
