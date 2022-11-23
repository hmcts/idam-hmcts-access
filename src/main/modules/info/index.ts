import os from 'os';
import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

export class InfoCheck {
  public enableFor(app: Application): void {
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
}
