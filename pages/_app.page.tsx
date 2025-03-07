import "../styles/globals.css";
import { QueryClient } from "@tanstack/query-core";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosHttpClient } from "infrastructure/http/axios-http.client";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Layout } from "presentation/web/core/components/layout/layout";
import { useCreateNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { NotificationOverlay } from "presentation/web/core/shared/notifications/notification-overlay";
import { DepsContainerContextProvider } from "presentation/web/core/shared/use-deps-container.hook";
import { NookiesFrontService } from "presentation/web/infrastructure/cookies/nookies-front.service";
import { FirebaseAuthService } from "presentation/web/infrastructure/firebase/firebase-auth.service";
import { NextRouter } from "presentation/web/infrastructure/next/next-router";
import { ReactQueryRemoteQueryService } from "presentation/web/infrastructure/react-query/react-query-remote-query.service";
import { useReactQueryRemoteCommand } from "presentation/web/infrastructure/react-query/use-react-query-remote-command.hook";
import { useReactQueryRemoteQuery } from "presentation/web/infrastructure/react-query/use-react-query-remote-query.hook";
import React, { useState } from "react";
import "reflect-metadata";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());

  const authService = new FirebaseAuthService();
  authService.initialize();

  return (
    <DepsContainerContextProvider
      httpClient={new AxiosHttpClient()}
      useRemoteQuery={useReactQueryRemoteQuery}
      useRemoteCommand={useReactQueryRemoteCommand}
      remoteQueryService={new ReactQueryRemoteQueryService(queryClient)}
      router={new NextRouter(useRouter())}
      authService={authService}
      cookiesService={new NookiesFrontService()}
      notificationContext={useCreateNotificationContext()}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout title={pageProps.title} user={pageProps.user}>
            <Component {...pageProps} />
            <NotificationOverlay />
            <ReactQueryDevtools initialIsOpen={false} />
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </DepsContainerContextProvider>
  );
};

export default App;
