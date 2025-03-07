import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const LegalCasesRemoteQueryTemplate: RemoteQueryTemplate<
  LegalCaseView[],
  LegalCase[],
  undefined
> = {
  id: "legal-cases",
  path: () => `legal-cases`,
  unserialize: (views) => views.map((v) => LegalCaseView.toDomain(v)),
};

export const useLegalCasesRemoteQuery = (
  enabled?: boolean,
  onSuccess?: (legalCases: LegalCaseView[]) => void,
) => {
  return useRemoteQuery({
    template: LegalCasesRemoteQueryTemplate,
    pathArgs: undefined,
    enabled,
    onSuccess,
  });
};
