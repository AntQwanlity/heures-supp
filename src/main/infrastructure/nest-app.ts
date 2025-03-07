import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "app.module";
import helmet from "helmet";
import { getSingleton } from "infrastructure/Singleton";
import permissionsPolicy from "permissions-policy";

const NextApiUrlPrefix = "api";

export const getNestApp = () =>
  getSingleton("nest-app", async () => {
    Logger.warn("Creating NestJS app");
    const newApp = await NestFactory.create(AppModule, {
      rawBody: true, // Needed for Stripe Webhooks
      bodyParser: false, // NextJS handles body parsing. See https://github.com/Skn0tt/nextjs-nestjs-integration-example/issues/2#issuecomment-615846579
    });
    newApp.setGlobalPrefix(NextApiUrlPrefix);
    newApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    newApp.use(helmet());
    newApp.use(
      permissionsPolicy({
        features: {
          vibrate: ["none"],
        },
      }),
    );
    return newApp.init();
  });
