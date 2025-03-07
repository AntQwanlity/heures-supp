export type RemoteCommandTemplate<TArgs = void, TPathArgs = void, TResult = void> = {
  method?: "POST" | "DELETE" | "GET";
  path: (args: TPathArgs) => string;
};

export class RemoteCommand<TArgs, TPathArgs, TResult> {
  constructor(
    readonly send: (
      args: TArgs,
      onSuccess?: (result: TResult) => void,
      onError?: (error: any) => void,
    ) => void,
    readonly isLoading: boolean,
  ) {}
}
