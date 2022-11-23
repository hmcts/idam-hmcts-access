import os from 'os';
import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);

  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'expressjs-template',
        uptime: process.uptime(),
      },
      info: {},
    })
  );
}
