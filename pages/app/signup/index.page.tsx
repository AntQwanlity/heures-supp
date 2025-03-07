import { GetStaticProps } from "next";
import { SignUpPage, SignUpPageProps } from "presentation/web/core/components/auth/sign-up-page";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";
import React from "react";

export default createNextPage(SignUpPage);

export const getStaticProps: GetStaticProps<SignUpPageProps> = createGetStaticProps(
  "Inscription",
  () => Promise.resolve({}),
);
