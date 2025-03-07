import { DailyWorkedHoursRemoteQueryPrefetch } from "core/components/legal-case/application/daily-worked-hours.remote-query-prefetch";
import { LegalCasesRemoteQueryPrefetch } from "core/components/legal-case/application/legal-cases.remote-query-prefetch";
import { GetServerSideProps } from "next";
import {
  WorkedHoursPage,
  WorkedHoursPageProps,
} from "presentation/web/core/components/worked-hours/worked-hours-page";
import { createGetServerSideProps } from "presentation/web/infrastructure/next/server/createGetServerSideProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(WorkedHoursPage);

export const getServerSideProps: GetServerSideProps<WorkedHoursPageProps, { legalCaseId: string }> =
  createGetServerSideProps(
    "Heures travaillées",
    [DailyWorkedHoursRemoteQueryPrefetch, LegalCasesRemoteQueryPrefetch],
    false,
  );
