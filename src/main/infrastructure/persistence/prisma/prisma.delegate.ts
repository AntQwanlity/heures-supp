import { Prisma, PrismaClient } from "@prisma/client";
import {
  PrismaEntitiesKeys,
  PrismaService,
} from "infrastructure/persistence/prisma/prisma.service";

export type Model<K extends PrismaEntitiesKeys> = Awaited<
  ReturnType<PrismaClient[K]["findUniqueOrThrow"]>
>;

export type GenericUpdateInput<T extends PrismaEntitiesKeys> = Parameters<
  PrismaClient[T]["update"]
>[0]["data"];

type GenericCreateInput<T extends PrismaEntitiesKeys> = Parameters<
  PrismaClient[T]["create"]
>[0]["data"];

type GenericWhereInput<T extends PrismaEntitiesKeys> = Parameters<
  PrismaClient[T]["aggregate"]
>[0]["where"];

/**
 * Base delegate class
 *
 * We don't use Prisma Client Extensions atm because :
 * - they're a bit hard to work with
 * - they're in preview
 *
 * Generic type T is the model type
 * Generic type K is the model prisma[K] keys
 * */
export class PrismaDelegate<K extends PrismaEntitiesKeys, T extends Model<K> = Model<K>> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly modelName: K,
    private readonly pkName: string = "id",
  ) {}

  get delegate(): Prisma.TransactionClient[K] {
    return this.prismaService.getDelegateForModel(this.modelName);
  }

  async getByPk(pkValue: string): Promise<T> {
    // @ts-ignore
    return this.delegate.findUniqueOrThrow({
      where: { [this.pkName]: pkValue },
    });
  }

  async findByPk(pkValue: string): Promise<T | null> {
    // @ts-ignore
    return this.delegate.findUnique({
      where: { [this.pkName]: pkValue },
    });
  }

  async findMany(where: GenericWhereInput<K>): Promise<T[]> {
    // @ts-ignore
    return this.delegate.findMany({
      where,
    });
  }

  async getAll(): Promise<T[]> {
    // @ts-ignore
    return this.delegate.findMany();
  }

  async count(where: GenericWhereInput<K>): Promise<number> {
    // @ts-ignore
    return this.delegate.count({
      where,
    });
  }

  async update(data: T): Promise<T> {
    // @ts-ignore
    const pkValue = data[this.pkName];
    // @ts-ignore
    return this.delegate.update({
      where: { [this.pkName]: pkValue },
      data,
    });
  }

  async create(data: T): Promise<T> {
    // @ts-ignore
    return this.delegate.create({ data: data });
  }

  async createMany(data: T[]): Promise<void> {
    // @ts-ignore
    return this.delegate.createMany({ data });
  }

  async deleteMany(where: GenericWhereInput<K>): Promise<number> {
    // @ts-ignore
    const payload: Prisma.BatchPayload = await this.delegate.deleteMany({
      where,
    });

    return payload.count;
  }
}
