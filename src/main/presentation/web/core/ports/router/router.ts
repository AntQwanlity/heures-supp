export interface Router {
  redirect(url: string): Promise<void>;
  reload(): void;
  findParam(param: string): string | undefined;
  getParam(param: string): string;
  setParam(param: string, value: string): void;
  pathStartsWith(str: string): boolean;
  pathContains(str: string): boolean;
  matchesExactPath(path: string): boolean;
}
