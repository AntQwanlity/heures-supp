export abstract class ServerModule {
  abstract get<T>(type: { new (...args: any[]): T } | Function): Promise<T>;
}
