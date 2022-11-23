import * as process from 'process';
import { Logger } from '@hmcts/nodejs-logging';
import { defaultClient } from 'applicationinsights';
import { InjectionMode, asClass, asValue, createContainer } from 'awilix';
import { Application } from 'express';
import { glob } from 'glob';
const logger = Logger.getLogger('app');

export class Container {
  public enableFor(app: Application): void {
    const injectables = {
      logger: asValue(logger),
      telemetryClient: asValue(defaultClient),
    };

    glob
      .sync(process.cwd() + '/src/main/controllers/**/*.+(ts|js)')
      .map(filename => require(filename).default)
      .forEach(clasObject => {
        const registerName = clasObject.name.charAt(0).toLowerCase() + clasObject.name.slice(1);
        injectables[registerName] = asClass(clasObject);
      });

    app.locals.container = createContainer({ injectionMode: InjectionMode.CLASSIC }).register(injectables);
  }
}
