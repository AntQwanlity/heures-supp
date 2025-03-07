import { Module } from "@nestjs/common";
import { AuthModule } from "core/components/auth/auth.module";
import { LawyerAppService } from "core/components/lawyer/application/lawyer-app.service";
import { LawyerRepository } from "core/components/lawyer/application/lawyer.repository";
import { LegalCaseModule } from "core/components/legal-case/legal-case.module";
import { DateTimeModule } from "core/ports/date-time/date-time.module";
import { PrismaLawyerRepository } from "infrastructure/persistence/prisma/prisma-lawyer.repository";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";
import { PrismaModule } from "infrastructure/persistence/prisma/prisma.module";
import { PrismaService } from "infrastructure/persistence/prisma/prisma.service";
import { LawyerController } from "presentation/web/core/components/lawyer/lawyer.controller";

@Module({
  providers: [
    LawyerAppService,
    {
      provide: LawyerRepository,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) =>
        new PrismaLawyerRepository(new PrismaDelegate(prismaService, "lawyer")),
    },
  ],
  controllers: [LawyerController],
  imports: [PrismaModule, AuthModule, DateTimeModule, LegalCaseModule],
})
export class LawyerModule {}
