import { Injectable } from "@nestjs/common";
import { DateTime } from "DateTime";
import { NowService } from "core/ports/date-time/now.service";
import dayjs from "dayjs";

@Injectable()
export class DayjsNowService implements NowService {
  get(): DateTime {
    return DateTime.fromDate(dayjs().locale("fr").toDate());
  }
}
