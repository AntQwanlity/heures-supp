import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ServerModule } from "presentation/web/core/ports/server-module";

@Injectable()
export class NestServerModule implements ServerModule {
  constructor(private readonly app: ModuleRef) {}

  async get<T>(type: Type<T> | Function): Promise<T> {
    return this.app.get(type, { strict: false });
  }
}
