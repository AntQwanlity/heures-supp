import { Alert } from "presentation/web/core/shared/alert/alert";
import React from "react";

export const FinishContractAlert: React.FC<{ legalCaseId: string }> = ({ legalCaseId }) => {
  return (
    <div className="w-1/2 mx-auto">
      <Alert
        content="Veuillez terminer de paramétrer le contrat."
        linkLabel="Contrat"
        linkHref={`/app/legal-case/${legalCaseId}/contract`}
      />
    </div>
  );
};
