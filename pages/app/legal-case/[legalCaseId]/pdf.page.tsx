import { GetServerSideProps } from "next";
import { PdfPage, PdfPageProps } from "presentation/web/core/components/pdf/pdf-page";
import { createGetServerSideProps } from "presentation/web/infrastructure/next/server/createGetServerSideProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(PdfPage);

export const getServerSideProps: GetServerSideProps<PdfPageProps, { legalCaseId: string }> =
  createGetServerSideProps("Export PDF", [], false);
