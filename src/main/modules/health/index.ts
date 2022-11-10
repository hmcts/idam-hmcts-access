import os from 'os';
import healthcheck from '@hmcts/nodejs-healthcheck';
import config from 'config';
import { Application } from 'express';

export class HealthCheck {
  public enableFor(app: Application): void {
    const healthOptions = () => ({
      timeout: config.get('health.timeout'),
      deadline: config.get('health.deadline'),
    });

    // Services
    const idamApi = healthcheck.web(config.get('services.idam.url.api') + '/health', healthOptions);
    const redis = healthcheck.raw(() => (app.locals.redisClient.ping() ? healthcheck.up() : healthcheck.down()));

    const checks = {
      idamApi,
      ...(app.locals.redisClient && { redis }),
    };

    healthcheck.addTo(app, {
      checks,
      buildInfo: {
        name: config.get('services.name'),
        host: os.hostname(),
        uptime: process.uptime(),
      },
    });
  }
}
