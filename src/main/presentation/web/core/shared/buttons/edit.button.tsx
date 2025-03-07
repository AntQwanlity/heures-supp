import { ButtonLink } from "presentation/web/core/shared/buttons/button-link";
import React from "react";

type Props = {
  onClick: () => void;
};

export const EditButton: React.FC<Props> = ({ onClick }) => {
  return (
    <ButtonLink onClick={onClick} className="text-xs">
      Modifier
    </ButtonLink>
  );
};
