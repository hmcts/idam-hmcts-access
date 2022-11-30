import config from 'config';
import { Application } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

export class Proxy {
  enableFor(app: Application): void {
    app.use(
      '/o/',
      createProxyMiddleware({
        target: config.get('services.idam.url.api'),
        changeOrigin: true,
        secure: true,
        onProxyReq: fixRequestBody,
      })
    );
  }
}
