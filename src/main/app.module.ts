import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Global, Module, Scope } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@sendinblue/client";
import { QueryClient } from "@tanstack/query-core";
import { AuthModule } from "core/components/auth/auth.module";
import { CMSModule } from "core/components/cms/cms.module";
import { LawyerModule } from "core/components/lawyer/lawyer.module";
import { LegalCaseModule } from "core/components/legal-case/legal-case.module";
import { GoogleAuthClient } from "core/ports/auth/google-auth.client";
import { CMSService } from "core/ports/cms/cms.service";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { HashingService } from "core/ports/hash/hashing.service";
import { HttpClient } from "core/ports/http/http-client";
import { HydrationService } from "core/ports/hydration/hydration.service";
import { MailClient } from "core/ports/mail/mail.client";
import { PDFService } from "core/ports/pdf/pdf.service";
import { SecretRepository } from "core/ports/secret/secret.repository";
import { GoogleAuth } from "google-auth-library";
import { GoogleAuthApiClient } from "infrastructure/auth/google-auth.api-client";
import { StrapiService } from "infrastructure/cms/strapi.service";
import { NookiesBackService } from "infrastructure/cookies/nookies-back.service";
import { BCryptHashingService } from "infrastructure/hash/bcrypt-hashing.service";
import { AxiosHttpClient } from "infrastructure/http/axios-http.client";
import { ReactQueryHydrationService } from "infrastructure/hydration/react-query-hydration.service";
import { SendinblueMailClient } from "infrastructure/mail/sendinblue-mail.client";
import { ReactPDFService } from "infrastructure/pdf/react-pdf.service";
import { GCPSecretRepository } from "infrastructure/secret/gcp-secret.repository";
import { LocalSecretRepository } from "infrastructure/secret/local-secret.repository";
import { ServerModule } from "presentation/web/core/ports/server-module";
import { AuthAPIGuard } from "presentation/web/infrastructure/nest/auth-api.guard";
import { NestServerModule } from "presentation/web/infrastructure/nest/nest-server-module";

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 10,
    }),
    AuthModule,
    LegalCaseModule,
    LawyerModule,
    CMSModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthAPIGuard,
    },
    { provide: ServerModule, useClass: NestServerModule },
    SecretManagerServiceClient,
    {
      provide: SecretRepository,
      useClass:
        process.env.NODE_ENV === "development" ? LocalSecretRepository : GCPSecretRepository,
    },
    { provide: HttpClient, useClass: AxiosHttpClient },
    { provide: GoogleAuth, useClass: GoogleAuth },
    { provide: GoogleAuthClient, useClass: GoogleAuthApiClient },
    { provide: CMSService, useClass: StrapiService },
    {
      provide: CookiesService,
      useClass: NookiesBackService,
    },
    {
      provide: QueryClient,
      useClass: QueryClient,
      scope: Scope.REQUEST,
    },
    {
      provide: HydrationService,
      useClass: ReactQueryHydrationService,
    },
    { provide: HashingService, useClass: BCryptHashingService },
    {
      provide: TransactionalEmailsApi,
      inject: [SecretRepository],
      useFactory: async (secretRepo: SecretRepository) => {
        const api = new TransactionalEmailsApi();
        api.setApiKey(
          TransactionalEmailsApiApiKeys.apiKey,
          await secretRepo.get("sendinblue_api_key"),
        );
        return api;
      },
    },
    { provide: MailClient, useClass: SendinblueMailClient },
    { provide: PDFService, useClass: ReactPDFService },
  ],
  exports: [
    CookiesService,
    SecretRepository,
    HashingService,
    MailClient,
    HttpClient,
    PDFService,
    GoogleAuthClient,
    CMSService,
  ],
})
export class AppModule {}
