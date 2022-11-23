import os from 'os';
import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

export default function (app: Application): void {
  const cradle = app.locals.container.cradle;
  app.get('/', cradle.homeController.get);

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
