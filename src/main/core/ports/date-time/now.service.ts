import { DateTime } from "DateTime";

export abstract class NowService {
  abstract get(): DateTime;
}
