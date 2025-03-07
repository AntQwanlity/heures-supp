export abstract class UUIDService {
  abstract random(): string;

  abstract isValid(uuid: string): boolean;
}
