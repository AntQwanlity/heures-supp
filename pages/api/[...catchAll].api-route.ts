import { Server } from "http";
import { getNestApp } from "infrastructure/nest-app";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async (resolve) => {
    const app = await getNestApp();
    const server: Server = app.getHttpServer();
    const [listener] = server.listeners("request") as NextApiHandler[];
    listener(req, res);
    res.on("finish", resolve);
  });
};

export default handler;
