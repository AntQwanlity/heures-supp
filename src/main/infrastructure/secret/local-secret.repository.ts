import { Injectable } from "@nestjs/common";
import { SecretName, SecretRepository } from "core/ports/secret/secret.repository";

const localSecrets: Record<SecretName, string> = {
  db_host: "127.0.0.1", // If running inside docker, use "db" instead, it's the name of the DB Docker container in config/local/docker-compose.yaml. See https://docs.docker.com/compose/networking/
  db_name: "postgres",
  db_username: "postgres",
  db_password: "postgres",
  strapi_api_url: "http://127.0.0.1:1337",
  strapi_api_token:
    "b0c00562c490d73c1af602867cf1c3457c80d6b48b2fe14db6a9ff03df63ad62a45f39a05f9bc8c1d607c05fc5b796a09ccf2d9b5e2fd72406e68840712df8b7749f1b4178b6ad8e89e7b308c915538d607ad80c346277a9f0ea9f93f4f6ed5408bf749a6daf9cadcd5c1dd4c697bc70c970877060e93d01fd2e99256d77cb23",
  strapi_api_webhook_token: "WEBHOOK",
  sendinblue_api_key: "",
};

@Injectable()
export class LocalSecretRepository implements SecretRepository {
  get(name: SecretName): Promise<string> {
    return Promise.resolve(localSecrets[name]);
  }
}
