import { Module } from "@nestjs/common";
import { LegalCaseAppService } from "core/components/legal-case/application/legal-case-app.service";
import { LegalCaseRepository } from "core/components/legal-case/application/legal-case.repository";
import { PrismaLegalCaseRepository } from "infrastructure/persistence/prisma/prisma-legal-case.repository";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";
import { PrismaModule } from "infrastructure/persistence/prisma/prisma.module";
import { PrismaService } from "infrastructure/persistence/prisma/prisma.service";
import { LegalCaseController } from "presentation/web/core/components/legal-case/legal-case.controller";

@Module({
  providers: [
    LegalCaseAppService,
    {
      provide: LegalCaseRepository,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) =>
        new PrismaLegalCaseRepository(new PrismaDelegate(prismaService, "legalCase")),
    },
  ],
  controllers: [LegalCaseController],
  exports: [LegalCaseAppService],
  imports: [PrismaModule],
})
export class LegalCaseModule {}
