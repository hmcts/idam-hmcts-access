import templateContent from '../../steps/common/template';
import { Express } from 'express';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';

enum SupportedLanguages {
  EN = 'en',
  CY = 'cy',
}

type ViewDataLocale = {
  [SupportedLanguages.EN]: Object;
  [SupportedLanguages.CY]?: Object;
};

type ViewData = {
  content?: ViewDataLocale;
  data?: Object;
};

export class LanguageToggle {
  constructor() {
    i18next.use(i18nextMiddleware.LanguageDetector).init({
      fallbackLng: SupportedLanguages.EN,
      supportedLngs: [SupportedLanguages.EN, SupportedLanguages.CY],
      detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie'],
      },
    });
  }

  public enableFor(app: Express): void {
    app.use(i18nextMiddleware.handle(i18next));

    app.use((req, res, next) => {
      const _render = res.render;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.render = function (view, options: ViewData = {}, callback?): void {
        (_render as Function).call(
          this,
          view,
          {
            ...options,
            content: getLocaleContent(res.locals.language, options.content),
          },
          callback
        );
      };

      next();
    });
  }
}

function getLocaleContent(language: SupportedLanguages, content?: ViewDataLocale | {}) {
  return {
    template: {
      ...templateContent[SupportedLanguages.EN],
      ...templateContent[language],
    },
    ...content?.[SupportedLanguages.EN],
    ...content?.[language],
  };
}
