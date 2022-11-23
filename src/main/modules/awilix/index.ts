import { Logger } from '@hmcts/nodejs-logging';
import { defaultClient } from 'applicationinsights';
import { Lifetime, asClass, createContainer, asValue } from 'awilix';
import { Application } from 'express';

export class Container {
  public enableFor(app: Application): void {
    app.locals.container = createContainer();

    app.locals.container.loadModules(['src/main/controllers/**/*.ts'], {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    });

    app.locals.container.register({
      logger: asValue(Logger.getLogger('app')),
      telemetryClient: asValue(defaultClient),
    });
  }
}
