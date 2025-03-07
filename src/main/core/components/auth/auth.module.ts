import { Module } from "@nestjs/common";
import { AuthAppService } from "core/components/auth/application/auth.app-service";
import { FirebaseAuthService } from "core/components/auth/application/firebase-auth.service";
import { FirebaseUserRepository } from "core/components/auth/application/firebase-user.repository";
import { UserRepository } from "core/components/auth/application/user.repository";
import { ExternalAuthService } from "core/ports/auth/external-auth.service";
import { FirebaseAuthClient } from "core/ports/auth/firebase-auth.client";
import { DateTimeModule } from "core/ports/date-time/date-time.module";
import { FirebaseAuthAPIClient } from "infrastructure/auth/firebase-auth.api.client";
import { PrismaFirebaseUserRepository } from "infrastructure/persistence/prisma/prisma-firebase-user.repository";
import { PrismaUserRepository } from "infrastructure/persistence/prisma/prisma-user.repository";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";
import { PrismaModule } from "infrastructure/persistence/prisma/prisma.module";
import { PrismaService } from "infrastructure/persistence/prisma/prisma.service";
import { AuthController } from "presentation/web/core/components/auth/auth.controller";

@Module({
  providers: [
    AuthAppService,
    { provide: ExternalAuthService, useClass: FirebaseAuthService },
    { provide: FirebaseAuthClient, useClass: FirebaseAuthAPIClient },
    {
      provide: UserRepository,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) =>
        new PrismaUserRepository(new PrismaDelegate(prismaService, "user")),
    },
    {
      provide: FirebaseUserRepository,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) =>
        new PrismaFirebaseUserRepository(new PrismaDelegate(prismaService, "firebaseUser")),
    },
  ],
  controllers: [AuthController],
  imports: [PrismaModule, DateTimeModule],
  exports: [ExternalAuthService, UserRepository], // needed for AuthGuard in AppModule
})
export class AuthModule {}
