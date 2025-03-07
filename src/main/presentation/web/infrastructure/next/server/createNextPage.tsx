import { NextPage } from "next";
import React from "react";

export const createNextPage = <PageProps,>(
  PageComponent: React.ComponentType<PageProps>,
): NextPage<PageProps & {}> => {
  const component = (props: PageProps & {}) => <PageComponent {...props} />;
  return component;
};
