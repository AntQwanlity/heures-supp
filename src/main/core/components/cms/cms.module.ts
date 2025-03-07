import { Module } from "@nestjs/common";
import { StrapiController } from "presentation/web/core/components/strapi/strapi.controller";

@Module({
  controllers: [StrapiController],
})
export class CMSModule {}
