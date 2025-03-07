export interface Request<TResult, TContext, TProps> {
  get context(): TContext;

  findQueryParam(name: string): string | undefined;
  getQueryParam(name: string): string;

  findParam(name: string): string | undefined;
  getParam(name: string): string;

  unauthorized(): TResult;

  notFound(): TResult;

  success(props: TProps): TResult;
}
