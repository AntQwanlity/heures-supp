import { Module } from "@nestjs/common";
import { NowService } from "core/ports/date-time/now.service";
import { DayjsNowService } from "infrastructure/date-time/dayjs-now.service";

@Module({
  providers: [{ provide: NowService, useClass: DayjsNowService }],
  exports: [NowService],
})
export class DateTimeModule {}
