import { Injectable } from "@nestjs/common";
import { CMSService } from "core/ports/cms/cms.service";
import { HttpClient } from "core/ports/http/http-client";
import { SecretRepository } from "core/ports/secret/secret.repository";

@Injectable()
export class StrapiService implements CMSService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly secretRepository: SecretRepository,
  ) {}

  getImageUrl(image: string): string {
    return process.env.NODE_ENV === "development" ? `http://127.0.0.1:1337${image}` : image;
  }

  private async getSecrets(): Promise<{ url: string; token: string }> {
    const url = await this.secretRepository.get("strapi_api_url");
    const token = await this.secretRepository.get("strapi_api_token");

    return { url, token };
  }

  async findOne<T>(name: string, filters?: [string, string][]): Promise<T | undefined> {
    if (filters) {
      const results = await this.getMany<T>(name, filters);
      if (results.length !== 1) return undefined;

      return results[0];
    }

    const { url, token } = await this.getSecrets();

    const result = await this.httpClient.get<{ data: { attributes: T } }>(
      `${url}/api/${name}?populate=deep`,
      token,
    );

    return result.data.attributes;
  }

  async getOne<T>(name: string, filters?: [string, string][]): Promise<T> {
    const result = await this.findOne<T>(name, filters);

    if (!result)
      throw new Error(
        `Could not find Strapi object '${name}' with filters: ${JSON.stringify(filters)}`,
      );

    return result;
  }

  async getMany<T>(name: string, filters?: [string, string][]): Promise<T[]> {
    const { url, token } = await this.getSecrets();

    const result = await this.httpClient.get<{ data: { attributes: T }[] }>(
      `${url}/api/${name}?populate=deep${(filters || []).map(
        (filter) => `&filters[${filter[0]}][$eq]=${filter[1]}`,
      )}`,
      token,
    );

    return result.data.map((item) => item.attributes);
  }
}
