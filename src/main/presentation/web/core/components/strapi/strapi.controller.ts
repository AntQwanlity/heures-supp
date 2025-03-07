import { Body, Controller, Headers, Logger, Post, Response } from "@nestjs/common";
import { SecretRepository } from "core/ports/secret/secret.repository";
import type { NextApiResponse } from "next";
import { Public } from "presentation/web/infrastructure/nest/auth-api.guard";

type StrapiWebhookPayload = {
  event:
    | "entry.create"
    | "entry.update"
    | "entry.delete"
    | "entry.publish"
    | "entry.unpublish"
    | "media.create"
    | "media.update"
    | "media.delete";
  model?: string;
  entry?: any;
  media?: { name: string; url: string };
};

@Controller()
export class StrapiController {
  private static StaticPagesUrls = ["/", "/blog"];

  constructor(private readonly secretRepository: SecretRepository) {}

  @Public()
  @Post("cms/revalidate")
  async revalidate(
    @Response() res: NextApiResponse,
    @Headers("Authorization") authorizationHeader: string,
    @Body() payload: StrapiWebhookPayload,
  ): Promise<void> {
    Logger.log(`Webhook request received. Event name : ${payload.event}`);

    const webhookToken = await this.secretRepository.get("strapi_api_webhook_token");

    if (authorizationHeader !== `Bearer ${webhookToken}`) {
      Logger.error(
        "Unauthorized webhook request : provided webhook token is invalid",
        authorizationHeader,
      );
      return;
    }

    Logger.log("Revalidating all pages...");

    const dynamicPagesUrls = payload.model === "blog-post" ? [`/blog/${payload.entry.slug}`] : [];

    await Promise.all(
      StrapiController.StaticPagesUrls.concat(dynamicPagesUrls).map((url) => {
        Logger.log(`Revalidating ${url}...`);
        return res.revalidate(url);
      }),
    );

    Logger.log("Revalidated all pages.");

    res.status(200).end();
  }
}
