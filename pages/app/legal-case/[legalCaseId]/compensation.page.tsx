import { LegalCaseHoursRecallRemoteQueryPrefetch } from "core/components/legal-case/application/legal-case-hours-recall.remote-query-prefetch";
import { LegalCasesRemoteQueryPrefetch } from "core/components/legal-case/application/legal-cases.remote-query-prefetch";
import { GetServerSideProps } from "next";
import {
  CompensationPage,
  CompensationPageProps,
} from "presentation/web/core/components/compensation/compensation-page";
import { createGetServerSideProps } from "presentation/web/infrastructure/next/server/createGetServerSideProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(CompensationPage);

export const getServerSideProps: GetServerSideProps<
  CompensationPageProps,
  { legalCaseId: string }
> = createGetServerSideProps("Indemnités", [
  LegalCaseHoursRecallRemoteQueryPrefetch,
  LegalCasesRemoteQueryPrefetch,
]);
