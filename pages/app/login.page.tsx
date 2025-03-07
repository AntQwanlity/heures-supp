import { GetStaticProps } from "next";
import { LoginPage, LoginPageProps } from "presentation/web/core/components/auth/login-page";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(LoginPage);

export const getStaticProps: GetStaticProps<LoginPageProps> = createGetStaticProps(
  "Connexion",
  () => Promise.resolve({}),
);
