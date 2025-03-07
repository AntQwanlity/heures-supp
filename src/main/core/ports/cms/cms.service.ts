export abstract class CMSService {
  abstract getImageUrl(image: string): string;
  abstract findOne<T>(name: string, filters?: [string, string][]): Promise<T | undefined>;
  abstract getOne<T>(name: string, filters?: [string, string][]): Promise<T>;
  abstract getMany<T>(name: string, filters?: [string, string][]): Promise<T[]>;
}
