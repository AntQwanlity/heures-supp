import { User } from "core/components/auth/domain/user";
import Head from "next/head";
import { AppLayout } from "presentation/web/core/components/layout/app-layout";
import { BaseLayout } from "presentation/web/core/components/layout/base-layout";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { GTMScript } from "presentation/web/infrastructure/analytics/gtm-script";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  user?: User;
}>;

export const Layout: React.FC<Props> = ({ title, user, children }) => {
  const router = useRouter();

  const useAppLayout = router.pathStartsWith("/app/legal-case");

  return (
    <>
      <Head>
        <title>{`heures-supp.fr - ${title}`}</title>
        <meta name="description" content="Heures supp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GTMScript />
      {useAppLayout ? (
        <AppLayout user={user}>{children}</AppLayout>
      ) : (
        <BaseLayout>{children}</BaseLayout>
      )}
    </>
  );
};
