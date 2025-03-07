import { GetStaticProps } from "next";
import {
  ResetPasswordPage,
  ResetPasswordPageProps,
} from "presentation/web/core/components/auth/reset-password-page";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(ResetPasswordPage);

export const getStaticProps: GetStaticProps<ResetPasswordPageProps> = createGetStaticProps(
  "Mot de passe oublié",
  () => Promise.resolve({}),
);
