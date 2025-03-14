export default ({ env }: any) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    defaultHeaders: {
      Authorization: `Bearer ${env("WEBHOOK_TOKEN", "")}`,
    },
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
