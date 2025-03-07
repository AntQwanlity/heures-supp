import { LegalCaseRemoteQueryPrefetch } from "core/components/legal-case/application/legal-case.remote-query-prefetch";
import { LegalCasesRemoteQueryPrefetch } from "core/components/legal-case/application/legal-cases.remote-query-prefetch";
import { GetServerSideProps } from "next";
import {
  ContractPage,
  ContractPageProps,
} from "presentation/web/core/components/contract/contract-page";
import { createGetServerSideProps } from "presentation/web/infrastructure/next/server/createGetServerSideProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(ContractPage);

export const getServerSideProps: GetServerSideProps<ContractPageProps, { legalCaseId: string }> =
  createGetServerSideProps("Contrat de travail", [
    LegalCaseRemoteQueryPrefetch,
    LegalCasesRemoteQueryPrefetch,
  ]);
