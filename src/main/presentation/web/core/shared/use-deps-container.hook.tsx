import { CookiesService } from "core/ports/cookies/cookies.service";
import { HttpClient } from "core/ports/http/http-client";
import { AuthService } from "presentation/web/core/ports/auth/auth-service";
import { NotificationContext } from "presentation/web/core/ports/notifications/notification-context";
import { useRemoteCommandHook } from "presentation/web/core/ports/remote-command/use-remote-command.hook";
import { RemoteQueryService } from "presentation/web/core/ports/remote-query/remote-query.service";
import { useRemoteQueryHook } from "presentation/web/core/ports/remote-query/use-remote-query.hook";
import { Router } from "presentation/web/core/ports/router/router";
import React from "react";

type Props = {
  httpClient: HttpClient;
  useRemoteQuery: useRemoteQueryHook;
  useRemoteCommand: useRemoteCommandHook;
  remoteQueryService: RemoteQueryService;
  router: Router;
  authService: AuthService;
  cookiesService: CookiesService;
  notificationContext: NotificationContext;
};

const DepsContainerContext = React.createContext<Props | undefined>(undefined);

const DepsContainerContextProvider: React.FC<Props & { children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  return <DepsContainerContext.Provider value={props}>{children}</DepsContainerContext.Provider>;
};

const useDepsContainer = () => {
  const context = React.useContext(DepsContainerContext);

  if (context === undefined) {
    throw new Error("useDepsContainer must be used within a DepsContainerContextProvider");
  }

  return context;
};

export { DepsContainerContextProvider, useDepsContainer };
