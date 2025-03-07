export type RemoteQueryTemplate<TSerializedData, TUnserializedData, TPathArgs> = {
  id: string;
  path: (args: TPathArgs) => string;
  unserialize: (d: TSerializedData) => TUnserializedData;
};

export abstract class RemoteQuery<TSerializedData, TUnserializedData, TPathArgs> {
  protected constructor(
    readonly template: RemoteQueryTemplate<TSerializedData, TUnserializedData, TPathArgs>,
    readonly serializedData?: TSerializedData,
  ) {}

  get data(): TUnserializedData | undefined {
    if (this.serializedData === undefined) return undefined;

    return this.template.unserialize(this.serializedData);
  }

  abstract refetch(): Promise<void>;
}
