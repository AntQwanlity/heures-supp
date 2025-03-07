import { UUIDService } from "core/ports/UUIDService";
import { randomUUID } from "crypto";

const Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class RandomUUIDService implements UUIDService {
  random(): string {
    return randomUUID();
  }

  isValid(uuid: string): boolean {
    return Regex.test(uuid);
  }
}
