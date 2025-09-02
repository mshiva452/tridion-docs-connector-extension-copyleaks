import { getLocalFrontendAddon } from '@tridion-docs/extensions-cli';
import fs from 'fs';

export const getDevServerConfig = ({
    targetUrl,
    manifestPath,
    addonConfigPath,
}) => ({
    host: '0.0.0.0',
    port: 3010,
    allowedHosts: 'all',
    hot: false,
    compress: true,
    server: {
        type: 'https',
        options: {
            key: fs.readFileSync('./certificate/private.key'),
            ca: fs.readFileSync('./certificate/private.pem'),
            cert: fs.readFileSync('./certificate/private.crt'),
          },
    },
    open: 'https://localhost:3010/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        'X-UA-Compatible': 'IE=edge',
        'X-Frame-Options': 'DENY',
        'X-DNS-Prefetch-Control': 'on',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
    },
    proxy: [
        {
            context: ['/api'],
            target: targetUrl,
            changeOrigin: true,
        },
        {
            context: ['**'],
            target: targetUrl,
            secure: false,
            onProxyReq: proxyReq => {
                if (proxyReq.getHeader('origin')) {
                  proxyReq.setHeader('origin', targetUrl);
                }
            }

        },
    ],
    setupMiddlewares: (middlewares, { app }) => {

        app.get(`*/extensions/extensions`, (req, res) => {
            const localAddon = getLocalFrontendAddon({
                manifestPath,
                addonConfigPath,
            });
            const response = [localAddon];

            res.json(response);
        });

        return middlewares;
    },
});
