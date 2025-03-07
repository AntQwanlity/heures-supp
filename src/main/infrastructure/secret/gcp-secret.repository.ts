import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Injectable } from "@nestjs/common";
import { SecretName, SecretRepository } from "core/ports/secret/secret.repository";

@Injectable()
export class GCPSecretRepository implements SecretRepository {
  private static ProjectIdSymbol = "[PROJECT-ID]";
  private static SecretNameSymbol = "[SECRET-NAME]";
  private static SecretFullNameTemplate = `projects/${GCPSecretRepository.ProjectIdSymbol}/secrets/${GCPSecretRepository.SecretNameSymbol}/versions/latest`;

  constructor(private readonly client: SecretManagerServiceClient) {}

  async get(name: SecretName): Promise<string> {
    const projectId = await this.client.getProjectId();

    const [response] = await this.client.accessSecretVersion({
      name: GCPSecretRepository.SecretFullNameTemplate.replace(
        GCPSecretRepository.ProjectIdSymbol,
        projectId,
      ).replace(GCPSecretRepository.SecretNameSymbol, name),
    });

    if (!response.payload?.data) throw new Error(`Cannot access secret ${name}`);
    return response.payload.data.toString();
  }
}
