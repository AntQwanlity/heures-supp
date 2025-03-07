import { LegalCaseSalariesPeriodsRemoteQueryPrefetch } from "core/components/legal-case/application/legal-case-salaries-periods.remote-query-prefetch";
import { LegalCasesRemoteQueryPrefetch } from "core/components/legal-case/application/legal-cases.remote-query-prefetch";
import { GetServerSideProps } from "next";
import {
  SalariesPage,
  SalariesPageProps,
} from "presentation/web/core/components/salaries/salaries-page";
import { createGetServerSideProps } from "presentation/web/infrastructure/next/server/createGetServerSideProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(SalariesPage);

export const getServerSideProps: GetServerSideProps<SalariesPageProps, { legalCaseId: string }> =
  createGetServerSideProps("Salaires perçus", [
    LegalCaseSalariesPeriodsRemoteQueryPrefetch,
    LegalCasesRemoteQueryPrefetch,
  ]);
