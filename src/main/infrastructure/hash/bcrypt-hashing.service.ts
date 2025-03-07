import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { HashingService } from "core/ports/hash/hashing.service";

@Injectable()
export class BCryptHashingService extends HashingService {
  async hash(value: string): Promise<string> {
    return hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return compare(await this.hash(value), hash);
  }
}
