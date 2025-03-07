"use client";

import { QueryClient } from "@tanstack/query-core";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosHttpClient } from "infrastructure/http/axios-http.client";
import { useRouter } from "next/router";
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

type Props = {
  dehydratedState: unknown;
};

export const App: React.FC<React.PropsWithChildren<Props>> = ({ children, dehydratedState }) => {
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
        <Hydrate state={dehydratedState}>
          {children}
          <NotificationOverlay />
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </DepsContainerContextProvider>
  );
};
