export type SecretName =
  | "db_host"
  | "db_name"
  | "db_username"
  | "db_password"
  | "strapi_api_url"
  | "strapi_api_token"
  | "strapi_api_webhook_token"
  | "sendinblue_api_key";

export abstract class SecretRepository {
  abstract get(name: SecretName): Promise<string>;
}
